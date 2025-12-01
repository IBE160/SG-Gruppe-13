import { Link } from 'lucide-react';

interface SourcedLinkProps {
  source: string;
}

export function SourcedLink({ source }: SourcedLinkProps) {
  return (
    <a
      href={source}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-gray-400 hover:text-gray-300 transition-colors mt-1 flex items-center"
    >
      <Link className="h-4 w-4 mr-1" />
      Source
    </a>
  );
}
