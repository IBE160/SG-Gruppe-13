import { generateEmbedding } from './embeddings';
import { supabase } from './supabase';

interface SearchOptions {
  subject?: string;
  gradeLevel?: string;
  limit?: number;
}

// Define a type for the knowledge base entry for better type safety
export interface KnowledgeBaseEntry {
  id: number;
  title: string;
  content: string;
  source_url: string;
}

// Helper function to convert a string to Title Case
function toTitleCase(str: string): string {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export async function semanticSearch(
  query: string,
  options?: SearchOptions
): Promise<KnowledgeBaseEntry[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);
    console.log("Query Embedding generated (first 5 values):", queryEmbedding.slice(0, 5), "Length:", queryEmbedding.length);

    // Prepare the parameters for the RPC call
    const params: {
      query_embedding: number[];
      match_threshold: number;
      match_count: number;
      p_subject?: string;
      p_grade_level?: number; // Changed from string to number
    } = {
      query_embedding: queryEmbedding,
      match_threshold: 0.1, // Reverted to original debugging threshold // Temporarily lowered for debugging
      match_count: options?.limit || 5,
    };

    // Add optional filters to the RPC parameters
    if (options?.subject) {
      params.p_subject = toTitleCase(options.subject); // Convert to Title Case
    }
    if (options?.gradeLevel) {
      params.p_grade_level = options.gradeLevel;
    }
    
    console.log("Parameters sent to match_documents RPC:", params); // Log the parameters
    
    // Perform the semantic search using the RPC function
    const { data, error } = await supabase.rpc('match_documents', params);

    if (error) {
      console.error('Error performing semantic search via RPC:', error);
      throw new Error('Failed to perform semantic search.');
    }

    return data as KnowledgeBaseEntry[];

  } catch (error) {
    // Catch and re-throw errors from generateEmbedding or other issues
    console.error('An unexpected error occurred in semanticSearch:', error);
    // Avoid re-throwing the same error object if it's already the one we threw
    if (error instanceof Error && error.message === 'Failed to perform semantic search.') {
      throw error;
    }
    throw new Error('An unexpected error occurred during semantic search.');
  }
}

