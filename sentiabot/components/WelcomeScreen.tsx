// sentiabot/components/WelcomeScreen.tsx
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WelcomeScreenProps {
  onStartChat: (subject: string, gradeLevel: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>(''); // Placeholder for future grade level

  const handleStartChat = () => {
    if (selectedSubject && selectedGradeLevel) {
      onStartChat(selectedSubject, selectedGradeLevel);
    } else if (selectedSubject && !selectedGradeLevel) {
      onStartChat(selectedSubject, 'Not Selected'); // Default for now
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome to Sentiabot!</h2>
      <p className="text-lg text-center mb-8">
        Choose a subject and grade level to start chatting.
      </p>

      <div className="w-full max-w-xs mb-4">
        <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <Select onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full" id="subject-select">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="biology">Biology</SelectItem>
            <SelectItem value="geology">Geology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Placeholder for future grade level selection */}
      <div className="w-full max-w-xs mb-8">
        <label htmlFor="grade-select" className="block text-sm font-medium text-gray-700 mb-2">
          Grade Level
        </label>
        <Select onValueChange={setSelectedGradeLevel}>
          <SelectTrigger className="w-full" id="grade-select">
            <SelectValue placeholder="Select a grade level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Grade 1</SelectItem>
            <SelectItem value="2">Grade 2</SelectItem>
            <SelectItem value="3">Grade 3</SelectItem>
            <SelectItem value="4">Grade 4</SelectItem>
            <SelectItem value="5">Grade 5</SelectItem>
            <SelectItem value="6">Grade 6</SelectItem>
          </SelectContent>
        </Select>
      </div>


      <button
        onClick={handleStartChat}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg disabled:opacity-50"
        disabled={!selectedSubject || !selectedGradeLevel}
      >
        Start Chatting
      </button>
    </div>
  );
};

export default WelcomeScreen;
