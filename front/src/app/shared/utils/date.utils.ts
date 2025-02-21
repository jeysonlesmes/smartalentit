import { endOfDay, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const getTimeZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getStartOfDay = (date: Date): Date => {
  return startOfDay(toZonedTime(date, getTimeZone()));
}

export const getEndOfDay = (date: Date): Date => {
  return endOfDay(toZonedTime(date, getTimeZone()));
}

export const getUtcDate = (date: Date): string => {
  return fromZonedTime(date, getTimeZone()).toISOString();
}