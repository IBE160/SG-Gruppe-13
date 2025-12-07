// sentiabot/lib/chat-history-service.ts

export interface ChatMessage {
  id: string; // Unique identifier for the message
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; // ISO 8601 format
  source?: {      // Optional for bot messages
      label: string;
      url: string;
  };
  language?: 'en' | 'no'; // Optional, to track per-message language or current session language
}

export async function fetchChatHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`/api/chat/history/${sessionId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch chat history');
    }

    const chatHistory: ChatMessage[] = await response.json();
    return chatHistory;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error; // Re-throw for caller to handle
  }
}

export function formatChatHistoryAsText(chatHistory: ChatMessage[]): string {
  let formattedText = '';
  chatHistory.forEach(message => {
    const date = new Date(message.timestamp);
    const readableTimestamp = date.toLocaleString(); // Or use a more specific format like toISOString()

    formattedText += `[${readableTimestamp}] ${message.sender.toUpperCase()}: ${message.text}\n`;
    if (message.source) {
      formattedText += `  Source: ${message.source.label} (${message.source.url})\n`;
    }
    formattedText += '\n';
  });
  return formattedText.trim();
}

export function downloadChatHistoryFile(formattedText: string, filename: string): void {
  const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
