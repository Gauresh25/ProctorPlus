import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const KeystrokeAnalytics = forwardRef(({ sensitivity = 0.5 }, ref) => {
  const [behaviorData, setBehaviorData] = useState({
    // Keystroke patterns
    keyTiming: [],
    specialKeyCount: 0,
    typingSpeed: [],
    backspaceCount: 0,
    totalKeyPresses: 0,
    lastKeyTime: null,

    // Mouse patterns
    mouseCoordinates: [],
    mouseSpeed: [],
    mouseClicks: [],
    lastMousePosition: null,
    totalMouseDistance: 0,

    // Copy-paste patterns
    copyPasteEvents: [],
    totalCopyPaste: 0,
    consecutivePastes: 0,
    lastPasteTime: null,

    // Tab switching
    tabSwitches: [],
    lastTabFocusTime: null,
    totalTabSwitches: 0,

    // Browser window
    windowResizes: [],
    windowFocusEvents: [],
  });

  // All your existing analysis functions remain the same
  const analyzeKeyboardPatterns = () => {
    if (behaviorData.keyTiming.length < 5) return null;

    const analysis = {
      risk: 0,
      patterns: [],
    };

    // Check typing rhythm consistency
    const timings = behaviorData.keyTiming;
    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    const variance =
      timings.reduce((a, b) => a + Math.pow(b - avgTiming, 2), 0) /
      timings.length;

    if (variance < 10 * sensitivity) {
      analysis.risk += 0.4;
      analysis.patterns.push("Unnaturally consistent typing rhythm");
    }

    // Check typing speed
    const avgSpeed =
      behaviorData.typingSpeed.reduce((a, b) => a + b, 0) /
      behaviorData.typingSpeed.length;
    if (avgSpeed > 200 / sensitivity) {
      analysis.risk += 0.3;
      analysis.patterns.push("Superhuman typing speed detected");
    }

    // Analyze backspace usage
    const backspaceRatio =
      behaviorData.backspaceCount / behaviorData.totalKeyPresses;
    if (backspaceRatio < 0.01 * sensitivity) {
      analysis.risk += 0.2;
      analysis.patterns.push("Suspiciously low error correction rate");
    }

    return analysis;
  };

  const analyzeMousePatterns = () => {
    if (behaviorData.mouseCoordinates.length < 10) return null;

    const analysis = {
      risk: 0,
      patterns: [],
    };

    // Check for linear movements
    let linearMovements = 0;
    for (let i = 2; i < behaviorData.mouseCoordinates.length; i++) {
      const p1 = behaviorData.mouseCoordinates[i - 2];
      const p2 = behaviorData.mouseCoordinates[i - 1];
      const p3 = behaviorData.mouseCoordinates[i];

      // Calculate angle between movements
      const angle =
        Math.atan2(p3.y - p2.y, p3.x - p2.x) -
        Math.atan2(p2.y - p1.y, p2.x - p1.x);

      if (Math.abs(angle) < 0.1 * sensitivity) {
        linearMovements++;
      }
    }

    const linearRatio = linearMovements / behaviorData.mouseCoordinates.length;
    if (linearRatio > 0.7 / sensitivity) {
      analysis.risk += 0.3;
      analysis.patterns.push("Unnaturally linear mouse movements");
    }

    // Check mouse speed consistency
    const speeds = behaviorData.mouseSpeed;
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const speedVariance =
      speeds.reduce((a, b) => a + Math.pow(b - avgSpeed, 2), 0) / speeds.length;

    if (speedVariance < 5 * sensitivity) {
      analysis.risk += 0.2;
      analysis.patterns.push("Suspiciously consistent mouse speed");
    }

    return analysis;
  };

  const analyzeCopyPaste = () => {
    if (behaviorData.copyPasteEvents.length < 3) return null;

    const analysis = {
      risk: 0,
      patterns: [],
    };

    // Check frequency of copy-paste
    const copyPasteRatio =
      behaviorData.totalCopyPaste / behaviorData.totalKeyPresses;
    if (copyPasteRatio > 0.3 / sensitivity) {
      analysis.risk += 0.4;
      analysis.patterns.push("Excessive copy-paste usage");
    }

    // Check for rapid consecutive pastes
    if (behaviorData.consecutivePastes > 3 / sensitivity) {
      analysis.risk += 0.3;
      analysis.patterns.push("Suspicious paste pattern detected");
    }

    return analysis;
  };

  // Modified to return analysis instead of calling callback
  const performCompleteAnalysis = () => {
    const keyboardAnalysis = analyzeKeyboardPatterns();
    const mouseAnalysis = analyzeMousePatterns();
    const copyPasteAnalysis = analyzeCopyPaste();

    const totalRisk =
      ((keyboardAnalysis?.risk || 0) +
        (mouseAnalysis?.risk || 0) +
        (copyPasteAnalysis?.risk || 0)) /
      3;

    const combinedPatterns = [
      ...(keyboardAnalysis?.patterns || []),
      ...(mouseAnalysis?.patterns || []),
      ...(copyPasteAnalysis?.patterns || []),
    ];

    return {
      isLikelyBot: totalRisk > 0.1,
      risk: totalRisk,
      confidence: Math.min(combinedPatterns.length * 0.2, 1),
      patterns: combinedPatterns,
      metrics: {
        keyboardMetrics: keyboardAnalysis,
        mouseMetrics: mouseAnalysis,
        copyPasteMetrics: copyPasteAnalysis,
        tabSwitches: behaviorData.totalTabSwitches,
        totalMouseDistance: behaviorData.totalMouseDistance,
        copyPasteCount: behaviorData.totalCopyPaste,
        totalKeyPresses: behaviorData.totalKeyPresses,
      },
    };
  };

  // Expose the analysis method via ref
  useImperativeHandle(ref, () => ({
    getCurrentAnalysis: () => {
      const analysis = performCompleteAnalysis();
      console.log("Current analysis:", analysis); // Debug log
      return analysis;
    },
  }));

  // All your existing event handlers remain the same
  const handleMouseMove = (event) => {
    setBehaviorData((prev) => {
      const currentPosition = { x: event.clientX, y: event.clientY };
      const newData = { ...prev };

      if (prev.lastMousePosition) {
        const distance = Math.sqrt(
          Math.pow(currentPosition.x - prev.lastMousePosition.x, 2) +
            Math.pow(currentPosition.y - prev.lastMousePosition.y, 2)
        );
        const speed =
          distance / ((Date.now() - prev.lastMousePosition.time) / 1000);

        newData.mouseCoordinates.push(currentPosition);
        newData.mouseSpeed.push(speed);
        newData.totalMouseDistance += distance;
      }

      newData.lastMousePosition = { ...currentPosition, time: Date.now() };
      return newData;
    });
  };

  const handleCopyPaste = (event) => {
    setBehaviorData((prev) => {
      const newData = { ...prev };
      const currentTime = Date.now();
      const eventType = event.type;

      newData.copyPasteEvents.push({
        type: eventType,
        time: currentTime,
      });

      if (eventType === "paste") {
        newData.totalCopyPaste++;

        if (prev.lastPasteTime && currentTime - prev.lastPasteTime < 1000) {
          newData.consecutivePastes++;
        } else {
          newData.consecutivePastes = 1;
        }
        newData.lastPasteTime = currentTime;
      }

      return newData;
    });
  };

  const handleVisibilityChange = () => {
    setBehaviorData((prev) => {
      const newData = { ...prev };
      const currentTime = Date.now();

      if (document.hidden) {
        newData.tabSwitches.push(currentTime);
        newData.totalTabSwitches++;
      }

      newData.lastTabFocusTime = currentTime;
      return newData;
    });
  };

  // Add keyboard event handler
  const handleKeydown = (event) => {
    setBehaviorData((prev) => {
      const currentTime = Date.now();
      const newData = { ...prev };

      if (prev.lastKeyTime) {
        newData.keyTiming.push(currentTime - prev.lastKeyTime);
      }

      newData.totalKeyPresses++;
      if (event.key === "Backspace") {
        newData.backspaceCount++;
      }
      if (event.ctrlKey || event.altKey || event.metaKey) {
        newData.specialKeyCount++;
      }

      const timeElapsed = (currentTime - prev.lastKeyTime) / 1000 / 60;
      if (timeElapsed > 0) {
        newData.typingSpeed.push(1 / timeElapsed);
      }

      newData.lastKeyTime = currentTime;
      return newData;
    });
  };

  useEffect(() => {
    // Set up event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      // Cleanup
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return null;
});

export default KeystrokeAnalytics;
