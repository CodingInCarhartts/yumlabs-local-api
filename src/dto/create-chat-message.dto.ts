import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChatMessageDto {
  @ApiProperty({
    description: 'Array of messages in the conversation',
    type: [Object],
    example: [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ],
  })
  messages: { role: string; content?: string }[];

  @ApiPropertyOptional({
    description: 'User ID',
    example: 'user123',
  })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Conversation ID',
    example: 'conv456',
  })
  conversationId?: string;

  @ApiPropertyOptional({
    description: 'AI Provider',
    example: 'openai',
  })
  provider?: string;

  @ApiPropertyOptional({
    description: 'AI Model',
    example: 'gpt-4',
  })
  model?: string;
}
