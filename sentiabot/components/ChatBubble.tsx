import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SourcedLink } from "./SourcedLink";

interface ChatBubbleProps {
  message: string;
  sender: "user" | "bot";
  source?: string;
}

export function ChatBubble({ message, sender, source }: ChatBubbleProps) {
  const isUser = sender === "user";

  return (
    <div
      className={cn(
        "flex",
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
        <CardContent className="p-2">
          <p>{message}</p>
          {!isUser && source && <SourcedLink source={source} />}
        </CardContent>
      </Card>
    </div>
  );
}