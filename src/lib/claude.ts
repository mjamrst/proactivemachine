import Anthropic from '@anthropic-ai/sdk';
import type { GeneratedIdea, IdeaLane, TechModifier, AudienceModifier, PlatformModifier, BudgetTier, OutputStyle, OutputStyleType } from '@/types/database';

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

EXAMPLE 3: Client: Major Auto Brand | Property: MLS | Lane: Social Impact
Title: "Green Goals"
Overview: A comprehensive sustainability initiative that plants trees for every goal scored across MLS, while converting stadium parking lots into urban green spaces and EV charging hubs. Demonstrates the auto brand's commitment to sustainable transportation and environmental stewardship through the passion of soccer fandom.
Features:
- Tree planting tracker displayed on stadium screens and app showing real-time environmental impact
- "Green Lot" pilot program transforming three MLS stadium parking areas into tree-lined EV charging parks
- Youth soccer clinics in underserved communities with sustainability education curriculum
- Carbon offset program for away fan travel with brand-sponsored credits
Brand Fit: Connects the auto brand's EV and sustainability commitments to passionate fan communities, creating tangible environmental impact while positioning for the future of transportation.
Image Prompt: Photorealistic image of a transformed stadium parking area with trees, green spaces, and modern EV charging stations, diverse families and soccer fans walking through, MLS stadium visible in background, sunny day, hopeful and forward-looking atmosphere

IMPORTANT: Return your response as a valid JSON array. Each object must have these exact keys: title, overview, features (array of strings), brand_fit, image_prompt`;

interface GenerateIdeasParams {
  clientName: string;
  propertyNames: string[];
  ideaLane: IdeaLane;
  techModifiers?: TechModifier[];
  audienceModifier?: AudienceModifier;
  platformModifier?: PlatformModifier;
  budgetTier?: BudgetTier;
  talentNames?: string[];
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
    name: 'Tech Bro',
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
  },
  data_nerd: {
    name: 'Data Nerd',
    base: 'Write with an analytical, data-driven perspective. Research and include relevant statistics, market data, and industry insights to support each idea. Back up claims with numbers and cite data points that demonstrate why an idea will work.',
    intensifiers: [
      'Include a few relevant statistics or data points to support your ideas.',
      'Weave in market research, industry stats, and relevant metrics. Reference consumer behavior data and trends.',
      'Be analytical and rigorous. Include specific percentages, growth rates, market sizes, and audience demographics. Cite industry reports and research findings.',
      'Go deep into the data. Reference specific studies, surveys, and analytics. Include ROI projections, engagement benchmarks, and comparative performance metrics. Think like a strategist presenting to a data-savvy CMO.',
      'Full analytics mode: Every claim should be backed by data. Include specific statistics (e.g., "73% of Gen Z consumers..."), market valuations, YoY growth rates, engagement metrics, conversion benchmarks, and industry research. Reference sources like Nielsen, Statista, eMarketer, and league-specific data. Make the business case undeniable with numbers.'
    ]
  }
};

// Detailed guidance for each technology modifier
const TECH_MODIFIER_GUIDANCE: Record<TechModifier, string> = {
  'AI': 'Artificial intelligence, machine learning, personalization engines, predictive analytics, chatbots, recommendation systems',
  'VR': 'Virtual reality—immersive environments, 360° experiences, headsets, virtual venues, simulated experiences',
  'AR': 'Augmented reality—mobile overlays, Snap/Instagram filters, real-world digital enhancement, interactive displays',
  'Web3': 'Blockchain, NFTs, token-gated access, digital collectibles, cryptocurrency rewards, decentralized ownership',
  'Wearables': 'Smartwatches, fitness bands, haptic devices, connected apparel, biometric tracking',
  'Voice': 'Voice assistants (Alexa, Google Home), audio interfaces, voice-activated experiences, smart speakers',
  'Drones': 'Aerial photography, drone delivery, synchronized light shows, crowd capture, sky-writing',
  'NFC/RFID': 'Tap-to-interact, contactless engagement, smart credentials, proximity triggers, digital keepsakes',
};

// Detailed guidance for each audience modifier
const AUDIENCE_MODIFIER_GUIDANCE: Record<AudienceModifier, string> = {
  'gen_z': 'Ages 13–27; mobile-first, short-form video natives, value authenticity over polish, socially conscious, meme-literate, expect participation not passive consumption',
  'millennials': 'Ages 28–43; digitally savvy, nostalgic for \'90s/\'00s culture, experience-driven over material goods, balancing career and family, appreciate quality and purpose',
  'families': 'Multi-generational appeal, kid-friendly mechanics, shared experiences for parents and children together, convenience and accessibility, wholesome engagement',
  'superfans': 'Deep devotees who collect memorabilia, travel to events, and prioritize fandom; reward with exclusivity, insider access, early drops, and recognition',
  'casual_fans': 'Light engagement, attracted by major moments and cultural buzz; lower-commitment tactics, broad appeal, easy on-ramps, shareable content',
  'b2b_corporate': 'Hospitality clients, suite holders, corporate partners; emphasize ROI, relationship-building, premium touchpoints, business value, networking opportunities',
};

// Detailed guidance for each platform modifier
const PLATFORM_MODIFIER_GUIDANCE: Record<PlatformModifier, string> = {
  'tiktok': 'Short-form vertical video (15-60s optimal), trending sounds and hashtags, creator collaborations, duets & stitches, authentic lo-fi aesthetic, challenge mechanics',
  'instagram': 'Reels, Stories, carousel posts, influencer partnerships, aesthetic polish, grid-worthy visuals, DM engagement, shopping integration',
  'youtube': 'Long-form content & Shorts, creator integrations, pre-roll opportunities, episodic series, searchable content, community engagement',
  'twitch': 'Live streaming, real-time chat interaction, streamer partnerships, raids & drops, subscriber perks, gaming and IRL content',
  'x': 'Real-time conversation, hashtag campaigns, quote tweets, trending moments, breaking news tie-ins, community engagement, spaces',
  'snapchat': 'AR lenses, Discover content, ephemeral stories, quick shareable moments, younger demo skew, location-based features',
  'discord': 'Community servers, AMAs, exclusive member channels, gamer and creator communities, bot integrations, persistent community building',
};

// Detailed guidance for each budget tier
const BUDGET_TIER_GUIDANCE: Record<BudgetTier, { label: string; description: string }> = {
  'scrappy': {
    label: 'Scrappy (Under $50K)',
    description: 'Guerrilla tactics, user-generated content, low-production social content, organic community building, grassroots activations, creative partnerships over paid media',
  },
  'mid_tier': {
    label: 'Mid-Tier ($50K–$500K)',
    description: 'Quality production values, targeted influencer partnerships, localized or regional experiences, strategic paid media, professional creative execution',
  },
  'flagship': {
    label: 'Flagship ($500K+)',
    description: 'Broadcast-quality creative, celebrity or major athlete talent, stadium-level activations, national/international campaigns, integrated media buys, tentpole moments',
  },
};

function buildUserPrompt(params: GenerateIdeasParams): string {
  const {
    clientName,
    propertyNames,
    ideaLane,
    techModifiers,
    audienceModifier,
    platformModifier,
    budgetTier,
    talentNames,
    numIdeas,
    documentContext,
    outputStyle,
  } = params;

  const laneLabels: Record<IdeaLane, string> = {
    live_experience: 'Live Experience',
    digital: 'Digital',
    content: 'Content',
    social_impact: 'Social Impact',
    talent_athlete: 'Talent/Athlete',
    gaming_esports: 'Gaming/Esports',
    hospitality_vip: 'Hospitality/VIP',
    retail_product: 'Retail/Product',
  };

  let prompt = `Generate ${numIdeas} distinct sponsorship activation ideas for:

