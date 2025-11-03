import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ResearchDoc } from './schemas/research-doc.schema';
import { ChatMessage } from './schemas/chat-message.schema';
import { CreateResearchDocDto } from './dto/create-research-doc.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Returns a hello message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('research-docs')
  @ApiOperation({ summary: 'Create a new research document' })
  @ApiResponse({
    status: 201,
    description: 'Document created successfully',
    type: ResearchDoc,
  })
  async createResearchDoc(
    @Body() body: CreateResearchDocDto,
  ): Promise<ResearchDoc> {
    return this.appService.createResearchDoc(
      body.title,
      body.content,
      body.sections,
      body.keyFindings,
      body.sources,
      body.category,
      body.tags,
    );
  }

  @Get('research-docs')
  @ApiOperation({ summary: 'Get all research documents' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    description: 'Filter by tags (comma-separated)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of research documents',
    type: [ResearchDoc],
  })
  async getAllResearchDocs(
    @Query('category') category?: string,
    @Query('tags') tags?: string,
  ): Promise<ResearchDoc[]> {
    if (category) {
      return this.appService.findResearchDocsByCategory(category);
    }
    if (tags) {
      const tagsArray = tags.split(',');
      return this.appService.findResearchDocsByTags(tagsArray);
    }
    return this.appService.findAllResearchDocs();
  }

  @Get('research-docs/:id')
  @ApiOperation({ summary: 'Get research document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Research document found',
    type: ResearchDoc,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getResearchDocById(@Param('id') id: string): Promise<ResearchDoc> {
    return this.appService.findResearchDocById(id);
  }

  @Post('chat-messages')
  @ApiOperation({ summary: 'Create a new chat message' })
  @ApiResponse({
    status: 201,
    description: 'Chat message created successfully',
    type: ChatMessage,
  })
  async createChatMessage(
    @Body() body: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    return this.appService.createChatMessage(
      body.messages as { role: string; content?: string }[],
      body.userId,
      body.conversationId,
      body.provider,
      body.model,
    );
  }

  @Get('chat-messages')
  @ApiOperation({ summary: 'Get all chat messages' })
  @ApiQuery({
    name: 'conversationId',
    required: false,
    description: 'Filter by conversation ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of chat messages',
    type: [ChatMessage],
  })
  async getAllChatMessages(
    @Query('conversationId') conversationId?: string,
    @Query('userId') userId?: string,
  ): Promise<ChatMessage[]> {
    if (conversationId) {
      return this.appService.findChatMessagesByConversationId(conversationId);
    }
    if (userId) {
      return this.appService.findChatMessagesByUserId(userId);
    }
    return this.appService.findAllChatMessages();
  }

  @Get('chat-messages/:id')
  @ApiOperation({ summary: 'Get chat message by ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat message found',
    type: ChatMessage,
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async getChatMessageById(@Param('id') id: string): Promise<ChatMessage> {
    return this.appService.findChatMessageById(id);
  }

  @Post('api/chat')
  @ApiOperation({ summary: 'Chat proxy to AI providers' })
  @ApiResponse({ status: 200, description: 'Chat response from AI' })
  async chat(
    @Body() body: {
      messages: { role: string; content: string }[];
      systemPrompt: string;
      model: string;
      maxTokens: number;
      temperature: number;
      provider?: string;
    },
  ) {
    return this.appService.proxyToChat(body);
  }

  @Post('api/deep-research')
  @ApiOperation({ summary: 'Deep research proxy' })
  @ApiResponse({ status: 200, description: 'Research results' })
  async deepResearch(
    @Body() body: {
      topics: string[];
      saveToFile: boolean;
    },
  ) {
    return this.appService.performDeepResearch(body.topics, body.saveToFile);
  }
}
