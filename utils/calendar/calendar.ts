import type { CalendarDate } from '~/types';
import type { RefObject } from 'react';

export const monthName = (date: Date) => {
  return monthNames()[date.getMonth()];
};

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getDayOfWeek = (date: Date): number => {
  const dayOfWeek = date.getDay();

  // For us, sunday isn't the first day in the week, it's the last one
  if (dayOfWeek == 0) return 6;

  return dayOfWeek - 1;
};

export const isCurrentMonth = (date: Date) => {
  const currantDate = new Date();
  return (
    date.getFullYear() === currantDate.getFullYear() &&
    date.getMonth() === currantDate.getMonth()
  );
};

export const isTheSameMonth = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

export const monthData = (
  year: number,
  month: number,
  selectedDate: Date,
): CalendarDate[] => {
  const result: CalendarDate[] = [];

  const monthDate = new Date(year, month);

  const daysInMonth = getDaysInMonth(monthDate);
  const monthStartsOn = getDayOfWeek(monthDate);

  let day = 1 - monthStartsOn;

  for (let i = 0; i < (daysInMonth + monthStartsOn) / 7; i++) {
    for (let y = 0; y < 7; y++) {
      const date = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        day,
        12,
      );
      const currantMonth = isTheSameMonth(date, new Date(year, month));

      result.push({
        date: date,
        isCurrentMonth: currantMonth,
        isSelected: areSameDates(date, selectedDate),
        isToday: isToday(date),
      });
      day++;
    }
  }

  return result;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};

export const monthNames = (lang = 'en-US') => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
    return new Date(1970, month, 1).toLocaleString(lang, { month: 'long' });
  });
};

export const getWeekDayNames = (lang = 'en-US') => {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => {
    return new Date(Date.UTC(2017, 0, 2 + day)).toLocaleString(lang, {
      weekday: 'short',
    });
  });
};

export const weekData = (date: Date): Date[] => {
  const firstDay = date.getDate() - getDayOfWeek(date);
  const lastDay = firstDay + 7;

  const result: Date[] = [];

  for (let day = firstDay; day < lastDay; day++) {
    result.push(new Date(date.getFullYear(), date.getMonth(), day, 12));
  }

  return result;
};

export const areSameDates = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Formats date into `hh:mm` format
 * @example `16:00`
 */
export const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: 'numeric',
});

/**
 * Formats date into `hh AM/PM` format
 * @example `4 AM`
 */
export const timeFormatter12hour = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
});

export function formatTime(date: Date, is12hourFormat = false): string {
  return is12hourFormat
    ? timeFormatter12hour.format(date)
    : timeFormatter.format(date);
}

/**
 * Generates an array of 24 formatted hours
 * @example ['00:00', '01:00', ..., `23:00`]
 */
export function getHourRange(is12hourFormat = false): string[] {
  const hours = Array.from({ length: 24 }, (_, i) => new Date(0, 0, 0, i));

  const hourStrings = hours.map((date) => formatTime(date, is12hourFormat));

  return hourStrings;
}

export function scrollCalendarWindow(
  container: RefObject<HTMLDivElement>,
  containerNav: RefObject<HTMLDivElement>,
  containerOffset: RefObject<HTMLDivElement>,
  currentMinute: number,
) {
  if (container.current && containerNav.current && containerOffset.current) {
    container.current.scrollTop =
      ((container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight) *
        currentMinute) /
      1440;
  }
}
