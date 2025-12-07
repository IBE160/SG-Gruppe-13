CREATE POLICY "Enable insert for all users" ON public.chat_sessions
FOR INSERT WITH CHECK (TRUE);
