import React from "react";
import { createRoot } from "react-dom/client";
import MobileHeader from "./components/MobileHeader";
import { ClerkProvider } from "@clerk/clerk-react";

// Test component to verify MobileHeader functionality
const TestMobileHeader = () => {
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  // Simulate recording timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  return (
    <div className="min-h-screen bg-[#101010]">
      <MobileHeader
        recordingTime={recordingTime}
        isRecording={isRecording}
        isPaused={isPaused}
      />

      <div className="p-4 space-y-4">
        <h2 className="text-white text-xl">MobileHeader Test</h2>

        <div className="space-x-2">
          <button
            onClick={() => {
              setIsRecording(!isRecording);
              if (!isRecording) {
                setRecordingTime(0);
                setIsPaused(false);
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>

          {isRecording && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}

          <button
            onClick={() => {
              setRecordingTime(0);
              setIsRecording(false);
              setIsPaused(false);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        <div className="text-white">
          <p>Recording Time: {(recordingTime / 1000).toFixed(1)}s</p>
          <p>Is Recording: {isRecording ? "Yes" : "No"}</p>
          <p>Is Paused: {isPaused ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
};

// Only run if this file is executed directly (for testing)
if (
  typeof window !== "undefined" &&
  document.getElementById("test-mobile-header")
) {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  const container = document.getElementById("test-mobile-header");
  if (container) {
    const root = createRoot(container);
    root.render(
      <ClerkProvider publishableKey={clerkPubKey}>
        <TestMobileHeader />
      </ClerkProvider>
    );
  }
}

export default TestMobileHeader;
