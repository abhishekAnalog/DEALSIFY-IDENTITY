// src/utils/time.util.ts
import * as moment from 'moment-timezone';

export function getLocalExpirationTime(
  minutes: number,
  timeZone: string,
): Date {
  return moment.tz(Date.now(), timeZone).add(minutes, 'minutes').toDate();
}
