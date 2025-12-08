'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { KnowledgeBaseEntryForm } from '@/components/knowledge-base-entry-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';

// For demonstration purposes: Simulate an authenticated admin.
// In a real application, this would come from a proper authentication context (e.g., Supabase Auth).
const isAdminAuthenticated = true; 

import { KnowledgeBaseEntry } from '@/types/knowledge-base';

export default function KnowledgeBaseManagementPage() {
  const [knowledgeBaseEntries, setKnowledgeBaseEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<KnowledgeBaseEntry | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/knowledge-base');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: KnowledgeBaseEntry[] = await response.json();
      setKnowledgeBaseEntries(data);
    } catch (error) {
      console.error('Error fetching knowledge base entries:', error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleCreateEntry = async (newEntry: { title: string; content: string; source_url: string; subject: string; grade_level: number }) => {
    try {
      const response = await fetch('/api/admin/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setKnowledgeBaseEntries((prevEntries) => [
        ...prevEntries,
        result.entry, // Use the entry returned from the simulated backend with its ID
      ]);
    } catch (error) {
      console.error('Error creating knowledge base entry:', error);
      // Optionally, show an error message to the user
    }
  };

  const handleEditEntry = (entry: KnowledgeBaseEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleSaveEditedEntry = async (updatedEntryData: { title: string; content: string; source_url: string; subject: string; grade_level: number }) => {
    console.log('handleSaveEditedEntry triggered for:', editingEntry?.id);
    if (!editingEntry) return;

    try {
      const response = await fetch('/api/admin/knowledge-base', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedEntryData, id: editingEntry.id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setKnowledgeBaseEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === editingEntry.id ? result.entry : entry
        )
      );
    } catch (error) {
      console.error('Error updating knowledge base entry:', error);
      // Optionally, show an error message to the user
    }
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/knowledge-base?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setKnowledgeBaseEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error('Error deleting knowledge base entry:', error);
      // Optionally, show an error message to the user
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-600">You must be logged in as an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Knowledge Base Management</CardTitle>
          <Button onClick={() => {
            setEditingEntry({
              id: 'new', // Use 'new' as a temporary ID for new entries
              title: '',
              content: '',
              source_url: '',
              subject: '',
              grade_level: 0,
              embedding: [], // Default empty array for embedding
              created_at: new Date().toISOString(), // Default current timestamp
              updated_at: new Date().toISOString(), // Default current timestamp
              metadata: null, // Default null metadata
            });
            setShowForm(true);
          }}>Create New Document</Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingEntry?.id === 'new' ? 'Create New Entry' : `Edit Entry: ${editingEntry?.title}`}
                  </DialogTitle>
                  <DialogDescription>
                    {editingEntry?.id === 0 ? 'Fill in the details for your new knowledge base document.' : 'Make changes to your knowledge base entry here.'}
                  </DialogDescription>
                </DialogHeader>
                <KnowledgeBaseEntryForm
                                      isEditMode={editingEntry?.id !== 'new'}
                                      initialData={editingEntry?.id !== 'new' ? editingEntry : undefined}
                                      onSave={(data) => {
                                        if (editingEntry?.id === 'new') {
                                          handleCreateEntry(data);
                                        } else {
                                          handleSaveEditedEntry(data);
                                        }                    setEditingEntry(null);
                    setShowForm(false);
                  }}
                  onCancel={() => {
                    setEditingEntry(null);
                    setShowForm(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
          {isLoading ? (
            <div className="text-center">Loading knowledge base entries...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Source URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {knowledgeBaseEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.id}</TableCell>
                    <TableCell>{entry.title}</TableCell>
                    <TableCell>{entry.source_url}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" onClick={() => handleEditEntry(entry)}>Edit</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the &quot;{entry.title}&quot; entry
                              from your knowledge base.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
