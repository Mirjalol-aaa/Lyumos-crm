// Supabase Edge Function: create-payme-transaction
// Generates Payme Merchant checkout parameters and records pending transaction

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { studentId, amount, academicMonth, returnUrl } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error('Valid payment amount is required');
    }

    // 1. Insert pending transaction
    const { data: tx, error: txError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        student_id: studentId || null,
        provider: 'payme',
        amount: amount,
        currency: 'UZS',
        academic_month: academicMonth || 'Current',
        status: 'pending',
      })
      .select()
      .single();

    if (txError) throw txError;

    // 2. Build Payme checkout URL
    const merchantId = Deno.env.get('PAYME_MERCHANT_ID') || 'TEST_PAYME_MERCHANT_ID';
    const amountInTiyin = Math.round(amount * 100); // Payme expects tiyin (1 UZS = 100 tiyin)
    
    // Base64 encode Payme parameters
    const paramsStr = `m=${merchantId};ac.transaction_id=${tx.id};ac.student_id=${studentId || 'DIRECT'};a=${amountInTiyin};c=${encodeURIComponent(returnUrl || '')}`;
    const base64Params = btoa(paramsStr);
    const checkoutUrl = `https://checkout.paycom.uz/${base64Params}`;

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: tx.id,
        checkoutUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
