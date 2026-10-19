export interface ProhibitedDocument {
  contents: string;
}
export interface PreparedProhibitedDocument<T extends ProhibitedDocument> {
  source: T;
  section: string;
  searchable: string;
}
export interface ProhibitedMatch<T extends ProhibitedDocument> {
  ingredient: string;
  section: string;
  note: string;
  source: T;
}
