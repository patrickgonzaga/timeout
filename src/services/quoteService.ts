import { fallbackQuotes } from '../constants/quotes';
import type { Quote } from '../types/quote';

const ZENQUOTES_ENDPOINT = 'https://zenquotes.io/api/random';
const ADVICE_ENDPOINT = 'https://api.adviceslip.com/advice';
const CORS_PROXY = 'https://corsproxy.io/?';
const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url: string, timeout: number, useCorsProxy = false): Promise<Response> {
  const finalUrl = useCorsProxy ? CORS_PROXY + encodeURIComponent(url) : url;
  
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('API timeout')), timeout)
  );

  const fetchPromise = fetch(finalUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache'
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

async function fetchFromZenQuotes(): Promise<Quote | null> {
  try {
    console.log('📜 Attempting to fetch from ZenQuotes...');
    let response: Response | null = null;
    
    try {
      response = await fetchWithTimeout(ZENQUOTES_ENDPOINT, TIMEOUT_MS, false);
    } catch (e) {
      console.warn('Direct fetch failed, trying CORS proxy...');
      response = await fetchWithTimeout(ZENQUOTES_ENDPOINT, TIMEOUT_MS, true);
    }

    if (!response.ok) {
      console.warn('❌ ZenQuotes API returned status:', response.status);
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = (await response.json()) as Array<{ q: string; a: string; h?: string }>;

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('❌ ZenQuotes API returned unexpected format');
      throw new Error('Empty response');
    }

    const quote = data[0];
    const cleanedQuote = {
      q: quote.q.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#8217;/g, "'"),
      a: quote.a.replace(/\s+\(\d+\)$/, '')
    };
    console.log('✅ Successfully fetched from ZenQuotes');
    return cleanedQuote;
  } catch (error) {
    console.warn('❌ ZenQuotes failed:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function fetchFromAdviceSlip(): Promise<Quote | null> {
  try {
    console.log('💡 Attempting to fetch from AdviceSlip...');
    let response: Response | null = null;
    
    try {
      response = await fetchWithTimeout(ADVICE_ENDPOINT, TIMEOUT_MS, false);
    } catch (e) {
      console.warn('Direct fetch failed, trying CORS proxy...');
      response = await fetchWithTimeout(ADVICE_ENDPOINT, TIMEOUT_MS, true);
    }

    if (!response.ok) {
      console.warn('❌ AdviceSlip API returned status:', response.status);
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = (await response.json()) as { slip?: { advice: string }; error?: string };

    if (data.error || !data.slip?.advice) {
      console.warn('❌ AdviceSlip API returned error:', data.error);
      throw new Error('Empty advice');
    }

    const advice = {
      q: data.slip.advice,
      a: 'AdviceSlip'
    };
    console.log('✅ Successfully fetched from AdviceSlip');
    return advice;
  } catch (error) {
    console.warn('❌ AdviceSlip failed:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

export type QuoteSource = 'mixed' | 'zen' | 'advice';

export async function fetchQuote(source: QuoteSource = 'mixed'): Promise<Quote> {
  console.log(`🎰 Starting fortune pull with source: ${source}...`);
  
  let quote: Quote | null = null;

  if (source === 'zen') {
    quote = await fetchFromZenQuotes();
  } else if (source === 'advice') {
    quote = await fetchFromAdviceSlip();
  } else {
    // mixed
    const useZenQuotesFirst = Math.random() > 0.5;
    if (useZenQuotesFirst) {
      quote = await fetchFromZenQuotes();
      if (!quote) {
        console.log('🔄 ZenQuotes failed, trying AdviceSlip...');
        quote = await fetchFromAdviceSlip();
      }
    } else {
      quote = await fetchFromAdviceSlip();
      if (!quote) {
        console.log('🔄 AdviceSlip failed, trying ZenQuotes...');
        quote = await fetchFromZenQuotes();
      }
    }
  }

  if (!quote) {
    console.log('⚠️ Using fallback quote');
    quote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

  return quote;
}