CLIENT: ${clientName}`;

  if (propertyNames.length > 0) {
    prompt += `\nPROPERTY/PARTNER: ${propertyNames.join(', ')}`;
  }

  prompt += `\nIDEA LANE: ${laneLabels[ideaLane]}`;

  if (techModifiers && techModifiers.length > 0) {
    const techDetails = techModifiers.map(mod => `${mod}: ${TECH_MODIFIER_GUIDANCE[mod]}`).join('\n  - ');
    prompt += `\n\nTECHNOLOGY FOCUS: Incorporate these technologies naturally into the activation concepts:
  - ${techDetails}
Ideas should leverage these technologies in innovative ways that enhance the experience, not feel forced or gimmicky.`;
  }

  if (audienceModifier) {
    prompt += `\n\nTARGET AUDIENCE: ${AUDIENCE_MODIFIER_GUIDANCE[audienceModifier]}
Tailor the idea's tone, channels, creative approach, and mechanics specifically for this demographic. Consider their media consumption habits, values, and engagement preferences.`;
  }

  if (platformModifier) {
    prompt += `\n\nPLATFORM FOCUS: ${PLATFORM_MODIFIER_GUIDANCE[platformModifier]}
Optimize the idea for this platform's native format, culture, and best practices. Consider platform-specific mechanics, content formats, and engagement patterns.`;
  }

  if (budgetTier) {
    const budgetInfo = BUDGET_TIER_GUIDANCE[budgetTier];
    prompt += `\n\nBUDGET TIER: ${budgetInfo.label}
${budgetInfo.description}
Calibrate the idea's scope, complexity, and production requirements to be realistic and achievable within this budget range.`;
  }

  // Add Social Impact lane specific guidance
  if (ideaLane === 'social_impact') {
    prompt += `\n\nSOCIAL IMPACT FOCUS: These ideas should center on corporate responsibility, sustainability, and community engagement. Consider how the brand can authentically address societal challenges such as:
- Climate change and environmental sustainability
- Social justice, equity, and inclusion
- Community development and economic empowerment
- Education and workforce development
- The future of work and technology's role in society
- Health and wellness initiatives
- Youth development and mentorship

Ideas should demonstrate meaningful brand commitment (not just cause marketing), create tangible community benefit, and leverage the property partnership to amplify social good. Think about how the brand can show up as a force for positive change while maintaining authenticity.`;
  }

  // Add Talent/Athlete specific guidance with named talent
  if (ideaLane === 'talent_athlete' && talentNames && talentNames.length > 0) {
    const talentList = talentNames.join(', ');
    prompt += `\n\nFEATURED TALENT: ${talentList}

IMPORTANT: All activation ideas MUST prominently feature and be built around the specified talent/athlete(s). Consider:
- Their unique personality, brand, and public persona
- Their specific sport/field, achievements, and cultural relevance
- Their existing brand partnerships and how they align with the client
- Their social media presence and fan engagement style
- Content formats and platforms where they're most authentic
- Ways to leverage their story, background, or signature moments

Each idea should feel tailor-made for these specific individuals, not generic talent activations. The talent should be central to the concept, not just an add-on endorsement.`;
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
