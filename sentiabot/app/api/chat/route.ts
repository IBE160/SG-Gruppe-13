import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // In a real application, you would process the request body,
  // interact with an AI model, and return a dynamic response.
  // For this story, we return a static response.

  const staticResponse = {
    message: "Hello there! I'm Sentiabot, ready to help you learn.",
  };

  return NextResponse.json(staticResponse);
}