import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToneType = 'professional' | 'friendly' | 'firm' | 'apologetic' | 'custom';
export type OutputLanguage = 'en' | 'pidgin' | 'yoruba' | 'hausa' | 'fr';

export interface ReplyDraft {
  id: string;
  label: string;
  subject: string;
  body: string;
  wordCount: number;
}

export const OUTPUT_LANGUAGES: Record<OutputLanguage, { label: string; icon: string }> = {
  en: { label: 'English', icon: '🇬🇧' },
  pidgin: { label: 'Pidgin', icon: '🇳🇬' },
  yoruba: { label: 'Yoruba', icon: '🇳🇬' },
  hausa: { label: 'Hausa', icon: '🇳🇬' },
  fr: { label: 'French', icon: '🇫🇷' },
};

// ── Prompts ────────────────────────────────────────────────────────────────────

function getSystemPrompt(language: OutputLanguage = 'en'): string {
  const langNames: Record<OutputLanguage, string> = {
    en: 'English',
    pidgin: 'Nigerian Pidgin',
    yoruba: 'Yoruba',
    hausa: 'Hausa',
    fr: 'French'
  };

  const languageInstruction = language === 'en'
    ? 'Write the replies in professional English.'
    : `CRITICAL: Write the replies EXCLUSIVELY in ${langNames[language]}. Do NOT use English unless for untranslatable technical terms.`;

  const pidginSpecial = language === 'pidgin'
    ? 'For Pidgin: Keep it professional but authentic. Use standard Pidgin expressions common in Nigerian business/work environments (e.g., "I de write to...", "Regarding the matter wey we talk...").'
    : '';

  return `You are an expert email communication specialist helping professionals write email replies.

Return EXACTLY 3 reply drafts. Each must be meaningfully different in length, opening, and angle.
${languageInstruction}
${pidginSpecial}

Return ONLY valid JSON. No markdown fences. No backticks. No preamble. No explanation after.

Schema:
[
  {
    "label": "max 5 word style label",
    "subject": "Re: [appropriate subject line]",
    "body": "full reply body text. proper paragraphs. no subject line inside body."
  }
]

TONE GUIDE:
- professional: formal, respectful, business or academic appropriate
- friendly: warm, conversational, approachable, still professional
- firm: direct, assertive, holds position, no unnecessary apology
- apologetic: empathetic, takes responsibility, seeks resolution
- custom: follow the user's exact tone instruction precisely

RULES:
- Write real usable email bodies — not filler or template language
- Never add [Your Name] or signature placeholders — end naturally
- Draft 1: under 100 words body. Draft 2: 100-180 words. Draft 3: 180-250 words
- Vary all three openings — never start all three the same way
- If Nigerian context detected (naira, Lagos, NYSC, Nigerian institutions, Nollywood), reflect that naturally`;
}

function buildUserPrompt(emailContent: string, tone: ToneType, context?: string): string {
  return [
    `Tone: ${tone}`,
    context ? `Context: ${context}` : '',
    '',
    'Email to reply to:',
    '---',
    emailContent,
    '---',
    '',
    'Return JSON only.',
  ].filter((line) => line !== null && line !== undefined && !(line === '' && !context)).join('\n');
}

// ── Parse & validate ───────────────────────────────────────────────────────────

function parseResponse(raw: string): ReplyDraft[] {
  // Strip accidental markdown fences even when model ignores instructions
  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new AIParseError(`JSON.parse failed on: ${cleaned.slice(0, 300)}`);
  }

  if (!Array.isArray(parsed) || parsed.length < 1) {
    throw new AIParseError(`Expected JSON array, got ${typeof parsed}`);
  }

  return (parsed as Array<{ label?: unknown; subject?: unknown; body?: unknown }>).map((item, i) => {
    if (typeof item.label !== 'string' || typeof item.subject !== 'string' || typeof item.body !== 'string') {
      throw new AIParseError(`Draft ${i} is missing required string fields`);
    }
    return {
      id: randomUUID(),
      label: item.label.trim(),
      subject: item.subject.trim(),
      body: item.body.trim(),
      wordCount: item.body.trim().split(/\s+/).length,
    };
  });
}

// ── Individual model callers ───────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function callGemini20Flash(userPrompt: string, systemPrompt: string): Promise<ReplyDraft[]> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
    generationConfig: { maxOutputTokens: 2048, temperature: 0.8 },
  });
  return parseResponse(result.response.text());
}

async function callGemini15Flash(userPrompt: string, systemPrompt: string): Promise<ReplyDraft[]> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
    generationConfig: { maxOutputTokens: 2048, temperature: 0.8 },
  });
  return parseResponse(result.response.text());
}

async function callGroqLlama(userPrompt: string, systemPrompt: string): Promise<ReplyDraft[]> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 2048,
    temperature: 0.8,
  });
  const text = completion.choices[0]?.message?.content ?? '';
  if (!text) throw new AIParseError('Groq returned empty content');
  return parseResponse(text);
}

export class AIParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIParseError';
  }
}

