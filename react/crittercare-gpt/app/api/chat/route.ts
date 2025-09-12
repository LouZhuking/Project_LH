import {
  embed,
  streamText
} from 'ai';
import {
  createOpenAI
} from '@ai-sdk/openai';
import {
  createClient
} from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
})

async function generateEmbedding(message: string) {
  return embed({
    model: openai.embedding('text-embedding-3-small'),
    value: message
  })
}

async function fetchRelevantContext(embedding: number[]) {
  try {
    const {
      data,
      error
    } = await supabase.rpc("match_chunks", {
      query_embedding: embedding,
      match_threshold: 0.78,
      match_count: 5
    })

    if (error) {
      console.error('Database query error:', error);
      return 'No relevant context information available';
    }

    console.log(data, '////////////////')

    if (!data || data.length === 0) {
      return 'No relevant context information available';
    }

    return data.map((item: any) => `
      Source: ${item.url || 'Unknown source'}
      Content: ${item.content}
    `).join('\n\n');
  } catch (err) {
    console.error('Failed to fetch context information:', err);
    return 'No relevant context information available';
  }
}

const createPrompt = (context: string, userQuestion: string) => {
  return {
    role: "system",
    content: `
     You are a professional pet care assistant. Please answer the user's questions based on the following context information.
      If the context information is insufficient to answer the question, please be honest about it and provide general pet care advice.
      
      ----------------
      START CONTEXT INFORMATION
      ${context}
      END CONTEXT INFORMATION
      ----------------
      
      Please respond in a concise and friendly manner, focusing on pet health and wellbeing.
      If the user's question is not related to pet care, please politely inform them that you can only answer pet-related questions.
      
      ----------------
      User Question: ${userQuestion}
      ----------------
    ` as const
  }
}


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No message content provided' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const latestMessage = messages[messages.length - 1]?.content || '';

    if (!latestMessage) {
      return new Response(
        JSON.stringify({ error: 'Message content is empty' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get vector embedding
    let context = 'No relevant context information available';
    try {
      const { embedding } = await generateEmbedding(latestMessage);
      context = await fetchRelevantContext(embedding);
    } catch (embeddingError) {
      console.error('Vector processing failed:', embeddingError);
      // Continue processing with default context
    }

    const prompt = createPrompt(context, latestMessage);

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [prompt, ...messages],
      maxTokens: 1000,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}