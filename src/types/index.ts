export interface Config {
  appVersion: string;
}

export type ExtraService = {
  id: string;
  label: string;
  price: number;
  description: string;
};

export enum MenuPackageType {
  BASIC = 'basic',
  MEDIUM = 'medium',
  MAX = 'max',
  KLASYCZNY = 'klasyczny',
  EXCELLENT = 'excellent',
  DEGUSTACYJNY = 'degustacyjny',
}

export type MenuPackage = {
  label: string;
  value: MenuPackageType;
  thumbnail: string;
  features: string[];
  description: string;
};

export type ApiMenuPackage = {
  name: string;
  prices: { people: number; price: number }[];
};
