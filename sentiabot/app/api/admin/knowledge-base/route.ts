import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { generateEmbedding } from '../../../../lib/embeddings'; // Import generateEmbedding

import { KnowledgeBaseEntry } from '@/types/knowledge-base';

export async function GET(request: Request) {
  try {
    const { data, error } = await supabase
      .from('knowledge_base_entries')
      .select('*');

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json({ message: 'Error fetching knowledge base entries.', error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unexpected GET error:', error);
    return NextResponse.json({ message: 'Unexpected error fetching knowledge base entries.', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, source_url, subject, grade_level } = await request.json();
    console.log('POST: Received data:', { title, content: content.substring(0, 50) + '...', source_url, subject, grade_level });

    // --- Input Validation ---
    if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 255) {
      return NextResponse.json({ message: 'Title is required and must be a string between 3 and 255 characters.' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      return NextResponse.json({ message: 'Content is required and must be a string with at least 10 characters.' }, { status: 400 });
    }
    if (source_url && (typeof source_url !== 'string' || !/^https?:\/\/\S+$/.test(source_url))) {
      return NextResponse.json({ message: 'Source URL must be a valid URL.' }, { status: 400 });
    }
    const allowedSubjects = ['Biology', 'Geography', 'Math', 'Geology']; // Define allowed subjects
    if (!subject || typeof subject !== 'string' || !allowedSubjects.includes(subject)) {
      return NextResponse.json({ message: `Subject is required and must be one of: ${allowedSubjects.join(', ')}.` }, { status: 400 });
    }
    const parsedGradeLevel = parseInt(grade_level);
    if (isNaN(parsedGradeLevel) || parsedGradeLevel < 1 || parsedGradeLevel > 12) {
      return NextResponse.json({ message: 'Grade level is required and must be an integer between 1 and 12.' }, { status: 400 });
    }
    // --- End Input Validation ---

    // Generate embedding for the content
    const embedding = await generateEmbedding(content);
    console.log('POST: Generated embedding (first 5 values):', embedding.slice(0, 5), 'Length:', embedding.length);

    const payload = { title, content, source_url, subject, grade_level: parsedGradeLevel, embedding };
    console.log('POST: Payload to Supabase:', { ...payload, embedding: '...' }); // Avoid logging full embedding

    const { data, error } = await supabase
      .from('knowledge_base_entries')
      .insert([payload]) // Include embedding
      .select(); // Use .select() to return the inserted data

    console.log('POST: Supabase response - data:', data, 'error:', error);

    if (error) {
      console.error('Supabase POST error:', error.message, error.details, error.hint, error.code);
      return NextResponse.json({ message: 'Error creating knowledge base entry.', error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'Error creating knowledge base entry: No data returned.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Knowledge base entry created successfully.', entry: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Unexpected POST error:', error);
    return NextResponse.json({ message: 'Unexpected error creating knowledge base entry.', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, content, source_url, subject, grade_level } = await request.json();
    console.log('PUT: Received data:', { id, title, content: content.substring(0, 50) + '...', source_url, subject, grade_level });

    if (!id) {
      return NextResponse.json({ message: 'Missing ID for knowledge base entry update.' }, { status: 400 });
    }

    // --- Input Validation ---
    if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 255) {
      return NextResponse.json({ message: 'Title is required and must be a string between 3 and 255 characters.' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      return NextResponse.json({ message: 'Content is required and must be a string with at least 10 characters.' }, { status: 400 });
    }
    if (source_url && (typeof source_url !== 'string' || !/^https?:\/\/\S+$/.test(source_url))) {
      return NextResponse.json({ message: 'Source URL must be a valid URL.' }, { status: 400 });
    }
    const allowedSubjects = ['Biology', 'Geography', 'Math', 'Geology']; // Define allowed subjects
    if (!subject || typeof subject !== 'string' || !allowedSubjects.includes(subject)) {
      return NextResponse.json({ message: `Subject is required and must be one of: ${allowedSubjects.join(', ')}.` }, { status: 400 });
    }
    const parsedGradeLevel = parseInt(grade_level);
    if (isNaN(parsedGradeLevel) || parsedGradeLevel < 1 || parsedGradeLevel > 12) {
      return NextResponse.json({ message: 'Grade level is required and must be an integer between 1 and 12.' }, { status: 400 });
    }
    // --- End Input Validation ---

    // Generate embedding for the updated content
    const embedding = await generateEmbedding(content);
    console.log('PUT: Generated embedding (first 5 values):', embedding.slice(0, 5), 'Length:', embedding.length);

    const payload = { title, content, source_url, subject, grade_level: parsedGradeLevel, embedding };
    console.log('PUT: Payload to Supabase:', { ...payload, embedding: '...' }); // Avoid logging full embedding

    const { data, error } = await supabase
      .from('knowledge_base_entries')
      .update(payload) // Include embedding
      .eq('id', id)
      .select(); // Use .select() to return the updated data

    console.log('PUT: Supabase response - data:', data, 'error:', error);

    if (error) {
      console.error('Supabase PUT error:', error.message, error.details, error.hint, error.code);
      return NextResponse.json({ message: 'Error updating knowledge base entry.', error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'Knowledge base entry not found or no changes made.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Knowledge base entry updated successfully.', entry: data[0] }, { status: 200 });
  } catch (error) {
    console.error('Unexpected PUT error:', error);
    return NextResponse.json({ message: 'Unexpected error updating knowledge base entry.', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Missing ID for knowledge base entry deletion.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('knowledge_base_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE error:', error.message, error.details, error.hint, error.code);
      return NextResponse.json({ message: 'Error deleting knowledge base entry.', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Knowledge base entry with ID ${id} deleted successfully.`, id }, { status: 200 });
  } catch (error) {
    console.error('Unexpected DELETE error:', error);
    return NextResponse.json({ message: 'Unexpected error deleting knowledge base entry.', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}