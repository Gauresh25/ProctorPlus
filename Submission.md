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

### Architecture

The evaluation system follows a Service Layer pattern, separating business logic from HTTP handling:

- `ExamEvaluationService`: Core evaluation logic
- `views.py`: API endpoints
- `models.py`: Data persistence
- `services.py`: Business logic

### Scoring Breakdown

Total score: 100 points

1. MCQ Section (60 points)

   - 12 questions × 5 points each
   - Binary scoring (correct/incorrect)

2. Descriptive Section (30 points)

   - 2 questions × 15 points each
   - Evaluated on:
     - Length (5 points)
     - Keyword usage (10 points)
     - Content relevance

3. Domain-Specific Section (30 points)
   - Coding:
     - Code structure (10 points)
     - Implementation (10 points)
     - Documentation (10 points)
   - Design:
     - UX principles (7.5 points × 4 criteria)
   - Marketing:
     - Strategy components (7.5 points × 4 criteria)

### Evaluation Criteria

#### MCQ Evaluation

- Direct comparison with correct answers
- No partial credit
- Automated scoring

#### Descriptive Evaluation

- Minimum word count: 50 words
- Keyword matching from predefined sets
- 2 points per matched keyword (max 10 points)
- Length-based scoring (5 points if meets minimum)

#### Domain-Specific Evaluation

1. Coding Submissions:

   ```python
   Criteria:
   - Code length (min 5 lines)
   - Function structure
   - Return statements
   - Documentation/comments
   - Error handling
   ```

2. Design Submissions:

   ```python
   Keywords:
   - Layout
   - User experience
   - Responsive design
   - Accessibility
   ```

3. Marketing Submissions:
   ```python
   Keywords:
   - Target audience
   - Strategy
   - ROI metrics
   - Engagement
   ```

### Behavior Analysis

- Bot detection threshold: 0.7 confidence
- Automatic failure if suspicious behavior detected
- Factors considered:
  - Typing patterns
  - Response timing
  - Error correction rates

### API Endpoints

```http
# Submit Exam
POST /api/exam/submit/
Content-Type: application/json
Authorization: Bearer <token>

# Get Evaluation
GET /api/exam/evaluate/{submission_id}/
Authorization: Bearer <token>

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
