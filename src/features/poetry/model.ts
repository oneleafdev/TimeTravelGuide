import data from '../../data/poetry.json';

export type Source = {
  label: string;
  url: string;
};

export type Poem = {
  id: string;
  title: string;
  dynasty: string;
  author: string;
  form: string;
  lines: readonly string[];
  scene: string;
  meaning: string;
  memoryCue: string;
  sources: readonly Source[];
};

export const poems: readonly Poem[] = data.poems;
export const dynasties = [...new Set(poems.map((poem) => poem.dynasty))];

export function findPoem(id: string | undefined) {
  return poems.find((poem) => poem.id === id);
}

export const featuredPoem = findPoem(data.featuredPoemId)!;
