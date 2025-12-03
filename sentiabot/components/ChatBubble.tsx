import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SourcedLink } from "./SourcedLink";

interface ChatBubbleProps {
  message: string;
  sender: "user" | "bot";
  sourceReferences?: string[];
}

export function ChatBubble({ message, sender, sourceReferences }: ChatBubbleProps) {
  const isUser = sender === "user";

  return (
    <div
      className={cn(
        "flex",
        "mb-4", // Add margin-bottom for spacing between bubbles
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "max-w-[70%]",
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        )}
      >
        <CardContent className="p-3">
          <p>{message}</p>
          {!isUser && sourceReferences && sourceReferences.length > 0 && (
            <div className="mt-2 flex flex-col items-start">
              {sourceReferences.map((source, index) => (
                <SourcedLink key={index} source={source} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}