import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function WelcomeScreen({ onStartChat }: { onStartChat: (subject: string, grade: string) => void }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const isStartChatDisabled = !selectedSubject || !selectedGrade;

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome to Sentiabot!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject">Subject</label>
            <Select onValueChange={setSelectedSubject}>
              <SelectTrigger id="subject" aria-label="Select Subject">
                <SelectValue placeholder="Select your subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="geology">Geology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="grade">Grade Level</label>
            <Select onValueChange={setSelectedGrade}>
              <SelectTrigger id="grade" aria-label="Select Grade Level">
                <SelectValue placeholder="Select your grade level" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((grade) => (
                  <SelectItem key={grade} value={String(grade)}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={() => onStartChat(selectedSubject!, selectedGrade!)} disabled={isStartChatDisabled}>Start Chatting</Button>
        </CardContent>
      </Card>
    </div>
  );
}