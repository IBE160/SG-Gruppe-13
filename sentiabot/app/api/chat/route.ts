import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { semanticSearch } from '@/lib/knowledgeBaseService'; // Import semanticSearch
import { supabase } from '@/lib/supabase'; // Import supabase client
import { v4 as uuidv4 } from 'uuid'; // Import uuid for session IDs

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  try {
    const { message, context, sessionId: clientSessionId } = await request.json();
    const { subject, gradeLevel } = context || {}; // Extract subject and gradeLevel from context or default to empty object

    // --- Input Validation ---
    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message must be a non-empty string.' }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `Message exceeds the maximum length of ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
    }
    // --- End Input Validation ---

    let currentSessionId = clientSessionId;
    let userId = 'anonymous'; // Placeholder for user ID until authentication is implemented

    // Manage chat session
    if (!currentSessionId) {
      // Create a new session
      currentSessionId = uuidv4();
      const { error: sessionError } = await supabase.from('chat_sessions').insert([
        { id: currentSessionId, user_id: userId, started_at: new Date().toISOString(), subject, grade_level: gradeLevel },
      ]);

      if (sessionError) {
        console.error('Error creating chat session:', sessionError);
        return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
      }
    } else {
      // Update existing session (e.g., if subject/gradeLevel changes mid-session or for initial setting)
      const { error: sessionError } = await supabase.from('chat_sessions')
        .update({ subject, grade_level: gradeLevel, ended_at: null }) // Set ended_at to null to indicate active
        .eq('id', currentSessionId);

      if (sessionError) {
        console.error('Error updating chat session:', sessionError);
        // Do not return error, allow chat to continue but log the issue
      }
    }

    // Perform semantic search
    const searchResults = await semanticSearch(message, { subject, gradeLevel, limit: 3 }); // Limit to top 3 results

    let prompt = `You are a helpful and informative AI assistant focused on providing educational content for elementary school students. Your responses should be tailored for a student in Grade ${gradeLevel} and focus on the subject of ${subject}. Answer the user's question based ONLY on the provided context. If the answer is not in the context, state "I don't have enough information to answer that question."

User's Question: ${message}

`;

    let sourceReferences: string[] = [];

    if (searchResults && searchResults.length > 0) {
      prompt += `Context from Knowledge Base:\n`;
      searchResults.forEach((result: any, index: number) => {
        prompt += `Document ${index + 1} (Source: ${result.source_url}):\n${result.content}\n\n`;
        if (result.source_url && !sourceReferences.includes(result.source_url)) {
          sourceReferences.push(result.source_url);
        }
      });
    } else {
      prompt += `No relevant context found in the knowledge base.\n\n`;
    }

    console.log("Generated Prompt for Gemini:", prompt); // Log the prompt here

    const result = await geminiModel.generateContent(prompt); // Use the enhanced prompt
    const response = result.response;
    const text = response.text();

    // Store user message
    const { error: userMessageError } = await supabase.from('chat_messages').insert([
      { session_id: currentSessionId, sender: 'user', content: message, timestamp: new Date().toISOString() },
    ]);
    if (userMessageError) console.error('Error saving user message:', userMessageError);

    // Store AI response
    const { error: aiMessageError } = await supabase.from('chat_messages').insert([
      { session_id: currentSessionId, sender: 'ai', content: text, timestamp: new Date().toISOString(), source_references: sourceReferences },
    ]);
    if (aiMessageError) console.error('Error saving AI message:', aiMessageError);


    return NextResponse.json({
      sessionId: currentSessionId, // Return session ID to client
      aiResponse: text,
      sourceReferences: sourceReferences, // Return actual source references
    });
  } catch (error) {
    console.error('Error in /api/chat POST:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}