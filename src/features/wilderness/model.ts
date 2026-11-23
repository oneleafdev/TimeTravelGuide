import data from '../../data/wilderness.json';

export type GuideTopic = {
  id: string;
  title: string;
  priority: string;
  steps: readonly { title: string; body: string }[];
  avoid: readonly string[];
  sources: readonly { label: string; url: string }[];
};

export const topics: readonly GuideTopic[] = data.topics;
export const wildernessPath = '/wilderness';
export const topicRoute = `${wildernessPath}/:topicId`;

export function topicPath(id: string) {
  return `${wildernessPath}/${id}`;
}

export function findTopic(id: string | undefined) {
  return topics.find((topic) => topic.id === id);
}
