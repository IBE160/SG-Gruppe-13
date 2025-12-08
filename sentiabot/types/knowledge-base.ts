export interface KnowledgeBaseEntry {
  id: string; // Changed to string as Supabase IDs are typically UUIDs
  title: string;
  content: string;
  source_url: string;
  subject: string; // Now required as we are setting it
  grade_level: number; // Now required as we are setting it
  embedding: number[]; // Include embedding from backend
  created_at: string; // Include timestamps from backend
  updated_at: string; // Include timestamps from backend
  metadata: any | null; // Include metadata from backend
}