-- ============================================================================
-- PAYMENT TRANSACTIONS TABLE (PAYME & CLICK)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  provider TEXT NOT NULL CHECK (provider IN ('payme', 'click', 'cash')),
  provider_transaction_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UZS',
  academic_month TEXT NOT NULL DEFAULT 'Current',
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled', 'failed')) DEFAULT 'pending',
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_payment_tx_student_id ON public.payment_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_provider_tx_id ON public.payment_transactions(provider_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_status ON public.payment_transactions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- Authenticated users (Admin, Finance) can view and manage transactions
CREATE POLICY "Allow authenticated read payment_transactions"
  ON public.payment_transactions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert payment_transactions"
  ON public.payment_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update payment_transactions"
  ON public.payment_transactions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Service role has full unrestricted access (Webhook handlers)
CREATE POLICY "Allow service_role full access"
  ON public.payment_transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
