import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getClientDocuments, createClientDocument, deleteClientDocument } from '@/lib/supabase/db';
import { isSupportedFile, getSupportedFileType } from '@/lib/documents';

interface RouteParams {
  params: Promise<{ clientId: string }>;
}

// Get all documents for a client
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { clientId } = await params;
    const supabase = await createClient();
    const documents = await getClientDocuments(supabase, clientId);
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching client documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// Upload a document for a client
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { clientId } = await params;
    const formData = await request.formData();
    const file = formData.get('document') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No document file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isSupportedFile(file.name)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Document must be less than 10MB' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'pdf';
    const fileName = `clients/${clientId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload document' },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create database record
    const document = await createClientDocument(supabase, {
      client_id: clientId,
      name: file.name,
      file_url: urlData.publicUrl,
      file_type: getSupportedFileType(file.name) || 'pdf',
      file_size: file.size,
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a document
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { clientId } = await params;
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const fileUrl = searchParams.get('fileUrl');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Delete from storage if URL provided
    if (fileUrl) {
      const filePath = fileUrl.split('/documents/')[1];
      if (filePath) {
        await supabase.storage.from('documents').remove([filePath]);
      }
    }

    // Delete database record
    await deleteClientDocument(supabase, documentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Document delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
