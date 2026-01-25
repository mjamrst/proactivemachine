import type { GeneratedIdea, IdeaLane, TechModifier, AudienceModifier, PlatformModifier, BudgetTier, OutputStyle, AIModel } from '@/types/database';
import { generateIdeas as generateIdeasWithClaude } from './claude';
import { generateIdeasWithWriter } from './writer';

export interface GenerateIdeasParams {
  clientName: string;
  propertyNames: string[];
  ideaLane: IdeaLane;
  techModifiers?: TechModifier[];
  audienceModifier?: AudienceModifier;
  platformModifier?: PlatformModifier;
  budgetTier?: BudgetTier;
  numIdeas: number;
  documentContext?: string;
  outputStyle?: OutputStyle;
  model?: AIModel;
}

export async function generateIdeas(
  params: GenerateIdeasParams
): Promise<GeneratedIdea[]> {
  const { model = 'claude', ...generateParams } = params;

  // Check for required API keys
  if (model === 'claude' && !process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  if (model === 'palmyra-creative' && !process.env.WRITER_API_KEY) {
    throw new Error('Writer API key not configured');
  }

  // Route to the appropriate model
  if (model === 'palmyra-creative') {
    return generateIdeasWithWriter(generateParams);
  }

  // Default to Claude
  return generateIdeasWithClaude(generateParams);
}

// Export individual generators for direct access if needed
export { generateIdeasWithClaude, generateIdeasWithWriter };
