# Exam Submission Data Structure Documentation

## Overview

Documentation for the ProctorPlus exam submission data structure, including MCQs, descriptive answers, domain-specific challenges, and security analytics.

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

## Sample Submission

```javascript
{
  userId: "student@example.com",
  domain: "coding",
  answers: {
    mcqs: [
      { questionId: "coding-mcq-0", answer: "Option A", type: "mcq" },
      // ... more MCQs
    ],
    descriptive: [
      {
        questionId: "coding-desc-1",
        answer: "Time complexity refers to...",
        type: "descriptive"
      }
    ],
    domainSpecific: {
      dsaAnswer: {
        code: "function binarySearch(arr, target) {...}",
        language: "javascript",
        questionId: "coding-dsa-1"
      }
    }
  },
  behaviorAnalysis: {
    isLikelyBot: false,
    confidence: 0.1,
    reasons: [],
    keyTiming: [120, 150, 180],
    specialKeyCount: 3,
    typingSpeed: [45, 50, 48],
    backspaceCount: 5,
    totalKeyPresses: 234
  }
}
```

## File Upload Handling

- Design files (images) and marketing files (videos) are sent via FormData
- File paths will be stored in the database after server-side processing
- Files are validated for type and size before upload

## Security Notes

- Keystroke analytics collected during descriptive answers and coding
- Behavior analysis helps detect automated submissions
- Files scanned for malware before storage
- All submissions require valid JWT token

## Database Considerations

- Consider storing large text fields (code, descriptions) with TEXT type
- File paths stored as strings, actual files in file system
- Behavior analysis can be stored as JSONB for flexibility
- Timestamps added automatically for submission tracking

## API Endpoints

```
POST /api/exam/submit
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- examData: JSON string of the submission data
- designFile?: File (image)
- videoFile?: File (video)
```
