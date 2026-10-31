import dayjs, { type ConfigType } from 'dayjs';

export const DATE_FORMATS = {
  apiDate: 'YYYY-M-D',
  apiDateTime: 'YYYY-MM-DD HH:mm',
} as const;

export type DateFormat = keyof typeof DATE_FORMATS;

export const formatDate = (date: ConfigType, format: DateFormat): string =>
  dayjs(date).format(DATE_FORMATS[format]);

export const parseDate = (date: ConfigType, format: DateFormat): Date =>
  dayjs(date, DATE_FORMATS[format]).toDate();
