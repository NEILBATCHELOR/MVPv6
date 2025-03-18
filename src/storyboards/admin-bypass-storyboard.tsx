import React from "react";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";

export default function AdminBypassStoryboard() {
  return (
    <div className="w-full h-full">
      <WelcomeScreen />
      <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-md text-sm">
        <p>
          <strong>Admin Bypass Instructions:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click the settings icon in the top-right corner</li>
          <li>
            Enter password: <code>admin123</code>
          </li>
          <li>
            Or use keyboard shortcut: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+
            <kbd>A</kbd>
          </li>
        </ul>
      </div>
    </div>
  );
}
