import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { SourcedLink } from "./SourcedLink"; // Import the SourcedLink component

import { SourceReference } from '@/types';

interface ChatBubbleProps {
  message: {
    text: string;
    isUser: boolean;
    sourceReferences?: SourceReference[];
  };
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { text, isUser, sourceReferences } = message; // Destructure sourceReferences

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card className={`p-4 max-w-lg ${isUser ? "bg-primary" : "bg-muted"}`}>
        <div className="flex justify-between items-start">
          <p className={`whitespace-pre-wrap ${isUser ? 'text-white' : 'text-black'}`}>{text}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigator.clipboard.writeText(text)}
            aria-label="Copy message" // Added aria-label
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {/* Conditionally render SourcedLink components */}
        {!isUser && sourceReferences && sourceReferences.length > 0 && (
          <div className="mt-2 space-y-1">
            {sourceReferences.map((source, index) => (
              <SourcedLink key={index} source={source} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
