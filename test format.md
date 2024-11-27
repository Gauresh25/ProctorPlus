I'll help you design the domain model and flow for different types of test questions in your exam platform.

Let me break down the three question types and their flows:

1. **MCQ Questions Flow**:

```python
# Example MCQ structure
mcq_question = {
    "question_text": "Which marketing strategy is most effective for B2B SaaS?",
    "options": [
        "Social media influencer marketing",
        "Content marketing and thought leadership",
        "TV advertisements",
        "Billboard advertising"
    ],
    "correct_option": 1,
    "points": 10,
    "explanation": "Content marketing establishes authority and addresses specific business pain points"
}

# Flow:
1. Student sees question and multiple options
2. Selects one option
3. System immediately validates against correct_option
4. Stores response and score
5. Shows explanation after submission
```

2. **Coding Questions Flow**:

```python
# Example Coding Question structure
coding_question = {
    "question_text": "Write a function to find the maximum element in an array",
    "initial_code": "def find_max(arr):\n    # Your code here\n    pass",
    "test_cases": [
        {"input": [1, 2, 3, 4, 5], "output": 5},
        {"input": [-1, -5, 0, -2], "output": 0}
    ],
    "language": "python",
    "time_limit_seconds": 2,
    "memory_limit_mb": 128,
    "points": 20
}

# Flow:
1. Student sees problem statement and initial code
2. Can write/edit code in browser-based IDE
3. Can run code against sample test cases
4. System evaluates submission against all test cases
5. Checks for time/memory limits
6. Provides feedback on failed test cases
```

3. **Marketing Questions Flow**:

```python
# Example Marketing Question structure
marketing_question = {
    "question_text": "Develop a go-to-market strategy for a new fitness app",
    "scenario": "Your fitness app helps users track workouts and nutrition...",
    "constraints": {
        "budget": "$50,000",
        "timeline": "3 months",
        "target_market": "Young professionals in urban areas"
    },
    "evaluation_criteria": {
        "market_analysis": 25,
        "channel_strategy": 25,
        "budget_allocation": 25,
        "success_metrics": 25
    },
    "points": 30
}

# Flow:
1. Student reads scenario and constraints
2. Provides structured response addressing criteria
3. Manual evaluation by teachers/graders
4. Feedback provided with rubric scores
5. Can include file attachments (e.g., presentations)
```

Implementation Recommendations:

1. **Front-end Components**:

```typescript
- QuestionRenderer: Switch component to render appropriate question type
- MCQComponent: Radio buttons + validation
- CodingComponent: Monaco Editor integration
- MarketingComponent: Rich text editor + file upload
```

2. **API Endpoints**:

```
POST /api/exam-sessions/{session_id}/questions/{question_id}/submit
- Different validation logic per question type
- Returns immediate results for MCQ/Coding
- Queues Marketing questions for review
```

3. **Evaluation System**:

```python
- MCQ: Simple correct/incorrect check
- Coding: Containerized test runner (e.g., Docker)
- Marketing: Teacher dashboard with rubric scoring
```

Would you like me to dive deeper into any of these aspects or help implement a specific component?
