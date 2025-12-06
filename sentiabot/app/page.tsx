"use client";

import { useState, useEffect, useCallback } from "react"; // Import useEffect and useCallback
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatInterface } from "@/components/ChatInterface";

import { SourceReference } from "@/types";

interface Message {
  text: string;
  isUser: boolean;
  sourceReferences?: SourceReference[];
}

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (messageText.trim() === "") return;

    const newUserMessage: Message = { text: messageText, isUser: true };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          context: { subject, gradeLevel },
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSessionId(data.sessionId); // Update sessionId for subsequent messages

      const botMessage: Message = {
        text: data.aiResponse,
        isUser: false,
        sourceReferences: data.sourceReferences, // Assign array directly
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error: Could not get a response from Sentiabot.", isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [subject, gradeLevel, sessionId]); // Dependencies for useCallback

  const handleStartChat = useCallback((selectedSubject: string, selectedGradeLevel: string) => {
    setSubject(selectedSubject);
    setGradeLevel(selectedGradeLevel);
    setShowChat(true); // Transition to chat interface

    // Set the initial welcome message from the bot
    setMessages([{ text: `I'm ready to help you with ${selectedSubject} for Grade ${selectedGradeLevel}.`, isUser: false }]);
  }, []);

  if (!showChat) {
    return (
      <div>
        <WelcomeScreen onStartChat={handleStartChat} />
      </div>
    );
  }

  return (
    <div>
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        input={input}
        setInput={setInput}
      />
    </div>
  );
}