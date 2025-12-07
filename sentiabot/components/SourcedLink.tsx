import { Link } from 'lucide-react';
import { SourceReference } from '@/types'; // Import the SourceReference type

interface SourcedLinkProps {
  source: SourceReference;
}

export function SourcedLink({ source }: SourcedLinkProps) {
  const { label, url } = source;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-accent hover:text-accent-foreground transition-colors mt-1 flex items-center" // Use accent color
    >
      <Link className="h-4 w-4 mr-1" />
      {label}
    </a>
  );
}
