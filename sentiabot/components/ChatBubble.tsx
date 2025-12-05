import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface ChatBubbleProps {
  message: {
    text: string;
    isUser: boolean;
    source?: string;
  };
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { text, isUser, source } = message;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card className={`p-4 max-w-lg ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <div className="flex justify-between items-start">
          <p className="whitespace-pre-wrap">{text}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigator.clipboard.writeText(text)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {source && !isUser && (
          <a
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground mt-2 underline"
          >
            Source
          </a>
        )}
      </Card>
    </div>
  );
}
