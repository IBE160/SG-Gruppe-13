import { Card, CardContent } from "@/components/ui/card";

export function TypingIndicator() {
  return (
    <div className="flex justify-start" data-testid="typing-indicator">
      <Card className="max-w-[70%] bg-gray-200 text-gray-800">
        <CardContent className="p-2">
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gray-500 [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-gray-500 [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-gray-500"></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
