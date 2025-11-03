import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResearchDocDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Rust Performance Analysis',
  })
  title: string;

  @ApiProperty({
    description: 'Main document content',
    example:
      "Detailed analysis of Rust's performance characteristics and benchmarks...",
  })
  content: string;

  @ApiPropertyOptional({
    description: 'Array of section objects',
    type: [Object],
    example: [
      {
        heading: 'Memory Safety',
        content: "Rust's ownership system prevents common memory errors...",
      },
    ],
  })
  sections?: { heading: string; content: string }[];

  @ApiPropertyOptional({
    description: 'Array of key finding strings',
    type: [String],
    example: ['Zero-cost abstractions', 'Memory safety guarantees'],
  })
  keyFindings?: string[];

  @ApiPropertyOptional({
    description: 'Array of source objects',
    type: [Object],
    example: [
      {
        title: 'The Rust Programming Language Book',
        url: 'https://doc.rust-lang.org/book/',
      },
    ],
  })
  sources?: { title: string; url: string }[];

  @ApiPropertyOptional({
    description: 'Document category',
    example: 'Rust',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Array of tag strings',
    type: [String],
    example: ['performance', 'memory-safety', 'systems-programming'],
  })
  tags?: string[];
}
