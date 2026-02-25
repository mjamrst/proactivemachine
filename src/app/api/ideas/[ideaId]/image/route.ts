import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ ideaId: string }>;
}

// Upload image for an idea
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaId } = await params;
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Image must be less than 5MB' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify the idea exists
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('id, image_url')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    // If there's an existing image, delete it first
    if (idea.image_url) {
      const oldPath = idea.image_url.split('/idea-images/')[1];
      if (oldPath) {
        await supabase.storage.from('idea-images').remove([oldPath]);
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${ideaId}-${Date.now()}.${fileExt}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('idea-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('idea-images')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // Update the idea with the image URL
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ image_url: imageUrl })
      .eq('id', ideaId);

    if (updateError) {
      console.error('Update error:', updateError);
      // Try to clean up the uploaded file
      await supabase.storage.from('idea-images').remove([fileName]);
      return NextResponse.json(
        { error: 'Failed to save image URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ image_url: imageUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete image for an idea
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaId } = await params;
    const supabase = createAdminClient();

    // Get the current image URL
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('image_url')
      .eq('id', ideaId)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    if (!idea.image_url) {
      return NextResponse.json({ success: true });
    }

    // Extract the file path from the URL
    const filePath = idea.image_url.split('/idea-images/')[1];

    if (filePath) {
      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('idea-images')
        .remove([filePath]);

      if (deleteError) {
        console.error('Storage delete error:', deleteError);
      }
    }

    // Clear the image_url in the database
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ image_url: null })
      .eq('id', ideaId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to clear image URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
