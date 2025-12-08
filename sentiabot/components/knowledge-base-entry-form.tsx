'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface KnowledgeBaseEntryFormProps {
  onSave: (entry: { title: string; content: string; source_url: string; subject: string; grade_level: number }) => void;
  onCancel: () => void; // Add onCancel prop
  initialData?: { id?: number; title: string; content: string; source_url: string; subject?: string; grade_level?: number }; // id added for clarity, optional
  isEditMode?: boolean;
}

export function KnowledgeBaseEntryForm({ onSave, onCancel, initialData, isEditMode = false }: KnowledgeBaseEntryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [gradeLevel, setGradeLevel] = useState<number>(initialData?.grade_level || 0);

  // Update internal state when initialData changes (e.g., when editing a different entry)
  useEffect(() => {
    setTitle(initialData?.title || '');
    setContent(initialData?.content || '');
    setSourceUrl(initialData?.source_url || '');
    setSubject(initialData?.subject || '');
    setGradeLevel(initialData?.grade_level || 0);
  }, [initialData]);

  const handleSubmit = () => {
    onSave({ title, content, source_url: sourceUrl, subject, grade_level: gradeLevel });
    // Reset form fields only if not in edit mode (i.e., for creation)
    if (!isEditMode) {
      setTitle('');
      setContent('');
      setSourceUrl('');
      setSubject('');
      setGradeLevel(0);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="content" className="text-right">
          Content
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="sourceUrl" className="text-right">
          Source URL
        </Label>
        <Input
          id="sourceUrl"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="subject" className="text-right">
          Subject
        </Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="gradeLevel" className="text-right">
          Grade Level
        </Label>
        <Input
          id="gradeLevel"
          type="number"
          value={gradeLevel}
          onChange={(e) => setGradeLevel(parseInt(e.target.value))}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>{isEditMode ? "Save Changes" : "Create Document"}</Button>
      </div>
    </div>
  );
}