import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getIdeaSessionById, getIdeasBySession, getClientById, getPropertiesByIds } from '@/lib/supabase/db';
import pptxgen from 'pptxgenjs';

const LANE_LABELS: Record<string, string> = {
  live_experience: 'Live Experience',
  digital: 'Digital',
  content: 'Content',
  social_impact: 'Social Impact',
  talent_athlete: 'Talent/Athlete',
  gaming_esports: 'Gaming/Esports',
  hospitality_vip: 'Hospitality/VIP',
  retail_product: 'Retail/Product',
};

// Colors
const COLORS = {
  background: '0a0a0a',
  backgroundAlt: '1a1a2e',
  accent: '0066FF',
  white: 'FFFFFF',
  gray: '888888',
  lightGray: 'CCCCCC',
  darkGray: '666666',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();

    // Fetch all required data
    const session = await getIdeaSessionById(supabase, sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const [ideas, client, properties] = await Promise.all([
      getIdeasBySession(supabase, sessionId),
      getClientById(supabase, session.client_id),
      session.property_ids.length > 0
        ? getPropertiesByIds(supabase, session.property_ids)
        : Promise.resolve([]),
    ]);

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Create PowerPoint presentation
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.title = `${client.name} - Sponsorship Activation Ideas`;
    pptx.author = 'Primer';

    // ========== TITLE SLIDE ==========
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: COLORS.background };

    // Subtitle
    titleSlide.addText('SPONSORSHIP ACTIVATION IDEAS', {
      x: 0.5,
      y: 2.0,
      w: '90%',
      h: 0.4,
      fontSize: 14,
      color: COLORS.accent,
      align: 'center',
      fontFace: 'Arial',
      charSpacing: 4,
    });

    // Main title (Client name)
    titleSlide.addText(client.name, {
      x: 0.5,
      y: 2.5,
      w: '90%',
      h: 1.0,
      fontSize: 48,
      color: COLORS.white,
      bold: true,
      align: 'center',
      fontFace: 'Arial',
    });

    // Properties (only if there are properties)
    if (properties.length > 0) {
      const propertiesText = properties.map((p) => p.name).join(' + ');
      titleSlide.addText(propertiesText, {
        x: 0.5,
        y: 3.5,
        w: '90%',
        h: 0.5,
        fontSize: 20,
        color: COLORS.gray,
        align: 'center',
        fontFace: 'Arial',
      });
    }

    // Lane badge and tech modifiers
    const laneLabel = LANE_LABELS[session.idea_lane] || session.idea_lane;
    let metaText = laneLabel;
    if (session.tech_modifiers && session.tech_modifiers.length > 0) {
      metaText += `  |  ${session.tech_modifiers.join(' / ')}`;
    }
    titleSlide.addText(metaText, {
      x: 0.5,
      y: 4.2,
      w: '90%',
      h: 0.4,
      fontSize: 12,
      color: COLORS.accent,
      align: 'center',
      fontFace: 'Arial',
    });

    // Idea count
    titleSlide.addText(`${ideas.length} Creative Concepts`, {
      x: 0.5,
      y: 4.7,
      w: '90%',
      h: 0.3,
      fontSize: 14,
      color: COLORS.darkGray,
      align: 'center',
      fontFace: 'Arial',
    });

    // Branding
    titleSlide.addText('PRIMER', {
      x: 0.5,
      y: 6.8,
      w: '90%',
      h: 0.3,
      fontSize: 10,
      color: COLORS.darkGray,
      align: 'center',
      fontFace: 'Arial',
      charSpacing: 3,
    });

    // ========== IDEA SLIDES ==========
    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i];
      const slide = pptx.addSlide();
      slide.background = { color: COLORS.backgroundAlt };

      // Header - Idea number
      slide.addText(`IDEA ${i + 1}`, {
        x: 0.5,
        y: 0.3,
        w: 2,
        h: 0.3,
        fontSize: 10,
        color: COLORS.accent,
        fontFace: 'Arial',
        charSpacing: 2,
      });

      // Header - Client name
      slide.addText(client.name, {
        x: 10.5,
        y: 0.3,
        w: 2.5,
        h: 0.3,
        fontSize: 10,
        color: COLORS.darkGray,
        fontFace: 'Arial',
        align: 'right',
      });

      // Header line
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 0.7,
        w: 12.5,
        h: 0.01,
        fill: { color: '333333' },
        line: { color: '333333', width: 0 },
      });

      // LEFT COLUMN

      // Idea title
      slide.addText(idea.title, {
        x: 0.5,
        y: 0.9,
        w: 7,
        h: 0.8,
        fontSize: 28,
        color: COLORS.white,
        bold: true,
        fontFace: 'Arial',
        valign: 'top',
      });

      // Overview
      slide.addText(idea.overview, {
        x: 0.5,
        y: 1.7,
        w: 7,
        h: 1.0,
        fontSize: 12,
        color: COLORS.lightGray,
        fontFace: 'Arial',
        valign: 'top',
      });

      // Key Features label
      slide.addText('KEY FEATURES', {
        x: 0.5,
        y: 2.8,
        w: 7,
        h: 0.3,
        fontSize: 9,
        color: COLORS.accent,
        fontFace: 'Arial',
        charSpacing: 2,
      });

      // Features list
      const featuresText = idea.features.map((f) => `• ${f}`).join('\n');
      slide.addText(featuresText, {
        x: 0.5,
        y: 3.1,
        w: 7,
        h: 1.5,
        fontSize: 11,
        color: COLORS.lightGray,
        fontFace: 'Arial',
        valign: 'top',
      });

      // Why It Works section (box)
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 4.7,
        w: 7,
        h: 1.2,
        fill: { color: '0d1a33' },
        line: { color: '1a3366', width: 1 },
      });

      slide.addText('WHY IT WORKS', {
        x: 0.7,
        y: 4.85,
        w: 6.6,
        h: 0.25,
        fontSize: 9,
        color: COLORS.accent,
        fontFace: 'Arial',
        charSpacing: 2,
      });

      slide.addText(idea.brand_fit, {
        x: 0.7,
        y: 5.15,
        w: 6.6,
        h: 0.65,
        fontSize: 11,
        color: COLORS.lightGray,
        fontFace: 'Arial',
        valign: 'top',
      });

      // RIGHT COLUMN

      // Image placeholder or actual image
      if (idea.image_url) {
        try {
          slide.addImage({
            path: idea.image_url,
            x: 8,
            y: 0.9,
            w: 5,
            h: 3.5,
          });
        } catch {
          // If image fails, add placeholder
          slide.addShape(pptx.ShapeType.rect, {
            x: 8,
            y: 0.9,
            w: 5,
            h: 3.5,
            fill: { color: '1a1a2e' },
            line: { color: '333333', width: 1 },
          });
          slide.addText('Image', {
            x: 8,
            y: 2.4,
            w: 5,
            h: 0.5,
            fontSize: 14,
            color: COLORS.darkGray,
            align: 'center',
            fontFace: 'Arial',
          });
        }
      } else {
        slide.addShape(pptx.ShapeType.rect, {
          x: 8,
          y: 0.9,
          w: 5,
          h: 3.5,
          fill: { color: '1a1a2e' },
          line: { color: '333333', width: 1 },
        });
        slide.addText('Image Placeholder', {
          x: 8,
          y: 2.4,
          w: 5,
          h: 0.5,
          fontSize: 14,
          color: COLORS.darkGray,
          align: 'center',
          fontFace: 'Arial',
        });
      }

      // Image prompt box
      slide.addShape(pptx.ShapeType.rect, {
        x: 8,
        y: 4.5,
        w: 5,
        h: 1.4,
        fill: { color: '151525' },
        line: { color: '252535', width: 1 },
      });

      slide.addText('IMAGE PROMPT', {
        x: 8.15,
        y: 4.6,
        w: 4.7,
        h: 0.25,
        fontSize: 8,
        color: COLORS.darkGray,
        fontFace: 'Arial',
        charSpacing: 1,
      });

      slide.addText(idea.image_prompt, {
        x: 8.15,
        y: 4.85,
        w: 4.7,
        h: 0.95,
        fontSize: 9,
        color: COLORS.gray,
        fontFace: 'Arial',
        valign: 'top',
        italic: true,
      });
    }

    // ========== END SLIDE ==========
    const endSlide = pptx.addSlide();
    endSlide.background = { color: COLORS.background };

    endSlide.addText('Thank You', {
      x: 0.5,
      y: 2.5,
      w: '90%',
      h: 1.0,
      fontSize: 44,
      color: COLORS.white,
      bold: true,
      align: 'center',
      fontFace: 'Arial',
    });

    endSlide.addText('Ready to bring these ideas to life?', {
      x: 0.5,
      y: 3.5,
      w: '90%',
      h: 0.5,
      fontSize: 18,
      color: COLORS.gray,
      align: 'center',
      fontFace: 'Arial',
    });

    const endMeta = properties.length > 0
      ? `${client.name} × ${properties.map((p) => p.name).join(', ')}`
      : client.name;
    endSlide.addText(endMeta, {
      x: 0.5,
      y: 4.3,
      w: '90%',
      h: 0.4,
      fontSize: 12,
      color: COLORS.darkGray,
      align: 'center',
      fontFace: 'Arial',
    });

    const generatedDate = new Date(session.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    endSlide.addText(`Generated ${generatedDate}`, {
      x: 0.5,
      y: 4.7,
      w: '90%',
      h: 0.3,
      fontSize: 10,
      color: COLORS.darkGray,
      align: 'center',
      fontFace: 'Arial',
    });

    endSlide.addText('POWERED BY PRIMER', {
      x: 0.5,
      y: 6.8,
      w: '90%',
      h: 0.3,
      fontSize: 10,
      color: COLORS.darkGray,
      align: 'center',
      fontFace: 'Arial',
      charSpacing: 3,
    });

    // Generate the PowerPoint file
    const buffer = await pptx.write({ outputType: 'arraybuffer' }) as ArrayBuffer;

    // Create filename
    const sanitizedClientName = client.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedClientName}_Ideas.pptx`;

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    return NextResponse.json(
      { error: 'Failed to generate PowerPoint' },
      { status: 500 }
    );
  }
}
