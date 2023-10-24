// app/embed/clipPipeline.ts
import {
  AutoProcessor,
  CLIPTextModelWithProjection,
  AutoTokenizer,
} from "@xenova/transformers";

type CLIPPipelineSingletonI = {
  instance: any;
  getInstance: () => Promise<any>;
};

const CLIP = () =>
  class CLIPPipelineSingleton {
    static instance: any = null;

    static async getInstance() {
      if (this.instance === null) {
        this.instance = {
          processor: await AutoProcessor.from_pretrained(
            "Xenova/clip-vit-base-patch16"
          ),
          textModel: await CLIPTextModelWithProjection.from_pretrained(
            "Xenova/clip-vit-base-patch16"
          ),
          tokenizer: await AutoTokenizer.from_pretrained(
            "Xenova/clip-vit-base-patch16"
          ),
        };
      }
      return this.instance;
    }
  };

let CLIPPipelineSingleton;
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
