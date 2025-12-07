'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { Settings } from 'lucide-react';
import {
  fetchChatHistory,
  formatChatHistoryAsText,
  downloadChatHistoryFile
} from '@/lib/chat-history-service';

interface OptionsModalProps {
  sessionId: string; // Assuming sessionId is passed as a prop
}

const OptionsModal = ({ sessionId }: OptionsModalProps) => {
  const handleDownloadChat = async () => {
    if (!sessionId) {
      console.error('No session ID available for download.');
      // Potentially show a user-friendly error message
      return;
    }

    try {
      const history = await fetchChatHistory(sessionId);
      const formattedText = formatChatHistoryAsText(history);
      const filename = `sentiabot-chat-history-${sessionId}.txt`;
      downloadChatHistoryFile(formattedText, filename);
      console.log('Chat history downloaded successfully.');
    } catch (error) {
      console.error('Error during chat history download:', error);
      // Potentially show a user-friendly error message
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle options">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <LanguageSelector />
          <Button variant="secondary" onClick={handleDownloadChat}>
            Download Chat
          </Button>
          {/* Other options like download chat history can be added here later */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsModal;