import Anthropic from '@anthropic-ai/sdk';
import type { GeneratedIdea, IdeaLane, TechModifier, ContentStyle, OutputStyle, OutputStyleType } from '@/types/database';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior creative strategist at the world's largest sports and entertainment agency. You generate bold, innovative sponsorship activation ideas for major brands.

Your ideas should be:
- Culturally relevant and timely
- Specific to the brand's identity and the property's audience
- Executable and realistic (not sci-fi fantasy)
- Distinct from each other -- different creative angles, not variations of the same concept

For each idea, provide:
1. TITLE: A punchy 2-4 word name that's memorable and captures the essence
2. OVERVIEW: 2-3 sentences explaining the core concept
3. FEATURES: 3-4 bullet points on key activation elements
4. BRAND FIT: 1-2 sentences on why this works specifically for this brand
5. IMAGE PROMPT: A detailed prompt for generating a hero image (photorealistic, showing the activation in action, include brand context without using logos)

Example ideas for reference:

EXAMPLE 1: Client: Major Telecom Brand | Property: PGA Tour | Lane: Live Experience + AI
Title: "The AI Caddy"
Overview: An AI-powered caddy experience that uses 5G connectivity to provide real-time course analytics, wind patterns, and shot recommendations to amateur golfers at PGA events. Demonstrates the brand's network capability in a premium, high-stakes environment.
Features:
- AI caddy stations at fan experience zones with real-time shot analysis
- 5G-powered tablets showing live course conditions and player stats
- "Beat the Pro" challenge where fans compete against AI predictions
- Data visualization wall showing network performance across the course
Brand Fit: Showcases 5G network reliability in a premium environment where precision matters, connecting technology to aspiration.
Image Prompt: Photorealistic image of a golfer at a PGA event looking at a sleek tablet displaying AI-powered shot recommendations, with a modern activation booth in the background, sunny day, premium feel, crowds in background

EXAMPLE 2: Client: Financial Services Brand | Property: NBA All-Star Weekend | Lane: Content + Creator-Led
Title: "Creator Court"
Overview: A creator-focused content studio and networking brunch during All-Star Weekend exploring the intersection of sports, streaming, and entrepreneurship. Positions the brand as a partner for the next generation of athlete-creators building businesses.
Features:
- Invite-only brunch with NBA players who are also creators/entrepreneurs
- Live podcast recordings with financial literacy angle
- Content creation stations for attendees to produce branded clips
- "Pitch Your Side Hustle" competition with brand mentorship prize
Brand Fit: Aligns the financial brand with entrepreneurial ambition and the creator economy, reaching a younger demographic through authentic voices.
Image Prompt: Photorealistic image of a stylish brunch setting with diverse young creators and athletes in conversation, podcast microphones on tables, modern industrial venue, NBA All-Star branding visible, warm lighting, aspirational but accessible vibe

