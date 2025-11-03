# Research Document API

A NestJS-based REST API for managing research documents with MongoDB integration. This API allows you to create, read, and organize research documents with structured content, key findings, sources, and categorization.

## Features

- 📄 **Research Document Management**: Create and retrieve research documents
- 🏷️ **Categorization & Tagging**: Organize documents by category and tags
- 📊 **Structured Content**: Support for sections, key findings, and sources
- 🔍 **Filtering**: Query documents by category or tags
- 🕒 **Timestamps**: Automatic creation and update timestamps
- 🏗️ **Built with NestJS**: Scalable and maintainable architecture

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Validation**: Built-in NestJS validation

## Prerequisites

- Node.js (>=20.0.0)
- npm (>=10.0.0)
- MongoDB (running locally on port 27017)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install
```

## Environment Setup

Make sure MongoDB is running locally on the default port (27017). The application connects to `mongodb://localhost:27017/nestjs-app`.

## Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod

# Build only
npm run build
```

The API will be available at `http://localhost:3000`.

## API Documentation

The API documentation is auto-generated using Swagger and available at:

**Swagger UI**: `http://localhost:3000/api`

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Health Check

**GET** `/`

Returns a simple hello message to verify the API is running.

**Response:**

```json
"Hello World!"
```

#### 2. Create Research Document

**POST** `/research-docs`

Creates a new research document.

**Request Body:**

```json
{
  "title": "Rust Performance Analysis",
  "content": "Detailed analysis of Rust's performance characteristics and benchmarks...",
  "sections": [
    {
      "heading": "Memory Safety",
      "content": "Rust's ownership system prevents common memory errors..."
    },
    {
      "heading": "Zero-Cost Abstractions",
      "content": "Rust provides high-level abstractions without runtime overhead..."
    }
  ],
  "keyFindings": [
    "Zero-cost abstractions",
    "Memory safety guarantees",
    "Excellent performance benchmarks"
  ],
  "sources": [
    {
      "title": "The Rust Programming Language Book",
      "url": "https://doc.rust-lang.org/book/"
    },
    {
      "title": "Rust Performance Book",
      "url": "https://nnethercote.github.io/perf-book/"
    }
  ],
  "category": "Rust",
  "tags": ["performance", "memory-safety", "systems-programming"]
}
```

**Response (201 Created):**

```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Rust Performance Analysis",
  "content": "Detailed analysis of Rust's performance characteristics and benchmarks...",
  "sections": [
    {
      "heading": "Memory Safety",
      "content": "Rust's ownership system prevents common memory errors..."
    }
  ],
  "keyFindings": [
    "Zero-cost abstractions",
    "Memory safety guarantees",
    "Excellent performance benchmarks"
  ],
  "sources": [
    {
      "title": "The Rust Programming Language Book",
      "url": "https://doc.rust-lang.org/book/"
    }
  ],
  "category": "Rust",
  "tags": ["performance", "memory-safety", "systems-programming"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### 3. Get All Research Documents

**GET** `/research-docs`

Retrieves all research documents with optional filtering.

**Query Parameters:**

- `category` (optional): Filter by category (e.g., `?category=Rust`)
- `tags` (optional): Filter by tags (comma-separated, e.g., `?tags=performance,memory-safety`)

**Examples:**

```
GET /research-docs
GET /research-docs?category=Rust
GET /research-docs?tags=performance,memory-safety
```

**Response (200 OK):**

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Rust Performance Analysis",
    "content": "Detailed analysis of Rust's performance characteristics...",
    "category": "Rust",
    "tags": ["performance", "memory-safety"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### 4. Get Research Document by ID

**GET** `/research-docs/:id`

Retrieves a specific research document by its ID.

**Path Parameters:**

- `id`: MongoDB ObjectId of the research document

**Example:**

```
GET /research-docs/64f1a2b3c4d5e6f7g8h9i0j1
```

**Response (200 OK):**

```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Rust Performance Analysis",
  "content": "Detailed analysis of Rust's performance characteristics and benchmarks...",
  "sections": [
    {
      "heading": "Memory Safety",
      "content": "Rust's ownership system prevents common memory errors..."
    }
  ],
  "keyFindings": ["Zero-cost abstractions", "Memory safety guarantees"],
  "sources": [
    {
      "title": "The Rust Programming Language Book",
      "url": "https://doc.rust-lang.org/book/"
    }
  ],
  "category": "Rust",
  "tags": ["performance", "memory-safety"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "statusCode": 404,
  "message": "Research document not found"
}
```

#### 5. Create Chat Message

**POST** `/chat-messages`

Creates a new chat message conversation.

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    },
    {
      "role": "assistant",
      "content": "I'm doing well, thank you!"
    }
  ],
  "userId": "user123",
  "conversationId": "conv456"
}
```

