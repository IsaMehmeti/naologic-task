/**
 * Service for interacting with OpenAI's language model to perform tasks such as 
 * generating responses to prompts and enhancing product descriptions.
 *
 * This service initializes an instance of the OpenAI model using the ChatOpenAI
 * package and provides methods to interact with the model. It is designed to be
 * used within a NestJS application and marked as injectable.
 *
 * @class LangChainService
 * @decorator Injectable - Marks the class as a service that can be injected.
 *
 * @property {ChatOpenAI} model - The OpenAI model instance for generating responses.
 */
import { Injectable } from "@nestjs/common";
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class LangChainService {
    private model: ChatOpenAI;

    constructor() {
        this.model = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
    }

    /**
     * Enhances the description of a product based on the provided information.
     * @param {string} name - The name of the product.
     * @param {string} description - The description of the product.
     * @returns {Promise<string>} - The enhanced description from the OpenAI model.
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