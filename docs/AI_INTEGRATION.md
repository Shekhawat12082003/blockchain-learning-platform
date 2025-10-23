# 🤖 AI Integration Guide

## Overview

The platform uses three FREE AI providers with automatic fallback:
1. **Google Gemini** (Primary - Best responses)
2. **HuggingFace** (Secondary - Open source models)
3. **Cohere** (Tertiary - Backup)
4. **Mock Mode** (Fallback - No API keys needed)

## API Providers

### Google Gemini (Recommended)

**Model**: gemini-pro
**Tier**: FREE
**Rate Limit**: 60 requests/minute

#### Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `frontend/.env`:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

#### Features
- Best response quality
- Fast response times
- Large context window
- Multi-turn conversations

### HuggingFace Inference API

**Model**: google/flan-t5-base
**Tier**: FREE
**Rate Limit**: 1000 requests/day

#### Setup
1. Sign up at [HuggingFace](https://huggingface.co/)
2. Settings → Access Tokens → New Token
3. Add to `frontend/.env`:
   ```env
   VITE_HUGGINGFACE_API_KEY=your_token_here
   ```

#### Features
- Open source models
- Good for simple queries
- Fast inference
- Multiple model options

### Cohere

**Model**: command-r-plus-08-2024
**Tier**: FREE (Trial)
**Rate Limit**: 100 calls/minute

#### Setup
1. Sign up at [Cohere](https://cohere.com/)
2. Copy API key from dashboard
3. Add to `frontend/.env`:
   ```env
   VITE_COHERE_API_KEY=your_api_key_here
   ```

#### Features
- Good conversational AI
- Handles complex queries
- Reliable fallback option

## Fallback System

The app tries providers in order:
```
Gemini → HuggingFace → Cohere → Mock Mode
```

If one fails, it automatically tries the next.

## Mock Mode

When no API keys are configured:
- Provides educational responses
- No external API calls
- Great for testing UI
- Sample data for demonstrations

## API Service Architecture

### File: `frontend/src/services/aiService.js`

```javascript
// Provider detection
getAvailableProviders() {
  const providers = [];
  if (import.meta.env.VITE_GEMINI_API_KEY) providers.push('gemini');
  if (import.meta.env.VITE_HUGGINGFACE_API_KEY) providers.push('huggingface');
  if (import.meta.env.VITE_COHERE_API_KEY) providers.push('cohere');
  return providers;
}

// Auto-fallback
async sendMessage(message, subject) {
  for (const provider of this.availableProviders) {
    try {
      return await this[`call${provider}`](message, subject);
    } catch (error) {
      console.log(`${provider} failed, trying next...`);
      continue;
    }
  }
  return this.getMockResponse(message, subject);
}
```

## Response Format

All providers return plain text responses optimized for:
- Clear explanations
- Educational content
- Under 200 words
- Subject-specific context

## Usage Examples

### Chat Interface
```javascript
import aiService from './services/aiService';

const response = await aiService.sendMessage(
  "Explain blockchain",
  "Computer Science"
);
```

### Quiz Generation
```javascript
import enhancedAIService from './services/enhancedAIService';

const quiz = await enhancedAIService.generateQuiz(
  "React Hooks",
  5 // number of questions
);
```

### Concept Explanation
```javascript
const explanation = await enhancedAIService.explainConcept(
  "async/await",
  "beginner"
);
```

## Best Practices

1. **Always handle errors**: Use try-catch blocks
2. **Show loading states**: API calls take 1-3 seconds
3. **Validate responses**: Check for empty/invalid responses
4. **Rate limiting**: Don't spam requests
5. **User feedback**: Show which provider is being used

## Troubleshooting

### "All providers failed"
- Check API keys are valid
- Verify `.env` file is correct
- Check network connection
- App will use mock mode automatically

### Slow responses
- Normal for HuggingFace (model loading)
- Gemini is fastest
- Consider adding timeout logic

### Invalid API key errors
- Regenerate keys from provider dashboards
- Check for typos in `.env`
- Ensure no extra spaces

## Cost Analysis

| Provider | Free Tier | Cost After |
|----------|-----------|------------|
| Gemini | 60 req/min | Pay-as-you-go |
| HuggingFace | 1000 req/day | $0 (open source) |
| Cohere | Trial credits | $1/1K tokens |
| Mock Mode | Unlimited | $0 |

**Recommended**: Use all three for maximum reliability and stay within free tiers!

## Future Enhancements

- [ ] Add streaming responses
- [ ] Implement conversation memory
- [ ] Add more model options
- [ ] Response caching
- [ ] Rate limit monitoring
