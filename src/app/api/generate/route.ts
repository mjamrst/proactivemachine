import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateIdeas } from '@/lib/generate-ideas';
import { getAuthUser } from '@/lib/auth';
import {
  getClientById,
  getPropertiesByIds,
  getClientDocuments,
  createIdeaSession,
  createIdeas,
} from '@/lib/supabase/db';
import {
  extractTextFromBuffer,
  extractTextFromUrl,
  getSupportedFileType,
  formatDocumentsForPrompt,
  truncateText,
} from '@/lib/documents';
import type { IdeaLane, TechModifier, AudienceModifier, PlatformModifier, BudgetTier, IdeaInsert, OutputStyle, AIModel } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle FormData
    const formData = await request.formData();

    const client_id = formData.get('client_id') as string;
    const session_name = formData.get('session_name') as string | null;
    const property_ids = JSON.parse(formData.get('property_ids') as string) as string[];
    const idea_lane = formData.get('idea_lane') as IdeaLane;
    const num_ideas = parseInt(formData.get('num_ideas') as string, 10);

    const tech_modifiers_str = formData.get('tech_modifiers') as string | null;
    const tech_modifiers = tech_modifiers_str ? JSON.parse(tech_modifiers_str) as TechModifier[] : undefined;

    const audience_modifier = formData.get('audience_modifier') as AudienceModifier | null;
    const platform_modifier = formData.get('platform_modifier') as PlatformModifier | null;
    const budget_tier = formData.get('budget_tier') as BudgetTier | null;

    const talent_names_str = formData.get('talent_names') as string | null;
    const talent_names = talent_names_str ? JSON.parse(talent_names_str) as string[] : undefined;

    const output_style_str = formData.get('output_style') as string | null;
    const output_style = output_style_str ? JSON.parse(output_style_str) as OutputStyle : undefined;

    const model = (formData.get('model') as AIModel) || 'claude';

    const session_file_count = parseInt(formData.get('session_file_count') as string || '0', 10);

    // Validate required fields (property_ids is optional)
    if (!client_id || !idea_lane || !num_ideas) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (num_ideas < 1 || num_ideas > 10) {
      return NextResponse.json(
        { error: 'Number of ideas must be between 1 and 10' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Fetch client and properties from database
    const [client, properties, clientDocuments] = await Promise.all([
      getClientById(supabase, client_id),
      property_ids.length > 0 ? getPropertiesByIds(supabase, property_ids) : Promise.resolve([]),
      getClientDocuments(supabase, client_id),
    ]);

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Process documents for context
    const documentContents: Array<{ name: string; content: string }> = [];

    // Extract text from client documents (stored in Supabase)
    for (const doc of clientDocuments) {
      try {
        const fileType = getSupportedFileType(doc.name);
        if (fileType) {
          const text = await extractTextFromUrl(doc.file_url, fileType);
          if (text) {
            documentContents.push({
              name: `[Brand Document] ${doc.name}`,
              content: truncateText(text, 15000), // Limit per document
            });
          }
        }
      } catch (err) {
        console.error(`Failed to extract text from client document ${doc.name}:`, err);
      }
    }

    // Extract text from session files (uploaded with request)
    for (let i = 0; i < session_file_count; i++) {
      const file = formData.get(`session_file_${i}`) as File | null;
      if (file) {
        try {
          const fileType = getSupportedFileType(file.name);
          if (fileType) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const text = await extractTextFromBuffer(buffer, fileType);
            if (text) {
              documentContents.push({
                name: `[Campaign Brief] ${file.name}`,
                content: truncateText(text, 20000), // Slightly larger for briefs
              });
            }
          }
        } catch (err) {
          console.error(`Failed to extract text from session file ${file.name}:`, err);
        }
      }
    }

    // Format documents for prompt
    const documentContext = formatDocumentsForPrompt(documentContents);

    // Generate ideas using selected AI model
    const generatedIdeas = await generateIdeas({
      clientName: client.name,
      propertyNames: properties.map((p) => p.name),
      ideaLane: idea_lane,
      techModifiers: tech_modifiers,
      audienceModifier: audience_modifier || undefined,
      platformModifier: platform_modifier || undefined,
      budgetTier: budget_tier || undefined,
      talentNames: talent_names,
      numIdeas: num_ideas,
      documentContext: documentContext || undefined,
      outputStyle: output_style,
      model,
    });

    // Create idea session in database
    const session = await createIdeaSession(supabase, {
      client_id,
      property_ids,
      idea_lane,
      tech_modifiers: tech_modifiers || null,
      audience_modifier: audience_modifier || null,
      platform_modifier: platform_modifier || null,
      budget_tier: budget_tier || null,
      content_style: null,
      ai_model: model,
      num_ideas,
      user_id: authUser.id,
      name: session_name || null,
    });

    // Save generated ideas to database
    const ideasToInsert: IdeaInsert[] = generatedIdeas.map((idea) => ({
      session_id: session.id,
      title: idea.title,
      overview: idea.overview,
      features: idea.features,
      brand_fit: idea.brand_fit,
      image_prompt: idea.image_prompt,
    }));

    const savedIdeas = await createIdeas(supabase, ideasToInsert);

    return NextResponse.json({
      session_id: session.id,
      ideas: savedIdeas,
    });
  } catch (error) {
    console.error('Generate API error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('parse')) {
        return NextResponse.json(
          { error: 'Failed to parse generated ideas. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate ideas. Please try again.' },
      { status: 500 }
    );
  }
}
