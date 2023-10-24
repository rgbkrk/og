import Head from "next/head";

import { OGInput } from "@/components/oginput";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          property="og:image"
          content="https://og.lambdaops.com/clippify?text=lambda%20ops"
        />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-900">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-zinc-600 dark:text-zinc-300 py-8">
            Emoji Embeddings
            <span className="text-zinc-400 dark:text-zinc-700 text-xl px-4">
              (Top Two)
            </span>
          </h1>
          <OGInput />
        </div>
      </main>
    </>
  );
}
