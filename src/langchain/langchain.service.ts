import { Injectable } from "@nestjs/common";
import { ChatOpenAI } from '@langchain/openai';

/**
 * Service for interacting with OpenAI's language model to perform tasks such as 
 * generating responses to prompts and enhancing product descriptions.
 *
 * @class LangChainService
 * @property {ChatOpenAI} model - The OpenAI model instance for generating responses.
 */
@Injectable()
export class LangChainService {
    private model: ChatOpenAI;

    constructor() {
        this.model = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
    }

    /**
     * Enhances the description of a product based on the provided information.
     * @param {string} name
     * @param {string} description 
     * @returns {Promise<string>}
     */
    async enhanceDescription(name: string, description: string): Promise<string> {
        const prompt = `
        You are an expert in medical sales. Your specialty is medical consumables used by hospitals on a daily basis. Your task to enhance the description of a product based on the information provided.
  
        Product name: ${name}
        Product description: ${description}
  
        New Description:
      `;
        return (await this.model.invoke(prompt)).content as string;
    }
}