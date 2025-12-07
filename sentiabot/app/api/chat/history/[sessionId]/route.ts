// sentiabot/app/api/chat/history/[sessionId]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import Supabase client
import { ChatMessage } from '@/lib/chat-history-service'; // Import ChatMessage interface

interface SupabaseChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  source_references: string[] | null;
}

export async function GET(
  request: Request,
  context: { params: { sessionId: string } }
) {
  console.log('API Route: GET /api/chat/history/[sessionId]');
  console.log('context.params (before await):', context.params);

  // Await context.params itself to get the object containing sessionId
  const resolvedParams = await (context.params as unknown as Promise<{ sessionId: string }>); // Cast to Promise for awaiting
  console.log('resolvedParams (after await):', resolvedParams);

  const sessionId = resolvedParams.sessionId;
  console.log('Extracted sessionId:', sessionId);

  if (!sessionId) {
    return NextResponse.json({ message: 'Session ID is required' }, { status: 400 });
  }

  // Fetch chat messages from Supabase
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, session_id, sender, content, timestamp, source_references')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching chat history from Supabase:', error);
    return NextResponse.json({ message: 'Failed to fetch chat history', error: error.message }, { status: 500 });
  }

  // Transform Supabase data to ChatMessage interface
  const chatHistory: ChatMessage[] = data.map((msg: SupabaseChatMessage) => ({
    id: msg.id,
    sender: msg.sender,
    text: msg.content,
    timestamp: msg.timestamp,
    source: msg.source_references && msg.source_references.length > 0
      ? { label: 'Source', url: msg.source_references[0] } // Assuming first reference is the primary source
      : undefined,
    // language: 'en', // Language is not currently stored per message in DB, assuming default or handling in client
  }));

  return NextResponse.json(chatHistory);
}