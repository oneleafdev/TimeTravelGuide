import data from '../../data/library.json';

export type GuideModule = {
  id: string;
  title: string;
  volume?: string;
  status: 'available' | 'planned';
};

export const siteTitle = data.title;
export const modules = data.modules as GuideModule[];
export const poetryModule = modules.find((module) => module.id === 'poetry')!;
export const wildernessModule = modules.find((module) => module.id === 'wilderness')!;
export const accountingModule = modules.find((module) => module.id === 'accounting')!;
