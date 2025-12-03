"use client";

import { useState, useEffect, useRef } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatBubble } from "@/components/ChatBubble";
import { TypingIndicator } from "@/components/TypingIndicator";

import { Message } from "@/types";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newUserMessage: Message = { id: Date.now().toString(), text, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newBotMessage: Message = {
        id: Date.now().toString() + "-bot",
        text: data.aiResponse,
        sender: "bot",
        sourceReferences: data.sourceReferences, // Pass the whole array
      };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error("Error sending message to backend:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        text: "Error: Could not get a response from Sentiabot.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="p-4 border-b dark:border-zinc-800">
        <h1 className="text-xl font-bold">Sentiabot</h1>
      </header>
      <main className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg.text} sender={msg.sender} sourceReferences={msg.sourceReferences} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="p-4 border-t dark:border-zinc-800">
        <ChatInput onSendMessage={handleSendMessage} />
      </footer>
    </div>
  );
}
