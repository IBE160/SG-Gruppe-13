export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2" data-testid="typing-indicator">
      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
    </div>
  );
}