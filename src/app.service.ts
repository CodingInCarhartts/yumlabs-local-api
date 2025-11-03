import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import {
  ResearchDoc,
  ResearchDocDocument,
} from './schemas/research-doc.schema';
import {
  ChatMessage,
  ChatMessageDocument,
} from './schemas/chat-message.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(ResearchDoc.name)
    private researchDocModel: Model<ResearchDocDocument>,
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createResearchDoc(
    title: string,
    content: string,
    sections?: { heading: string; content: string }[],
    keyFindings?: string[],
    sources?: { title: string; url: string }[],
    category?: string,
    tags?: string[],
  ): Promise<ResearchDoc> {
    const createdDoc = new this.researchDocModel({
      title,
      content,
      sections,
      key_findings: keyFindings,
      sources,
      category,
      tags,
    });
    return createdDoc.save();
  }

  async findAllResearchDocs(): Promise<ResearchDoc[]> {
    return this.researchDocModel.find().exec();
  }

  async findResearchDocById(id: string): Promise<ResearchDoc> {
    return this.researchDocModel.findById(id).exec();
  }

  async findResearchDocsByCategory(category: string): Promise<ResearchDoc[]> {
    return this.researchDocModel.find({ category }).exec();
  }

  async findResearchDocsByTags(tags: string[]): Promise<ResearchDoc[]> {
    return this.researchDocModel.find({ tags: { $in: tags } }).exec();
  }

  async createChatMessage(
    messages: { role: string; content?: string }[],
    userId?: string,
    conversationId?: string,
    provider?: string,
    model?: string,
  ): Promise<ChatMessage> {
    const createdMessage = new this.chatMessageModel({
      messages,
      userId,
      conversationId,
      provider,
      model,
    });
    return createdMessage.save();
  }

  async findAllChatMessages(): Promise<ChatMessage[]> {
    return this.chatMessageModel.find().exec();
  }

  async findChatMessageById(id: string): Promise<ChatMessage> {
    return this.chatMessageModel.findById(id).exec();
  }

  async findChatMessagesByConversationId(
    conversationId: string,
  ): Promise<ChatMessage[]> {
    return this.chatMessageModel.find({ conversationId }).exec();
  }

  async findChatMessagesByUserId(userId: string): Promise<ChatMessage[]> {
    return this.chatMessageModel.find({ userId }).exec();
  }

  async proxyToChat(body: {
    messages: { role: string; content: string }[];
    systemPrompt: string;
    model: string;
    maxTokens: number;
    temperature: number;
    provider?: string;
  }) {
    const provider = body.provider || 'minimax';

    if (provider === 'perplexity') {
      return this.proxyToPerplexityChat(body);
    } else if (provider === 'google') {
      return this.proxyToGoogleChat(body);
    } else {
      return this.proxyToMinimaxChat(body);
    }
  }

  private async proxyToGoogleChat(body: {
    messages: { role: string; content: string }[];
    systemPrompt: string;
    model: string;
    maxTokens: number;
    temperature: number;
  }) {
    try {
      const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GOOGLE_API_KEY (or GEMINI_API_KEY) environment variable is not set');
      }

      // Only allow Gemini text models for chat
      if (!body.model || !body.model.startsWith('gemini-')) {
        throw new HttpException(
          `Unsupported Google model for chat: ${body.model}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(body.model)}:generateContent`);
      url.searchParams.set('key', apiKey);

      const contents = body.messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content ?? '' }],
      }));

      const payload: any = {
        contents,
        generationConfig: {
          temperature: body.temperature,
          maxOutputTokens: body.maxTokens,
        },
      };

      if (body.systemPrompt) {
        payload.systemInstruction = {
          role: 'system',
          parts: [{ text: body.systemPrompt }],
        };
      }

      const resp = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Google API error: ${resp.status} ${errorText}`);
      }

      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('') || '';

      return { reasoning: '', content: text };
    } catch (error) {
      console.error('Google chat proxy error:', error);
      throw new HttpException(
        `Google API Error: ${error instanceof Error ? error.message : String(error)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async proxyToPerplexityChat(body: {
    messages: { role: string; content: string }[];
    systemPrompt: string;
    model: string;
    maxTokens: number;
    temperature: number;
  }) {
    try {
      const apiKey = process.env.PERPLEXITY_API_KEY;
      
      if (!apiKey) {
        throw new Error('PERPLEXITY_API_KEY environment variable is not set');
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: body.model,
          messages: [
            { role: 'system', content: body.systemPrompt },
            ...body.messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          max_tokens: body.maxTokens,
          temperature: body.temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Perplexity API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      return { reasoning: '', content };
    } catch (error) {
      console.error('Perplexity chat proxy error:', error);
      throw new HttpException(
        `Perplexity API Error: ${error instanceof Error ? error.message : String(error)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async proxyToMinimaxChat(body: {
    messages: { role: string; content: string }[];
    systemPrompt: string;
    model: string;
    maxTokens: number;
    temperature: number;
  }) {
    try {
      const apiKey = process.env.MINIMAX_API_KEY;
      
      if (!apiKey) {
        throw new Error('MINIMAX_API_KEY environment variable is not set');
      }
      
      const client = new Anthropic({
        baseURL: 'https://api.minimax.io/anthropic',
        apiKey,
        dangerouslyAllowBrowser: true
      });

      const response = await client.messages.create({
        model: 'MiniMax-M2',
        max_tokens: body.maxTokens,
        system: body.systemPrompt,
        messages: body.messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: [{ type: 'text', text: msg.content }]
        })),
        temperature: body.temperature
      });

      let reasoning = '';
      let content = '';

      for (const block of response.content) {
        if (block.type === 'thinking' && 'thinking' in block) {
          reasoning += (block as any).thinking;
        } else if (block.type === 'text' && 'text' in block) {
          content += (block as any).text;
        }
      }

      return { reasoning, content };
    } catch (error) {
      console.error('Chat proxy error:', error);
      throw new HttpException(
        `Minimax API Error: ${error instanceof Error ? error.message : String(error)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async performDeepResearch(topics: string[], saveToFile: boolean): Promise<any> {
    try {
      const apiKey = process.env.MINIMAX_API_KEY;
      
      if (!apiKey) {
        throw new Error('MINIMAX_API_KEY environment variable is not set');
      }
      
      const client = new Anthropic({
        baseURL: 'https://api.minimax.io/anthropic',
        apiKey,
      });

      const systemPrompt = `You are a deep research assistant. For the given topic, conduct comprehensive research and provide a structured markdown document with the following sections:
# Introduction
# Key Findings
# Detailed Analysis
# Sources and References
# Conclusion

Ensure the response includes ALL sections above. Provide well-researched, factual, and insightful content. Use bullet points and subheadings for clarity. Do not include any internal tags, XML, or non-markdown formatting.`;

      const results: string[] = [];

      for (const topic of topics) {
        const response = await client.messages.create({
          model: 'MiniMax-M2',
          max_tokens: 4000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: [{ type: 'text', text: `Research the topic: ${topic}` }]
            }
          ],
          temperature: 1.0
        });

        let content = '';
        for (const block of response.content) {
          if (block.type === 'text') {
            content += block.text;
          }
        }

        if (content) {
          // Parse sections
          const lines = content.split('\n');
          let title = topic;
          let introduction = '';
          const keyFindings: string[] = [];
          let detailedAnalysis = '';
          const sources: { title: string; url: string }[] = [];
          let conclusion = '';
          let currentSection = '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('## Introduction') || trimmed.startsWith('# Introduction')) {
              currentSection = 'introduction';
              continue;
            } else if (trimmed.startsWith('## Key Findings') || trimmed.startsWith('# Key Findings')) {
              currentSection = 'key_findings';
              continue;
            } else if (trimmed.startsWith('## Detailed Analysis') || trimmed.startsWith('# Detailed Analysis')) {
              currentSection = 'detailed_analysis';
              continue;
            } else if (trimmed.startsWith('## Sources and References') || trimmed.startsWith('# Sources and References')) {
              currentSection = 'sources';
              continue;
            } else if (trimmed.startsWith('## Conclusion') || trimmed.startsWith('# Conclusion')) {
              currentSection = 'conclusion';
              continue;
            }
            
            // Skip other section headers and subsections
            if (trimmed.startsWith('#')) {
              continue;
            }
            
            if (trimmed) {
              if (currentSection === 'introduction') {
                introduction += line + '\n';
              } else if (currentSection === 'key_findings') {
                // Capture bullet points and sub-items
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                  keyFindings.push(trimmed.slice(1).trim());
                }
              } else if (currentSection === 'detailed_analysis') {
                detailedAnalysis += line + '\n';
              } else if (currentSection === 'sources') {
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                  const cleaned = trimmed.slice(1).trim();
                  sources.push({ title: cleaned, url: '' });
                }
              } else if (currentSection === 'conclusion') {
                conclusion += line + '\n';
              }
            }
          }

          const data = {
            title,
            content,
            sections: [
              { heading: 'Introduction', content: introduction.trim() },
              { heading: 'Detailed Analysis', content: detailedAnalysis.trim() },
              { heading: 'Conclusion', content: conclusion.trim() },
            ],
            key_findings: keyFindings,
            sources,
            category: 'Research',
            tags: []
          };

          // Save to database
          await this.createResearchDoc(
            data.title,
            data.content,
            data.sections,
            data.key_findings,
            data.sources,
            data.category,
            data.tags
          );

          results.push(`## Research on: ${topic}\n\n${content}`);
        } else {
          results.push(`## Research on: ${topic}\n\nNo content generated.`);
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return { content: results.join('\n\n'), saveToFile };
    } catch (error) {
      console.error('Deep research error:', error);
      throw new HttpException(
        `Deep Research Error: ${error instanceof Error ? error.message : String(error)}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
