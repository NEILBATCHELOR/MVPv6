import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "An error occurred while loading data.",
  error,
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <AlertCircle className="h-8 w-8 text-destructive mb-4" />
      <p className="text-destructive font-medium mb-2">{message}</p>
      {error && (
        <p className="text-muted-foreground text-sm mb-4">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