IMPORTANT: Return your response as a valid JSON array. Each object must have these exact keys: title, overview, features (array of strings), brand_fit, image_prompt`;

interface GenerateIdeasParams {
  clientName: string;
  propertyNames: string[];
  ideaLane: IdeaLane;
  techModifiers?: TechModifier[];
  contentStyle?: ContentStyle;
  numIdeas: number;
  documentContext?: string;
  outputStyle?: OutputStyle;
}

// Output style personality prompts with intensity levels
const OUTPUT_STYLE_PROMPTS: Record<OutputStyleType, { name: string; base: string; intensifiers: string[] }> = {
  generic: {
    name: 'No Sauce',
    base: '',
    intensifiers: ['', '', '', '', '']
  },
  techbro: {
    name: 'Techbro',
    base: 'Write with a tech-forward perspective. Use startup and technology terminology. Focus on disruption, scalability, and innovation.',
    intensifiers: [
      'Lightly incorporate tech terminology where relevant.',
      'Use tech industry language and reference emerging technologies.',
      'Heavily lean into startup culture - talk about disrupting, scaling, 10x-ing. Reference specific technologies and platforms.',
      'Go full Silicon Valley - mention Series A potential, talk about moats and flywheels, reference specific tech stacks and platforms like they\'re common knowledge.',
      'Maximum techbro mode: Every idea should sound like a pitch deck. Use terms like "paradigm shift," "first-mover advantage," "network effects," and "vertical integration." Reference specific APIs, protocols, and tech infrastructure.'
    ]
  },
  creative_strategist: {
    name: 'Creative Strategist',
    base: 'Write with an inspirational, creative flair. Use evocative language and paint vivid pictures. Think big-picture and strategic.',
    intensifiers: [
      'Add subtle creative flourishes to your writing.',
      'Use more evocative, inspirational language. Paint pictures with words.',
      'Write like a top creative director - use powerful metaphors, unexpected word combinations, and inspire action.',
      'Channel your inner Don Draper. Every sentence should feel quotable. Use rhetorical devices, create tension and release.',
      'Full creative manifesto mode: Write like you\'re crafting the next iconic campaign. Use poetic devices, create narrative arcs within each idea, make people feel something profound.'
    ]
  },
  gen_z: {
    name: 'Gen Z',
    base: 'Write in a casual, Gen Z style. Use current slang naturally. Keep it authentic and relatable without trying too hard.',
    intensifiers: [
      'Keep the tone casual and approachable with occasional modern phrases.',
      'Use Gen Z expressions naturally - "no cap," "it\'s giving," etc. Be conversational.',
      'Lean into the vibe. Use slang freely, reference memes and internet culture, keep it real.',
      'Very much giving main character energy. Use heavy slang, reference TikTok trends, be chronically online.',
      'Full unhinged Gen Z mode: The way these ideas are absolutely serving? No cap, it\'s giving innovation, it\'s giving cultural reset, the girlies are gonna eat this up. Slay.'
    ]
  },
  sports_expert: {
    name: 'Sports Expert',
    base: 'Write with deep sports knowledge. Reference specific athletes, teams, historic moments, and use sports metaphors throughout.',
    intensifiers: [
      'Include relevant sports references and athlete mentions.',
      'Weave in specific team and athlete references. Use sports metaphors to illustrate points.',
      'Show off your sports knowledge - reference historic games, legendary athletes, team rivalries. Every idea should feel rooted in sports culture.',
      'Go deep into sports history. Reference specific plays, stats, and moments. Name-drop athletes from different eras. Use insider terminology.',
      'Full sports encyclopedia mode: Reference specific game dates, jersey numbers, career stats. Compare ideas to legendary plays. Mention athletes from the \'80s through today. You should sound like you could win any sports trivia night.'
    ]
  },
  world_traveler: {
    name: 'World Traveler',
    base: 'Write with a global perspective. Consider international audiences, cultural nuances, and worldwide relevance.',
    intensifiers: [
      'Consider how ideas might resonate across different cultures.',
      'Think globally - reference international markets and cultural considerations.',
      'Frame every idea with worldwide appeal. Reference specific regions, cultural traditions, and global trends.',
      'Deep global perspective - discuss cultural nuances across continents, reference international events and holidays, consider localization.',
      'Full globetrotter mode: Every idea should feel like it was conceived on a flight between continents. Reference specific cities, cultural practices, international trends, and global movements. Think UNESCO meets Madison Avenue.'
    ]
  }
};

function buildUserPrompt(params: GenerateIdeasParams): string {
  const {
    clientName,
    propertyNames,
    ideaLane,
    techModifiers,
    contentStyle,
    numIdeas,
    documentContext,
    outputStyle,
  } = params;

  const laneLabels: Record<IdeaLane, string> = {
    live_experience: 'Live Experience',
    digital: 'Digital',
    content: 'Content',
  };

  const contentStyleLabels: Record<ContentStyle, string> = {
    creator_led: 'Creator-Led',
    talent_led: 'Talent-Led',
    branded_content: 'Branded Content',
  };

  let prompt = `Generate ${numIdeas} distinct sponsorship activation ideas for:

CLIENT: ${clientName}
PROPERTY/PARTNER: ${propertyNames.join(', ')}
IDEA LANE: ${laneLabels[ideaLane]}`;

  if (techModifiers && techModifiers.length > 0) {
    prompt += `\nTECHNOLOGY FOCUS: ${techModifiers.join(', ')}`;
  }

  if (contentStyle) {
    prompt += `\nCONTENT STYLE: ${contentStyleLabels[contentStyle]}`;
  }

  if (documentContext) {
    prompt += `\n\n${documentContext}`;
    prompt += `\n\nIMPORTANT: Use the information from the reference documents above to make ideas highly specific and relevant to the brand's current goals, campaigns, and challenges. The ideas should directly address the brief requirements if provided.`;
  }

  // Add output style instructions if specified (skip for generic/no-sauce)
  if (outputStyle && outputStyle.type !== 'generic') {
    const styleConfig = OUTPUT_STYLE_PROMPTS[outputStyle.type];
    const intensityIndex = Math.min(outputStyle.intensity - 1, styleConfig.intensifiers.length - 1);
    const intensityPrompt = styleConfig.intensifiers[intensityIndex];

    prompt += `\n\nOUTPUT STYLE: ${styleConfig.name}
${styleConfig.base}
${intensityPrompt}

Apply this style consistently throughout all ideas - in the titles, overviews, features, and brand fit sections.`;
  }

  prompt += `

Each idea must be meaningfully different -- explore different creative territories, not variations of one concept. Stay within the selected idea lane but vary the execution approach.

Return as JSON array with objects containing: title, overview, features (array), brand_fit, image_prompt`;

  return prompt;
}

export async function generateIdeas(
  params: GenerateIdeasParams
): Promise<GeneratedIdea[]> {
  const userPrompt = buildUserPrompt(params);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  // Extract the text content from the response
  const textContent = message.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  // Parse the JSON response
  const responseText = textContent.text;

  // Try to extract JSON from the response (handle markdown code blocks)
  let jsonStr = responseText;
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  } else {
    // Try to find raw JSON array
    const arrayMatch = responseText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonStr = arrayMatch[0];
    }
  }

  try {
    const ideas: GeneratedIdea[] = JSON.parse(jsonStr);

    // Validate the structure
    if (!Array.isArray(ideas)) {
      throw new Error('Response is not an array');
    }

    return ideas.map((idea) => ({
      title: idea.title || 'Untitled Idea',
      overview: idea.overview || '',
      features: Array.isArray(idea.features) ? idea.features : [],
      brand_fit: idea.brand_fit || '',
      image_prompt: idea.image_prompt || '',
    }));
  } catch (parseError) {
    console.error('Failed to parse Claude response:', responseText);
    throw new Error('Failed to parse ideas from Claude response');
  }
}
