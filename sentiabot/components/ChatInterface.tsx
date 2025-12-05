import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatHistory } from "@/components/ChatHistory";
import { TypingIndicator } from "@/components/TypingIndicator";
import { OptionsModal } from "@/components/OptionsModal";

interface Message {
  text: string;
  isUser: boolean;
  source?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  input: string;
  setInput: (input: string) => void;
}

export function ChatInterface({ messages, onSendMessage, isLoading, input, setInput }: ChatInterfaceProps) {
  const handleSend = () => {
    if (input.trim() === "") return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Sentiabot</h1>
        <OptionsModal />
      </header>
      <div className="flex-1 overflow-y-auto">
        <ChatHistory messages={messages} />
        {isLoading && <TypingIndicator />}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}