export class AIAllModelsFailedError extends Error {
  constructor(public readonly modelErrors: string[]) {
    super('All AI models failed: ' + modelErrors.join(' | '));
    this.name = 'AIAllModelsFailedError';
  }
}

// ── Main export ────────────────────────────────────────────────────────────────

/**
 * Generate 3 AI reply drafts.
 * Fallback chain: Gemini 2.0 Flash → Gemini 1.5 Flash → Groq Llama 3.3 70B
 *
 * All models use the same prompt and return the same ReplyDraft[] shape.
 * Credits deduct identically regardless of which model ran.
 * Users never see which model was used.
 *
 * @throws AIAllModelsFailedError if every model fails
 */
export async function generateReplies(
  emailContent: string,
  tone: ToneType,
  context?: string,
  outputLanguage: OutputLanguage = 'en'
): Promise<ReplyDraft[]> {
  const userPrompt = buildUserPrompt(emailContent, tone, context);
  const systemPrompt = getSystemPrompt(outputLanguage);
  const errors: string[] = [];
  const isDev = process.env.NODE_ENV === 'development';

  // 1. Gemini 2.0 Flash
  try {
    const drafts = await callGemini20Flash(userPrompt, systemPrompt);
    if (isDev) console.log(`[AI] gemini-2.0-flash ✓ (${outputLanguage})`);
    return drafts;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`gemini-2.0-flash: ${msg.slice(0, 120)}`);
    if (isDev) console.warn('[AI] gemini-2.0-flash ✗', msg);
  }

  // 2. Gemini 1.5 Flash
  try {
    const drafts = await callGemini15Flash(userPrompt, systemPrompt);
    if (isDev) console.log(`[AI] gemini-1.5-flash ✓ (fallback) (${outputLanguage})`);
    return drafts;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`gemini-1.5-flash: ${msg.slice(0, 120)}`);
    if (isDev) console.warn('[AI] gemini-1.5-flash ✗', msg);
  }

  // 3. Groq Llama 3.3 70B
  if (process.env.GROQ_API_KEY) {
    try {
      const drafts = await callGroqLlama(userPrompt, systemPrompt);
      if (isDev) console.log(`[AI] groq/llama-3.3-70b ✓ (emergency fallback) (${outputLanguage})`);
      return drafts;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`groq/llama-3.3-70b: ${msg.slice(0, 120)}`);
      if (isDev) console.warn('[AI] groq/llama-3.3-70b ✗', msg);
    }
  } else {
    errors.push('groq: GROQ_API_KEY not configured');
  }

  throw new AIAllModelsFailedError(errors);
}

// ── Meeting Notes AI ───────────────────────────────────────────────────────────

const MEETING_SUMMARIZE_SYSTEM = `You are a meeting summarizer. Given raw meeting notes, output a concise 3-5 bullet summary capturing key decisions, discussion points, and outcomes. No fluff. Return plain text with bullet points (use "• " prefix). No markdown headers.`;

const MEETING_EXTRACT_SYSTEM = `Extract action items from meeting notes. Return ONLY valid JSON array, no markdown fences:
[{"text":"task description","assignee":"Name or Unassigned","priority":"low|medium|high","suggestedDueDate":"YYYY-MM-DD or null"}]
Be precise. Only include real action items, not discussion points. If no assignee is mentioned, use "Unassigned".`;

async function callModelGeneric(
  userPrompt: string,
  systemPrompt: string
): Promise<string> {
  const errors: string[] = [];
  const isDev = process.env.NODE_ENV === 'development';

  // 1. Gemini 2.0 Flash
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
    });
    if (isDev) console.log('[AI:meeting] gemini-2.0-flash ok');
    return result.response.text();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push('gemini-2.0-flash: ' + msg.slice(0, 120));
    if (isDev) console.warn('[AI:meeting] gemini-2.0-flash fail', msg);
  }

  // 2. Gemini 1.5 Flash
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
    });
    if (isDev) console.log('[AI:meeting] gemini-1.5-flash ok');
    return result.response.text();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push('gemini-1.5-flash: ' + msg.slice(0, 120));
    if (isDev) console.warn('[AI:meeting] gemini-1.5-flash fail', msg);
  }

  // 3. Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      });
      const text = completion.choices[0]?.message?.content ?? '';
      if (!text) throw new Error('Empty response');
      if (isDev) console.log('[AI:meeting] groq ok');
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push('groq: ' + msg.slice(0, 120));
    }
  }

  throw new AIAllModelsFailedError(errors);
}

export async function summarizeMeeting(
  rawNotes: string
): Promise<string> {
  return callModelGeneric(rawNotes, MEETING_SUMMARIZE_SYSTEM);
}

export interface ExtractedActionItem {
  text: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  suggestedDueDate: string | null;
}

export async function extractActionItems(
  rawNotes: string
): Promise<ExtractedActionItem[]> {
  const raw = await callModelGeneric(rawNotes, MEETING_EXTRACT_SYSTEM);
  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new AIParseError('Expected JSON array for action items');
  }
  return parsed;
}
