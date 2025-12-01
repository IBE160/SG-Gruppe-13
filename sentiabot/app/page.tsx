"use client";

import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatBubble } from "@/components/ChatBubble";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = { id: Date.now().toString(), text, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }), // Send user's message as 'message'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newBotMessage: Message = {
        id: Date.now().toString() + "-bot",
        text: data.message, // Assuming the backend response has a 'message' field
        sender: "bot",
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
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col flex-grow w-full justify-end overflow-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg.text} sender={msg.sender} />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}
