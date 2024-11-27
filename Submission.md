# Exam Submission & Evaluation Documentation

## Overview

Documentation for the ProctorPlus exam submission and evaluation system, including data structures, API endpoints, and evaluation criteria.

## Data Structure

```typescript
{
  // Basic user info
  userId: string,  // User's email
  domain: string,  // "design" | "coding" | "marketing"

  // Answer sections
  answers: {
    // MCQ section - 12 questions
    mcqs: Array<{
      questionId: string,  // e.g., "coding-mcq-0"
      answer: string,      // Selected option
      type: "mcq"
    }>,

    // Descriptive section - 2 questions
    descriptive: Array<{
      questionId: string,  // e.g., "coding-desc-1"
      answer: string,      // Long-form text
      type: "descriptive"
    }>,

    // Domain-specific challenges
    domainSpecific: {
      // Coding Domain
      dsaAnswer?: {
        code: string,
        language: "javascript" | "python" | "java",
        questionId: string  // e.g., "coding-dsa-1"
      },

      // Design Domain
      designFile?: {
        description: string,
        questionId: string,  // e.g., "design-design-1"
        // File handled separately in FormData
      },

      // Marketing Domain
      videoFile?: {
        description: string,
        questionId: string,  // e.g., "marketing-marketing-1"
        // File handled separately in FormData
      }
    }
  },

  // Security data
  behaviorAnalysis: {
    isLikelyBot: boolean,
    confidence: number,      // 0 to 1
    reasons: string[],       // Any suspicious patterns
    keyTiming: number[],     // Time between keystrokes
    specialKeyCount: number, // Special key usage
    typingSpeed: number[],   // Characters per minute
    backspaceCount: number,  // Error corrections
    totalKeyPresses: number  // Total key events
  }
}
```

## Evaluation System

### API Endpoints

```http
# Submit Exam
POST /api/exam/submit/
Content-Type: application/json
Authorization: Bearer <token>

# Get Evaluation
GET /api/exam/evaluate/{submission_id}/
Authorization: Bearer <token>

# payload is like tese
Key: examData
Value: {"domain":"design","answers":{"mcqs":[],"descriptive":[...],"domainSpecific":{}},"behaviorAnalysis":{...}}

# Response Format
{
    "status": "success",
    "data": {
        "score": number,        // 0-100
        "status": string,       // "passed" | "failed"
        "breakdown": {
            "mcq_score": number,
            "descriptive_score": number,
            "domain_score": number
        },
        "feedback": string[]    // Detailed feedback points
    }
}
```

### Passing Criteria

- Minimum passing score: 60%
- No suspicious behavior detected
- All sections attempted

### Error Handling

- Invalid submissions return 400
- Unauthorized access returns 401
- Not found returns 404
- Server errors return 500
- Detailed error messages in response

## Security Notes

- JWT authentication required
- Behavior analysis enforced
- Rate limiting applied
- User-specific access control

## Database Schema

```sql
ExamSubmission
- id (PK)
- user_id (FK)
- domain
- created_at
- updated_at

MCQAnswer
- submission_id (FK)
- question_id
- answer

DescriptiveAnswer
- submission_id (FK)
- question_id
- answer

DomainSpecificAnswer
- submission_id (FK)
- code/description
- file_url
- question_id

BehaviorAnalysis
- submission_id (FK)
- metrics...
```

## Development Notes

- Built with Django + DRF
- PostgreSQL database
- JWT authentication
- Service Layer pattern
