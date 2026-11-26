import data from '../../data/brewing.json';

type BrewingNote = { title: string; body: string };
type BrewingTopic = {
  id: string;
  title: string;
  type: string;
  steps: readonly BrewingNote[];
  detail: BrewingNote;
  sources: readonly { label: string; url: string }[];
};

export const brewingPath = '/brewing';
export const brewingTopics: readonly BrewingTopic[] = data.topics;
