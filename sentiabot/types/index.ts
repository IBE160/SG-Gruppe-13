export interface SourceReference {
  label: string;
  url: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  sourceReferences?: SourceReference[];
}
