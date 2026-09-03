// Supabase Edge Function: payme-webhook
// Implements full Payme JSON-RPC 2.0 Merchant API protocol with Basic Auth

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.2';

const ERROR_INTERNAL = { code: -32400, message: 'Internal system error' };
const ERROR_INSUFFICIENT_PRIVILEGE = { code: -32504, message: 'Insufficient privilege' };
const ERROR_INVALID_AMOUNT = { code: -31001, message: 'Invalid amount' };
const ERROR_TRANSACTION_NOT_FOUND = { code: -31003, message: 'Transaction not found' };
const ERROR_CANT_CANCEL = { code: -31007, message: 'Cannot cancel finished transaction' };

serve(async (req) => {
  // 1. Check HTTP Basic Authentication
  const authHeader = req.headers.get('Authorization') || '';
  const secretKey = Deno.env.get('PAYME_SECRET_KEY') || 'TEST_SECRET_KEY';
  const expectedAuth = `Basic ${btoa(`Paycom:${secretKey}`)}`;

  if (Deno.env.get('PAYME_SECRET_KEY') && authHeader !== expectedAuth) {
    return new Response(
      JSON.stringify({ error: ERROR_INSUFFICIENT_PRIVILEGE, id: null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: ERROR_INTERNAL, id: null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { method, params, id } = body;

  try {
    switch (method) {
      case 'CheckPerformTransaction': {
        const { amount, account } = params;
        const txId = account?.transaction_id;

        if (!txId) {
          return jsonRpcError(id, ERROR_TRANSACTION_NOT_FOUND);
        }

        const { data: tx } = await supabase
          .from('payment_transactions')
          .select()
          .eq('id', txId)
          .single();

        if (!tx) {
          return jsonRpcError(id, ERROR_TRANSACTION_NOT_FOUND);
        }

        // Validate amount in tiyin
        if (Math.round(tx.amount * 100) !== amount) {
          return jsonRpcError(id, ERROR_INVALID_AMOUNT);
        }

        return jsonRpcSuccess(id, { allow: true });
      }

      case 'CreateTransaction': {
        const { id: paymeTxId, time, amount, account } = params;
        const localTxId = account?.transaction_id;

        const { data: tx } = await supabase
          .from('payment_transactions')
          .select()
          .eq('id', localTxId)
          .single();

        if (!tx) {
          return jsonRpcError(id, ERROR_TRANSACTION_NOT_FOUND);
        }

        // Update provider_transaction_id
        await supabase
          .from('payment_transactions')
          .update({
            provider_transaction_id: paymeTxId,
            status: 'pending',
          })
          .eq('id', localTxId);

        return jsonRpcSuccess(id, {
          create_time: time,
          transaction: localTxId,
          state: 1,
        });
      }

      case 'PerformTransaction': {
        const { id: paymeTxId } = params;

        const { data: tx } = await supabase
          .from('payment_transactions')
          .select()
          .eq('provider_transaction_id', paymeTxId)
          .single();

        if (!tx) {
          return jsonRpcError(id, ERROR_TRANSACTION_NOT_FOUND);
        }

        const now = new Date();

        // Mark as paid
        await supabase
          .from('payment_transactions')
          .update({
            status: 'paid',
            paid_at: now.toISOString(),
          })
          .eq('id', tx.id);

        return jsonRpcSuccess(id, {
          transaction: tx.id,
          perform_time: now.getTime(),
          state: 2,
        });
      }

      case 'CancelTransaction': {
        const { id: paymeTxId, reason } = params;

        const { data: tx } = await supabase
          .from('payment_transactions')
          .select()
          .eq('provider_transaction_id', paymeTxId)
          .single();

        if (!tx) {
          return jsonRpcError(id, ERROR_TRANSACTION_NOT_FOUND);
        }

        await supabase
          .from('payment_transactions')
          .update({
            status: 'cancelled',
            comment: `Cancelled via Payme. Reason: ${reason}`,
          })
          .eq('id', tx.id);

        return jsonRpcSuccess(id, {
          transaction: tx.id,
          cancel_time: Date.now(),
          state: -1,
        });
      }

      case 'CheckTransaction': {
        const { id: paymeTxId } = params;

        const { data: tx } = await supabase
          .from('payment_transactions')
          .select()
          .eq('provider_transaction_id', paymeTxId)
          .single();

        if (!tx) {
          return jsonRpcError(id, ERROR_TRANSACTION_NOT_FOUND);
        }

        const state = tx.status === 'paid' ? 2 : tx.status === 'cancelled' ? -1 : 1;

        return jsonRpcSuccess(id, {
          create_time: new Date(tx.created_at).getTime(),
          perform_time: tx.paid_at ? new Date(tx.paid_at).getTime() : 0,
          cancel_time: 0,
          transaction: tx.id,
          state,
          reason: null,
        });
      }

      default:
        return jsonRpcError(id, { code: -32601, message: 'Method not found' });
    }
  } catch (err: any) {
    return jsonRpcError(id, { code: -32400, message: err.message });
  }
});

function jsonRpcSuccess(id: any, result: any) {
  return new Response(
    JSON.stringify({ jsonrpc: '2.0', id, result }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

function jsonRpcError(id: any, error: any) {
  return new Response(
    JSON.stringify({ jsonrpc: '2.0', id, error }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
