import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
//import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const KeystrokeAnalytics = forwardRef(({ 
  sensitivity = 0.5, 
  alertThreshold = 0.3,
  onAlert = null 
}, ref) => {
  const [behaviorData, setBehaviorData] = useState({
    keyTiming: [],
    specialKeyCount: 0,
    typingSpeed: [],
    backspaceCount: 0,
    totalKeyPresses: 0,
    lastKeyTime: null,
    mouseCoordinates: [],
    mouseSpeed: [],
    mouseClicks: [],
    lastMousePosition: null,
    totalMouseDistance: 0,
    copyPasteEvents: [],
    totalCopyPaste: 0,
    consecutivePastes: 0,
    lastPasteTime: null,
    tabSwitches: [],
    lastTabFocusTime: null,
    totalTabSwitches: 0,
    windowResizes: [],
    windowFocusEvents: [],
  });

  const [alerts, setAlerts] = useState([]);

  const addAlert = (pattern, risk) => {
    const alert = {
      id: Date.now(),
      pattern,
      risk,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setAlerts(prev => [...prev, alert]);
    if (onAlert) onAlert(alert);
  };

  const analyzeKeyboardPatterns = () => {
    if (behaviorData.keyTiming.length < 5) return null;

    const analysis = { risk: 0, patterns: [] };
    const timings = behaviorData.keyTiming;
    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    const variance = timings.reduce((a, b) => a + Math.pow(b - avgTiming, 2), 0) / timings.length;

    if (variance < 10 * sensitivity) {
      analysis.risk += 0.4;
      analysis.patterns.push("Unnaturally consistent typing rhythm");
    }

    const avgSpeed = behaviorData.typingSpeed.reduce((a, b) => a + b, 0) / behaviorData.typingSpeed.length;
    if (avgSpeed > 200 / sensitivity) {
      analysis.risk += 0.3;
      analysis.patterns.push("Superhuman typing speed detected");
    }

    const backspaceRatio = behaviorData.backspaceCount / behaviorData.totalKeyPresses;
    if (backspaceRatio < 0.01 * sensitivity) {
      analysis.risk += 0.2;
      analysis.patterns.push("Suspiciously low error correction rate");
    }

    return analysis;
  };

  const analyzeMousePatterns = () => {
    if (behaviorData.mouseCoordinates.length < 10) return null;

    const analysis = { risk: 0, patterns: [] };
    let linearMovements = 0;

    for (let i = 2; i < behaviorData.mouseCoordinates.length; i++) {
      const p1 = behaviorData.mouseCoordinates[i - 2];
      const p2 = behaviorData.mouseCoordinates[i - 1];
      const p3 = behaviorData.mouseCoordinates[i];

      const angle = Math.atan2(p3.y - p2.y, p3.x - p2.x) - 
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

    const speeds = behaviorData.mouseSpeed;
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const speedVariance = speeds.reduce((a, b) => a + Math.pow(b - avgSpeed, 2), 0) / speeds.length;

    if (speedVariance < 5 * sensitivity) {
      analysis.risk += 0.2;
      analysis.patterns.push("Suspiciously consistent mouse speed");
    }

    return analysis;
  };

  const analyzeCopyPaste = () => {
    if (behaviorData.copyPasteEvents.length < 3) return null;

    const analysis = { risk: 0, patterns: [] };
    const copyPasteRatio = behaviorData.totalCopyPaste / behaviorData.totalKeyPresses;

    if (copyPasteRatio > 0.3 / sensitivity) {
      analysis.risk += 0.4;
      analysis.patterns.push("Excessive copy-paste usage");
    }

    if (behaviorData.consecutivePastes > 3 / sensitivity) {
      analysis.risk += 0.3;
      analysis.patterns.push("Suspicious paste pattern detected");
    }

    return analysis;
  };

  const performCompleteAnalysis = () => {
    const keyboardAnalysis = analyzeKeyboardPatterns();
    const mouseAnalysis = analyzeMousePatterns();
    const copyPasteAnalysis = analyzeCopyPaste();

    const totalRisk = ((keyboardAnalysis?.risk || 0) + 
                      (mouseAnalysis?.risk || 0) + 
                      (copyPasteAnalysis?.risk || 0)) / 3;

    const combinedPatterns = [
      ...(keyboardAnalysis?.patterns || []),
      ...(mouseAnalysis?.patterns || []),
      ...(copyPasteAnalysis?.patterns || []),
    ];

    const analysis = {
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

    if (analysis.risk > alertThreshold) {
      analysis.patterns.forEach(pattern => addAlert(pattern, analysis.risk));
    }

    return analysis;
  };

  useImperativeHandle(ref, () => ({
    getCurrentAnalysis: performCompleteAnalysis
  }));

  const handleMouseMove = (event) => {
    setBehaviorData(prev => {
      const currentPosition = { x: event.clientX, y: event.clientY };
      const newData = { ...prev };

      if (prev.lastMousePosition) {
        const distance = Math.sqrt(
          Math.pow(currentPosition.x - prev.lastMousePosition.x, 2) +
          Math.pow(currentPosition.y - prev.lastMousePosition.y, 2)
        );
        const speed = distance / ((Date.now() - prev.lastMousePosition.time) / 1000);

        newData.mouseCoordinates.push(currentPosition);
        newData.mouseSpeed.push(speed);
        newData.totalMouseDistance += distance;
      }

      newData.lastMousePosition = { ...currentPosition, time: Date.now() };
      return newData;
    });
  };

  const handleCopyPaste = (event) => {
    setBehaviorData(prev => {
      const newData = { ...prev };
      const currentTime = Date.now();

      newData.copyPasteEvents.push({
        type: event.type,
        time: currentTime,
      });

      if (event.type === "paste") {
        newData.totalCopyPaste++;
        newData.consecutivePastes = 
          prev.lastPasteTime && currentTime - prev.lastPasteTime < 1000 
            ? prev.consecutivePastes + 1 
            : 1;
        newData.lastPasteTime = currentTime;
      }

      return newData;
    });
  };

  const handleVisibilityChange = () => {
    setBehaviorData(prev => {
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

  const handleKeydown = (event) => {
    setBehaviorData(prev => {
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
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeydown);

    const analysisInterval = setInterval(() => {
      const analysis = performCompleteAnalysis();
      if (analysis.risk > alertThreshold) {
        analysis.patterns.forEach(pattern => addAlert(pattern, analysis.risk));
      }
    }, 5000); // 5-second intervals

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeydown);
      clearInterval(analysisInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 w-96 z-50">
      {alerts.slice(-3).map(alert => (
        <div 
          key={alert.id} 
          className={`${
            alert.risk > 0.5 ? 'bg-red-100' : 'bg-yellow-100'
          } p-4 rounded-lg shadow-lg border`}
        >
          <div className="font-medium">Suspicious Activity Detected</div>
          <div>
            <div>{alert.pattern}</div>
            <div className="text-sm text-gray-500 mt-1">
              Risk Level: {(alert.risk * 100).toFixed(1)}%
              <span className="mx-2">•</span>
              {alert.timestamp}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default KeystrokeAnalytics;