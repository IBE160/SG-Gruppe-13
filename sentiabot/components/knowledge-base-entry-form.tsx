'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface KnowledgeBaseEntryFormProps {
  onSave: (entry: { title: string; content: string; source_url: string }) => void;
  initialData?: { id?: number; title: string; content: string; source_url: string }; // id added for clarity, optional
  isEditMode?: boolean;
}

export function KnowledgeBaseEntryForm({ onSave, initialData, isEditMode = false }: KnowledgeBaseEntryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url || '');
  const [isOpen, setIsOpen] = useState(false);

  // Update internal state when initialData changes (e.g., when editing a different entry)
  useEffect(() => {
    setTitle(initialData?.title || '');
    setContent(initialData?.content || '');
    setSourceUrl(initialData?.source_url || '');
  }, [initialData]);

  const handleSubmit = () => {
    onSave({ title, content, source_url: sourceUrl });
    // Reset form fields only if not in edit mode (i.e., for creation)
    if (!isEditMode) {
      setTitle('');
      setContent('');
      setSourceUrl('');
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditMode ? "ghost" : "default"}>{isEditMode ? "Edit" : "Create New Document"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Knowledge Base Entry" : "Create New Knowledge Base Entry"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Make changes to your knowledge base entry here." : "Fill in the details for your new knowledge base document."}
          </DialogDescription>
        </DialogHeader>
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? "Save Changes" : "Create Document"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}