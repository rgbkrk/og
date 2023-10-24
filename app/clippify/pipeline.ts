import {
  AutoProcessor,
  AutoTokenizer,
  CLIPTextModelWithProjection,
} from "@xenova/transformers";

interface CLIPInstance {
  processor: AutoProcessor;
  textModel: CLIPTextModelWithProjection;
  tokenizer: AutoTokenizer;
}

export type CLIPPipelineSingletonI = {
  instance: CLIPInstance | null;
  getInstance: () => Promise<CLIPInstance>;
};

function CLIP() {
  class CLIPPipelineSingleton {
    static instance: CLIPInstance | null = null;

    static async getInstance(): Promise<CLIPInstance> {
      if (this.instance === null) {
        this.instance = {
          processor: await AutoProcessor.from_pretrained(
            "Xenova/clip-vit-base-patch16",
          ),
          textModel: await CLIPTextModelWithProjection.from_pretrained(
            "Xenova/clip-vit-base-patch16",
          ),
          tokenizer: await AutoTokenizer.from_pretrained(
            "Xenova/clip-vit-base-patch16",
          ),
        };
      }
      return this.instance;
    }
  }
  return CLIPPipelineSingleton;
}

let CLIPPipelineSingleton: ReturnType<typeof CLIP>;
if (process.env.NODE_ENV !== "production") {
  const globalAny: any = global;
  if (!globalAny.CLIPPipelineSingleton) {
    globalAny.CLIPPipelineSingleton = CLIP();
  }
  CLIPPipelineSingleton = globalAny.CLIPPipelineSingleton;
} else {
  CLIPPipelineSingleton = CLIP();
}

export default CLIPPipelineSingleton as CLIPPipelineSingletonI;
