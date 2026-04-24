export const AI_MODELS = {
  listing: process.env.CLAUDE_MODEL_LISTING ?? "claude-sonnet-4-6",
  social:  process.env.CLAUDE_MODEL_SOCIAL  ?? "claude-haiku-4-5-20251001",
  edit:    process.env.CLAUDE_MODEL_EDIT    ?? "claude-sonnet-4-6",
  chat:    process.env.CLAUDE_MODEL_CHAT    ?? "claude-haiku-4-5-20251001",
} as const;

export const AI_TEMPERATURES = {
  listing: 0.4,
  social:  0.7,
  edit:    0.4,
  chat:    0.5,
} as const;

export const AI_COSTS: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6":         { input: 3,  output: 15 },
  "claude-haiku-4-5-20251001": { input: 1,  output: 5  },
};
