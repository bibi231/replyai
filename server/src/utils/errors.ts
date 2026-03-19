export class GeminiParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GeminiParseError';
    }
}
