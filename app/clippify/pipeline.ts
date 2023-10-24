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
    static instance = null;

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
  if (!global.CLIPPipelineSingleton) {
    global.CLIPPipelineSingleton = CLIP();
  }
  CLIPPipelineSingleton = global.CLIPPipelineSingleton;
} else {
  CLIPPipelineSingleton = CLIP();
}

export default CLIPPipelineSingleton as CLIPPipelineSingletonI;
