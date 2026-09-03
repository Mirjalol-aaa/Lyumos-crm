// Supabase Edge Function: create-click-invoice
// Generates Click Merchant invoice and checkout URL

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
        provider: 'click',
        amount: amount,
        currency: 'UZS',
        academic_month: academicMonth || 'Current',
        status: 'pending',
      })
      .select()
      .single();

    if (txError) throw txError;

    // 2. Build Click checkout URL
    const serviceId = Deno.env.get('CLICK_SERVICE_ID') || 'TEST_SERVICE_ID';
    const merchantId = Deno.env.get('CLICK_MERCHANT_ID') || 'TEST_MERCHANT_ID';
    const callback = returnUrl || '';

    // Click checkout redirect URL:
    // https://my.click.uz/services/pay?service_id=...&merchant_id=...&amount=...&transaction_param=...&return_url=...
    const clickUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${tx.id}&return_url=${encodeURIComponent(callback)}`;

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: tx.id,
        checkoutUrl: clickUrl,
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
