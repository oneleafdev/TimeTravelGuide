import data from '../../data/poetry.json';

export type Source = {
  label: string;
  url: string;
};

export type NovelUse = {
  work: string;
  chapter: string;
  scene: string;
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
  novelUses?: readonly NovelUse[];
};

const catalogue: readonly Poem[] = data.poems;
export function hasNovelEvidence(poem: Poem): poem is Poem & { novelUses: readonly NovelUse[] } {
  return (poem.novelUses?.length ?? 0) >= 2;
}

export const verifiedPoems = catalogue.filter(hasNovelEvidence).sort((a, b) =>
  Number(b.id === data.featuredPoemId) - Number(a.id === data.featuredPoemId),
);
export const pendingPoems = catalogue.filter((poem) => !hasNovelEvidence(poem));
export const poems = [...verifiedPoems, ...pendingPoems];
export const dynasties = [...new Set(catalogue.map((poem) => poem.dynasty))];

export function findPoem(id: string | undefined) {
  return poems.find((poem) => poem.id === id);
}

export const featuredPoem = findPoem(data.featuredPoemId)!;
