export const poetryPath = '/poetry';

export function poemPath(id: string, recite = false) {
  return `${poetryPath}/${id}${recite ? '?mode=recite' : ''}`;
}
