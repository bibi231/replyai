import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiParseError } from '../utils/errors.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export type ToneType = 'professional' | 'friendly' | 'firm' | 'apologetic' | 'custom';

export interface ReplyDraft {
    id: string;
    label: string;
    subject: string;
    body: string;
    wordCount: number;
}

export async function generateReplies(emailContent: string, tone: ToneType, context?: string): Promise<ReplyDraft[]> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemInstruction = `You are an expert email communication specialist. Your job is to help professionals, entrepreneurs, and students write email replies that are clear, effective, and perfectly toned.

You must return EXACTLY 3 email reply drafts. Each draft must be meaningfully different — different length, different opening, different angle. Not just slight rewording.

Return ONLY valid JSON. No markdown. No explanation. No backticks. No preamble.

Schema:
[
  {
    "label": "short descriptive label for this draft style (max 5 words)",
    "subject": "Re: [appropriate subject line]",
    "body": "full email body text. Use proper paragraphs. Do NOT include a subject line inside the body."
  }
]

TONE GUIDE:
- professional: formal, respectful, clear, business/academic appropriate
- friendly: warm, conversational, approachable, still appropriate
- firm: direct, assertive, no apology, holds position confidently
- apologetic: empathetic, takes responsibility, seeks resolution
- custom: follow the user's custom tone instruction exactly

RULES:
- Write real, usable email bodies. Not generic filler.
- Do not add [Your Name] or signature placeholders — end naturally
- Draft 1: concise (under 100 words), Draft 2: balanced (100-180 words), Draft 3: thorough (180-250 words)
- Never start all three drafts with "Thank you" — vary the openings
- If the email has Nigerian context (naira, Lagos, NYSC, Nigerian institutions), reflect cultural awareness naturally`;

    let prompt = `Tone: ${tone}
${context ? `Context: ${context}\n` : ''}
Email received:
---
${emailContent}
---

Return the 3 reply drafts as JSON only.`;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            systemInstruction: { role: 'user', parts: [{ text: systemInstruction }] },
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.8,
            }
        });

        let text = result.response.text();
        return parseGeminiResponse(text);
    } catch (err) {
        if (err instanceof SyntaxError) {
            prompt += '\nCRITICAL: Return ONLY the raw JSON array. Nothing before it, nothing after it.';
            const retryResult = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                systemInstruction: { role: 'user', parts: [{ text: systemInstruction }] },
                generationConfig: { maxOutputTokens: 2048, temperature: 0.8 }
            });
            try {
                let text = retryResult.response.text();
                return parseGeminiResponse(text);
            } catch (retryErr) {
                throw new GeminiParseError('Failed to parse Gemini response after retry');
            }
        }
        throw err;
    }
}

function parseGeminiResponse(text: string): ReplyDraft[] {
    text = text.trim();
    if (text.startsWith('\`\`\`json')) {
        text = text.substring(7);
    } else if (text.startsWith('\`\`\`')) {
        text = text.substring(3);
    }
    if (text.endsWith('\`\`\`')) {
        text = text.substring(0, text.length - 3);
    }
    text = text.trim();

    const parsed = JSON.parse(text) as any[];
    return parsed.map((draft: any) => ({
        id: crypto.randomUUID(),
        label: draft.label,
        subject: draft.subject,
        body: draft.body,
        wordCount: draft.body.split(/\s+/).filter((w: string) => w.length > 0).length
    }));
}
