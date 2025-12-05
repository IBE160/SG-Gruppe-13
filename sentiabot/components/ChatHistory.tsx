import { ChatBubble } from "@/components/ChatBubble";

interface Message {
  text: string;
  isUser: boolean;
  source?: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="space-y-4 p-4">
      {messages.map((message, index) => (
        <ChatBubble key={index} message={message} />
      ))}
    </div>
  );
}
