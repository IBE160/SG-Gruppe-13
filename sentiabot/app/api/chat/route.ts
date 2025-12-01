import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string.' }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `Message exceeds the maximum length of ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
    }

    const result = await geminiModel.generateContent(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      aiResponse: text,
      sourceReferences: [], // Placeholder for RAG implementation
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}