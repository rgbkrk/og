// app/embed/route.ts
import { ImageResponse } from "next/server";
import CLIPPipelineSingleton from "./pipeline";

import { emojis } from "./emoji";

let emojiEmbeddings: Record<string, number[]> = {};

// Function to calculate cosine similarity
function cosineSimilarity(A: number[], B: number[]): number {
  if (A.length !== B.length) {
    throw new Error("A.length !== B.length");
  }
  let dotProduct = 0,
    mA = 0,
    mB = 0;
  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return dotProduct / (mA * mB);
}

async function precomputeEmojiEmbeddings(): Promise<void> {
  const clip = await CLIPPipelineSingleton.getInstance();
  for (const [emoji, description] of Object.entries(emojis)) {
    // const modifiedDescription = `${description} emoji`; // Append " emoji" to each description
    const modifiedDescription = `${description}`;
    // @ts-ignore
    const textInputs = clip.tokenizer([modifiedDescription], {
      padding: true,
      truncation: true,
    });
    const { text_embeds } = await clip.textModel(textInputs);
    emojiEmbeddings[emoji] = text_embeds.data;
  }
}

let isInitialized = false;

async function initializeOnce() {
  if (isInitialized) return;
  // Your initialization logic here, e.g., precomputeEmojiEmbeddings()
  await precomputeEmojiEmbeddings();
  isInitialized = true;
}

// Function to get the most relevant emoji based on text embedding
async function getRelevantEmoji(textEmbedding: number[]) {
  // Find the most similar emoji
  let maxSimilarity = -1;
  let mostSimilarEmoji = "";
  for (const [emoji, embedding] of Object.entries(emojiEmbeddings)) {
    const similarity = cosineSimilarity(embedding, textEmbedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarEmoji = emoji;
    }
  }
  return mostSimilarEmoji;
}

const SIMILARITY_THRESHOLD = 0.9; // Set the threshold as you see fit

// Function to get the two most relevant emojis based on text embedding
async function getRelevantEmojiPair(
  textEmbedding: number[],
): Promise<string[]> {
  type EmojiSimilarityPair = { emoji: string; similarity: number };

  const emojiSimilarities: EmojiSimilarityPair[] = [];

  for (const [emoji, embedding] of Object.entries(emojiEmbeddings)) {
    const similarity = cosineSimilarity(embedding, textEmbedding);
    if (similarity >= SIMILARITY_THRESHOLD) {
      emojiSimilarities.push({ emoji, similarity });
    }
  }

  // Sort by similarity in descending order and pick the top two
  const topTwoEmojis = emojiSimilarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 2)
    .map((pair) => pair.emoji);

  return topTwoEmojis;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let text = searchParams.get("text");

  console.log(text);

  await initializeOnce(); // Ensure initialization is done at least once

  if (!text) {
    text = "prompt me";
  }

  const clip = await CLIPPipelineSingleton.getInstance();
  // @ts-ignore
  const textInputs = clip.tokenizer([text], {
    padding: true,
    truncation: true,
  });
  const { text_embeds } = await clip.textModel(textInputs);

  const relevantEmojis = await getRelevantEmojiPair(text_embeds.data);

  // const relevantEmoji = await getRelevantEmoji(text_embeds.data);

  return new ImageResponse(
    (
      <div
        style={{
          color: "white",
          background: "#070707",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          border: "10px solid #373737",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 200,
          }}
        >
          {relevantEmojis.join(" ")}
        </div>
        <div
          style={{
            fontSize: 50,
            marginTop: 100,
          }}
        >
          {text.length > 40 ? text.slice(0, 32) + "..." : text}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
      // Default to 'twemoji'
      emoji: "twemoji",
    },
  );
}
