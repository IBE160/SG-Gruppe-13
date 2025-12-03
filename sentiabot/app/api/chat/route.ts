import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { semanticSearch } from '@/lib/knowledgeBaseService'; // Import semanticSearch

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  try {
    const { message, subject, gradeLevel } = await request.json();

    // --- Input Validation ---
    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message must be a non-empty string.' }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `Message exceeds the maximum length of ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
    }
    // --- End Input Validation ---

    // Perform semantic search
    const searchResults = await semanticSearch(message, { subject, gradeLevel, limit: 3 }); // Limit to top 3 results

    let prompt = `You are a helpful and informative AI assistant focused on providing educational content for elementary school students. Answer the user's question based ONLY on the provided context. If the answer is not in the context, state "I don't have enough information to answer that question."

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

    const result = await geminiModel.generateContent(prompt); // Use the enhanced prompt
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      aiResponse: text,
      sourceReferences: sourceReferences, // Return actual source references
    });
  } catch (error) {
    console.error('Error in /api/chat POST:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}