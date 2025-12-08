"use client";

import { useState, useEffect, useCallback } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatInterface } from "@/components/ChatInterface";
import OptionsModal from "@/components/OptionsModal";
import { getLanguagePreference } from "@/lib/user-preferences"; // Import the utility

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
  const [language, setLanguage] = useState('en'); // Add language state

  // Effect to load language preference on mount
  useEffect(() => {
    const preferredLanguage = getLanguagePreference();
    if (preferredLanguage) {
      setLanguage(preferredLanguage);
    }
  }, []);

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
          context: { subject, gradeLevel, language }, // Include language in the context
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
  }, [subject, gradeLevel, sessionId, language]); // Add language to dependency array

  const handleStartChat = useCallback((selectedSubject: string, selectedGradeLevel: string) => {
    // Ensure 'biology' is always capitalized if that's the desired matching case in Supabase
    const formattedSubject = selectedSubject.toLowerCase() === 'biology' ? 'Biology' : selectedSubject;
    setSubject(formattedSubject);
    setGradeLevel(selectedGradeLevel);
    setShowChat(true); // Transition to chat interface

    // Set the initial welcome message from the bot
    setMessages([{ text: `I'm ready to help you with ${formattedSubject} for Grade ${selectedGradeLevel}.`, isUser: false }]);
  }, []);

  if (!showChat) {
    return (
      <div>
        <WelcomeScreen onStartChat={handleStartChat} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 bg-gray-100 border-b">
        <h1 className="text-xl font-bold">Sentiabot</h1>
        <OptionsModal sessionId={sessionId || ''} />
      </header>
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