**Response (201 Created):**

```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    },
    {
      "role": "assistant",
      "content": "I'm doing well, thank you!"
    }
  ],
  "userId": "user123",
  "conversationId": "conv456",
  "createdAt": "2024-01-15T10:35:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

#### 6. Get All Chat Messages

**GET** `/chat-messages`

Retrieves all chat messages with optional filtering.

**Query Parameters:**

- `conversationId` (optional): Filter by conversation ID
- `userId` (optional): Filter by user ID

**Examples:**

```
GET /chat-messages
GET /chat-messages?conversationId=conv456
GET /chat-messages?userId=user123
```

**Response (200 OK):**

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "userId": "user123",
    "conversationId": "conv456",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

#### 7. Get Chat Message by ID

**GET** `/chat-messages/:id`

Retrieves a specific chat message by its ID.

**Path Parameters:**

- `id`: MongoDB ObjectId of the chat message

**Example:**

```
GET /chat-messages/64f1a2b3c4d5e6f7g8h9i0j2
```

**Response (200 OK):**

```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "userId": "user123",
  "conversationId": "conv456",
  "createdAt": "2024-01-15T10:35:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "statusCode": 404,
  "message": "Chat message not found"
}
```

## Data Models

### ResearchDoc Schema

| Field         | Type   | Required | Default | Description                                           |
| ------------- | ------ | -------- | ------- | ----------------------------------------------------- |
| `title`       | String | Yes      | -       | Document title                                        |
| `content`     | String | Yes      | -       | Main document content                                 |
| `sections`    | Array  | No       | -       | Array of section objects with `heading` and `content` |
| `keyFindings` | Array  | No       | -       | Array of key finding strings                          |
| `sources`     | Array  | No       | -       | Array of source objects with `title` and `url`        |
| `category`    | String | No       | "Rust"  | Document category                                     |
| `tags`        | Array  | No       | -       | Array of tag strings                                  |
| `createdAt`   | Date   | Auto     | -       | Creation timestamp                                    |
| `updatedAt`   | Date   | Auto     | -       | Last update timestamp                                 |

### ChatMessage Schema

| Field            | Type   | Required | Default | Description                                        |
| ---------------- | ------ | -------- | ------- | -------------------------------------------------- |
| `messages`       | Array  | Yes      | -       | Array of message objects with `role` and `content` |
| `userId`         | String | No       | -       | User identifier                                    |
| `conversationId` | String | No       | -       | Conversation identifier                            |
| `createdAt`      | Date   | Auto     | -       | Creation timestamp                                 |
| `updatedAt`      | Date   | Auto     | -       | Last update timestamp                              |

## Error Handling

The API uses standard HTTP status codes:

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Development

### Project Structure

```
src/
├── app.controller.ts      # Main API endpoints
├── app.service.ts         # Business logic
├── app.module.ts          # Application module configuration
├── main.ts               # Application bootstrap
└── schemas/
    └── research-doc.schema.ts  # MongoDB schema definition
```

### Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## Database

The application uses MongoDB with Mongoose ODM. The default connection string is:

```
mongodb://localhost:27017/nestjs-app
```

To use a different MongoDB instance, update the connection string in `src/app.module.ts`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
