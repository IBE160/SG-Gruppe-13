import { ChatBubble } from "@/components/ChatBubble";
import { SourceReference } from "@/types";

interface Message {
  text: string;
  isUser: boolean;
  sourceReferences?: SourceReference[];
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
