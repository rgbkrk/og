import { pipeline } from "@xenova/transformers";

type PipelineSingletonI = {
  task: string;
  model: string;
  instance: any;
  getInstance: (progress_callback?: any) => Promise<any>;
};

// Use the Singleton pattern to enable lazy construction of the pipeline.
// NOTE: We wrap the class in a function to prevent code duplication (see below).
const P = () =>
  class PipelineSingleton {
    static task = "text-classification";
    static model = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
    static instance: any = null;

    static async getInstance(progress_callback = null) {
      if (this.instance === null) {
        this.instance = pipeline(this.task, this.model, {
          // @ts-ignore
          progress_callback: progress_callback,
        });
      }
      return this.instance;
    }
  };

let PipelineSingleton;
if (process.env.NODE_ENV !== "production") {
  // When running in development mode, attach the pipeline to the
  // global object so that it's preserved between hot reloads.
  // For more information, see https://vercel.com/guides/nextjs-prisma-postgres
  // @ts-ignore
  if (!global.PipelineSingleton) {
    // @ts-ignore
    global.PipelineSingleton = P();
  }
  // @ts-ignore
  PipelineSingleton = global.PipelineSingleton;
} else {
  PipelineSingleton = P();
}

export default PipelineSingleton as PipelineSingletonI;
