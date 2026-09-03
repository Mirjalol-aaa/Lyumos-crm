// Supabase Edge Function: click-webhook
// Implements Click Merchant protocol (Prepare & Complete actions with MD5 signature validation)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return new Response(JSON.stringify({ error: -8, error_note: 'Error in request from click' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const click_trans_id = form.get('click_trans_id')?.toString() || '';
  const service_id = form.get('service_id')?.toString() || '';
  const click_paydoc_id = form.get('click_paydoc_id')?.toString() || '';
  const merchant_trans_id = form.get('merchant_trans_id')?.toString() || '';
  const amount = parseFloat(form.get('amount')?.toString() || '0');
  const action = parseInt(form.get('action')?.toString() || '0', 10);
  const error = parseInt(form.get('error')?.toString() || '0', 10);
  const error_note = form.get('error_note')?.toString() || '';
  const sign_time = form.get('sign_time')?.toString() || '';
  const sign_string = form.get('sign_string')?.toString() || '';

  // 1. Verify MD5 Signature
  const secretKey = Deno.env.get('CLICK_SECRET_KEY') || 'TEST_SECRET_KEY';
  const rawSign = `${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${amount}${action}${sign_time}`;
  
  const hashBuffer = await crypto.subtle.digest(
    'MD5',
    new TextEncoder().encode(rawSign)
  );
  const computedSign = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (Deno.env.get('CLICK_SECRET_KEY') && computedSign !== sign_string) {
    return new Response(
      JSON.stringify({
        click_trans_id,
        merchant_trans_id,
        error: -1,
        error_note: 'SIGN CHECK FAILED!',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Fetch local transaction
  const { data: tx } = await supabase
    .from('payment_transactions')
    .select()
    .eq('id', merchant_trans_id)
    .single();

  if (!tx) {
    return new Response(
      JSON.stringify({
        click_trans_id,
        merchant_trans_id,
        error: -5,
        error_note: 'User does not exist',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (Math.abs(tx.amount - amount) > 0.01) {
    return new Response(
      JSON.stringify({
        click_trans_id,
        merchant_trans_id,
        error: -2,
        error_note: 'Incorrect parameter amount',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. ACTION = 0 (PREPARE)
  if (action === 0) {
    await supabase
      .from('payment_transactions')
      .update({
        provider_transaction_id: click_trans_id,
        status: 'pending',
      })
      .eq('id', tx.id);

    return new Response(
      JSON.stringify({
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: tx.id,
        error: 0,
        error_note: 'Success',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. ACTION = 1 (COMPLETE)
  if (action === 1) {
    if (error < 0) {
      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          comment: `Click error: ${error_note} (${error})`,
        })
        .eq('id', tx.id);

      return new Response(
        JSON.stringify({
          click_trans_id,
          merchant_trans_id,
          error,
          error_note,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mark as paid
    await supabase
      .from('payment_transactions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', tx.id);

    return new Response(
      JSON.stringify({
        click_trans_id,
        merchant_trans_id,
        merchant_confirm_id: tx.id,
        error: 0,
        error_note: 'Success',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      click_trans_id,
      merchant_trans_id,
      error: -3,
      error_note: 'Action not found',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
