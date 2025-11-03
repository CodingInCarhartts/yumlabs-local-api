# API Reference

This document provides a comprehensive overview of the Research Document API for LLMs to understand and interact with.

## Base URL

```
http://localhost:3000
```

## Authentication

None required for current endpoints.

## Endpoints

### 1. Health Check

- **Method**: GET
- **Path**: /
- **Description**: Simple health check to verify API is running
- **Response**: `200 OK`
  ```json
  "Hello World!"
  ```

### 2. Create Research Document

- **Method**: POST
- **Path**: /research-docs
- **Description**: Creates a new research document
- **Request Body**:
  ```json
  {
    "title": "string (required)",
    "content": "string (required)",
    "sections": [{"heading": "string", "content": "string"}] (optional),
    "keyFindings": ["string"] (optional),
    "sources": [{"title": "string", "url": "string"}] (optional),
    "category": "string (optional, default: 'Rust')",
    "tags": ["string"] (optional)
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "_id": "ObjectId",
    "title": "string",
    "content": "string",
    "sections": [...],
    "keyFindings": [...],
    "sources": [...],
    "category": "string",
    "tags": [...],
    "createdAt": "Date",
    "updatedAt": "Date"
  }
  ```

### 3. Get All Research Documents

- **Method**: GET
- **Path**: /research-docs
- **Description**: Retrieves all research documents with optional filtering
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `tags` (optional): Comma-separated tags
- **Response**: `200 OK`
  ```json
  [
    {
      "_id": "ObjectId",
      "title": "string",
      "content": "string",
      "category": "string",
      "tags": [...],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
  ```

### 4. Get Research Document by ID

- **Method**: GET
- **Path**: /research-docs/:id
- **Description**: Retrieves a specific research document
- **Path Parameters**:
  - `id`: MongoDB ObjectId
- **Response**: `200 OK` or `404 Not Found`

### 5. Create Chat Message

- **Method**: POST
- **Path**: /chat-messages
- **Description**: Creates a new chat message conversation
- **Request Body**:
  ```json
  {
    "messages": [{"role": "user|assistant", "content": "string"}] (required),
    "userId": "string (optional)",
    "conversationId": "string (optional)"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "_id": "ObjectId",
    "messages": [...],
    "userId": "string",
    "conversationId": "string",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
  ```

### 6. Get All Chat Messages

- **Method**: GET
- **Path**: /chat-messages
- **Description**: Retrieves all chat messages with optional filtering
- **Query Parameters**:
  - `conversationId` (optional): Filter by conversation ID
  - `userId` (optional): Filter by user ID
- **Response**: `200 OK`
  ```json
  [
    {
      "_id": "ObjectId",
      "messages": [...],
      "userId": "string",
      "conversationId": "string",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
  ```

### 7. Get Chat Message by ID

- **Method**: GET
- **Path**: /chat-messages/:id
- **Description**: Retrieves a specific chat message
- **Path Parameters**:
  - `id`: MongoDB ObjectId
- **Response**: `200 OK` or `404 Not Found`

## Data Schemas

### ResearchDoc

- `title`: String (required)
- `content`: String (required)
- `sections`: Array of {heading: String, content: String} (optional)
- `keyFindings`: Array of String (optional)
- `sources`: Array of {title: String, url: String} (optional)
- `category`: String (optional, default: 'Rust')
- `tags`: Array of String (optional)
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

### ChatMessage

- `messages`: Array of {role: String ('user'|'assistant'), content: String} (required)
- `userId`: String (optional)
- `conversationId`: String (optional)
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

## Error Responses

- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Additional Notes

- All timestamps are in ISO 8601 format
- MongoDB ObjectIds are 24-character hexadecimal strings
- Swagger documentation available at `/api`
