import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateIdeas } from '@/lib/claude';
import {
  getClientById,
  getPropertiesByIds,
  createIdeaSession,
  createIdeas,
} from '@/lib/supabase/db';
import type { IdeaLane, TechModifier, ContentStyle, IdeaInsert } from '@/types/database';

interface GenerateRequest {
  client_id: string;
  property_ids: string[];
  idea_lane: IdeaLane;
  tech_modifiers?: TechModifier[];
  content_style?: ContentStyle;
  num_ideas: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    // Validate required fields
    const { client_id, property_ids, idea_lane, num_ideas } = body;

    if (!client_id || !property_ids || !idea_lane || !num_ideas) {
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

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Fetch client and properties from database
    const [client, properties] = await Promise.all([
      getClientById(supabase, client_id),
      getPropertiesByIds(supabase, property_ids),
    ]);

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    if (properties.length === 0) {
      return NextResponse.json(
        { error: 'No valid properties found' },
        { status: 404 }
      );
    }

    // Generate ideas using Claude
    const generatedIdeas = await generateIdeas({
      clientName: client.name,
      propertyNames: properties.map((p) => p.name),
      ideaLane: idea_lane,
      techModifiers: body.tech_modifiers,
      contentStyle: body.content_style,
      numIdeas: num_ideas,
    });

    // Create idea session in database
    const session = await createIdeaSession(supabase, {
      client_id,
      property_ids,
      idea_lane,
      tech_modifiers: body.tech_modifiers || null,
      content_style: body.content_style || null,
      num_ideas,
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
