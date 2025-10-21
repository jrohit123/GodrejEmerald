-- Enable RLS on tables that don't have it
ALTER TABLE public.n8n_chat_histories_tg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_histories_web ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_google ENABLE ROW LEVEL SECURITY;

-- Add basic policies for these tables
-- For n8n_chat_histories tables, allow service role access only
CREATE POLICY "Service role can manage chat histories tg"
ON public.n8n_chat_histories_tg
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage chat histories web"
ON public.n8n_chat_histories_web
FOR ALL
USING (auth.role() = 'service_role');

-- For documents_google, allow authenticated users to read
CREATE POLICY "Authenticated users can read documents"
ON public.documents_google
FOR SELECT
USING (auth.role() = 'authenticated');