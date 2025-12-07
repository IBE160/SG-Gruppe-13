CREATE POLICY "Enable insert for all users" ON public.chat_messages
FOR INSERT WITH CHECK (TRUE);
