# KeystrokeAnalytics Component Documentation

## Overview

The KeystrokeAnalytics component is a behavior monitoring system designed to detect automated/bot-like user interactions. It analyzes keyboard patterns, mouse movements, copy-paste actions, and tab switching behaviors.

## Installation

Place the `KeystrokeAnalytics.jsx` component in your project's components directory.

## Basic Usage

```jsx
import { useRef } from "react";
import KeystrokeAnalytics from "./components/KeystrokeAnalytics";

function ExamForm() {
  const analyticsRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const behaviorAnalysis = analyticsRef.current.getCurrentAnalysis();

    // Include analysis with your form submission
    const submissionData = {
      // ... your form data
      behaviorAnalysis,
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="answer" />
      <KeystrokeAnalytics ref={analyticsRef} sensitivity={0.5} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Props

- `sensitivity` (optional): Number between 0 and 1 controlling detection threshold (default: 0.5)
  - Lower values = more lenient
  - Higher values = stricter detection

## Analysis Data Structure

```typescript
{
  isLikelyBot: boolean,
  risk: number,          // 0 to 1
  confidence: number,    // 0 to 1
  patterns: string[],    // Array of detected suspicious patterns
  metrics: {
    keyboardMetrics: {
      risk: number,
      patterns: string[]
    },
    mouseMetrics: {
      risk: number,
      patterns: string[]
    },
    copyPasteMetrics: {
      risk: number,
      patterns: string[]
    },
    tabSwitches: number,
    totalMouseDistance: number,
    copyPasteCount: number,
    totalKeyPresses: number
  }
}
```

## Detected Behaviors

1. Keyboard Patterns

   - Consistent typing rhythm
   - Superhuman typing speed
   - Low error correction rate

2. Mouse Patterns

   - Linear movements
   - Consistent speed
   - Unnatural trajectories

3. Copy-Paste Behavior

   - Frequency of usage
   - Rapid consecutive pastes

4. Tab Switching
   - Frequency of switches
   - Pattern of switches

## Integration with Backend

```javascript
// Example submission to backend
async function submitForm(formData, analysis) {
  const response = await fetch("/api/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answer: formData.answer,
      behaviorAnalysis: analysis,
    }),
  });
  return response.json();
}
```

## Best Practices

1. Always use with `useRef` to access analysis data
2. Place component inside form elements
3. Adjust sensitivity based on your use case
4. Consider user privacy when storing analysis data
5. Use as part of a larger anti-cheating strategy, not as sole determinant

## Limitations

- Requires minimum interaction time for accurate analysis
- May produce false positives with power users
- Not a replacement for server-side validation
- Browser compatibility dependent

## Performance Notes

- Minimal DOM impact (renders null)
- Uses event listeners efficiently
- Clean up handled automatically
- Memory usage scales with session length

## Example Backend Validation

```python
def validate_submission(data):
    analysis = data.get('behaviorAnalysis')
    if analysis['risk'] > 0.8:
        flag_for_review(data)
    if analysis['patterns']:
        log_suspicious_patterns(analysis['patterns'])
    return is_valid_submission(data)
```
