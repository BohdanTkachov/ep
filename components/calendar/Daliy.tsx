import Link from 'next/link';

import { Fragment, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import ChevronLeft from '~/public/IconsSet/chevron-left.svg';
import ChevronRight from '~/public/IconsSet/chevron-right.svg';
import {
  areSameDates,
  getHourRange,
  getWeekDayNames,
  isCurrentMonth,
  isTheSameMonth,
  isToday,
  monthData,
  monthName,
  scrollCalendarWindow,
  weekData,
} from '~/utils/calendar/calendar';

import { CalendarHeader } from './Headers/CalendarHeader';

import type { CalendarProps } from '~/types';
import type { FC } from 'react';

export const CalendarDaily: FC<CalendarProps> = ({
  dateString,
  className,
  schedules,
  twelveHoursFormat,
  viewType,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  const [calendarDate, setCalendarDate] = useState(new Date(dateString));

  const [date, setDate] = useState(new Date(dateString));
  const weekDayNames = getWeekDayNames();
  const weekDays = weekData(calendarDate);

  const [days, setDays] = useState(
    monthData(calendarDate.getFullYear(), calendarDate.getMonth(), date),
  );

  const nextMonth = () => {
    setCalendarDate((prevValue) => {
      const nextValue = new Date(+prevValue);
      nextValue.setMonth(nextValue.getMonth() + 1);
      return nextValue;
    });
  };

  const prevMonth = () => {
    setCalendarDate((prevValue) => {
      const nextValue = new Date(+prevValue);
      nextValue.setMonth(nextValue.getMonth() - 1);
      return nextValue;
    });
  };

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: twelveHoursFormat,
  };

  useEffect(() => {
    // Set the container scroll position based on the current time.
    let currentMinute = new Date().getHours() * 60;

    if (schedules.length > 0) {
      currentMinute = schedules[0].startDateTime.getHours() * 60;
    }

    scrollCalendarWindow(
      container,
      containerNav,
      containerOffset,
      currentMinute,
    );
  }, [schedules]);

  useEffect(() => {
    setDate(new Date(dateString));
    if (isTheSameMonth(calendarDate, date)) {
      setDays(
        monthData(date.getFullYear(), date.getMonth(), new Date(dateString)),
      );
    }
    setCalendarDate(new Date(dateString));
  }, [dateString]);

  useEffect(() => {
    setDays(
      monthData(calendarDate.getFullYear(), calendarDate.getMonth(), date),
    );
  }, [calendarDate]);

  return (
    <div
      className={clsx(
        'flex h-[calc(100vh-100px)] overflow-y-auto flex-col tablet:m-4 border border-stroke tablet:rounded-xl',
        className,
      )}
    >
      <CalendarHeader currentDate={date} viewType={viewType} />
      <div className="isolate flex flex-auto overflow-hidden bg-white tablet:rounded-br-xl">
        <div
          ref={container}
          className="flex flex-auto flex-col overflow-y-auto"
        >
          <div
            ref={containerNav}
            className="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white shadow ring-1 ring-darkSkyBlue-100 ring-opacity-5 tablet:hidden font-medium text-quot text-darkSkyBlue-100"
          >
            {weekDayNames.map((name, index) => (
              <button
                type="button"
                className="flex flex-col items-center pt-3 pb-1.5 "
                key={`day${index}`}
              >
                <span>{name}</span>
                <span
                  className={clsx(
                    'mt-3 flex h-7 w-7 items-center justify-center rounded-full text-qout font-semibold ',
                    isTheSameMonth(weekDays[index], date)
                      ? 'bg-white'
                      : 'bg-darkSkyBlue-10',
                    areSameDates(weekDays[index], date)
                      ? 'rounded-full bg-green-100 text-white'
                      : '',
                    !areSameDates(weekDays[index], date) &&
                      isCurrentMonth(weekDays[index]) &&
                      !isToday(date)
                      ? 'text-darkSkyBlue-100'
                      : '',
                    !areSameDates(weekDays[index], date) &&
                      !isCurrentMonth(weekDays[index]) &&
                      !isToday(date)
                      ? 'text-darkSkyBlue-60'
                      : '',
                    isToday(weekDays[index]) &&
                      !areSameDates(weekDays[index], date)
                      ? 'text-green-100'
                      : '',
                  )}
                >
                  {weekDays[index].getDate()}
                </span>
              </button>
            ))}
          </div>

          <div className="flex w-full flex-auto">
            {/* Horizontal lines */}
            <div className="w-14 flex-none bg-white ring-1 ring-stroke tablet:rounded-bl-xl" />

            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Left hours */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-darkSkyBlue-10 text-quot font-normal text-darkSkyBlue-80"
                style={{
                  gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))',
                }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {getHourRange(twelveHoursFormat).map((item) => (
                  <Fragment key={item}>
                    <div>
                      <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right ">
                        {item}
                      </div>
                    </div>
                    <div />
                  </Fragment>
                ))}

                <div />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{
                  gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
                }}
              >
                {/* gridRow: 12 ~ 60min*/}
                {schedules.map((schedule, index) => (
                  <li
                    key={schedule.id}
                    className="relative mt-px flex"
                    style={{
                      gridRow: `${
                        2 + schedule.startDateTime.getHours() * 12
                      }  / span ${
                        (schedule.endDateTime.getHours() -
                          schedule.startDateTime.getHours()) *
                          12 +
                        (schedule.endDateTime.getMinutes() -
                          schedule.startDateTime.getMinutes()) *
                          0.2
                      }`,
                    }}
                  >
                    <a
                      href="#"
                      className={clsx(
                        'group absolute inset-1 flex flex-col overflow-y-auto rounded-lg pt-2 pl-2 text-parS leading-5',
                        index % 5 == 0 ? 'bg-yellow-20 hover:bg-yellow-40' : '',
                        index % 5 == 1 ? 'bg-orange-20 hover:bg-orange-40' : '',
                        index % 5 == 4 ? 'bg-purple-20 hover:bg-purple-40' : '',
                        index % 5 == 2 ? 'bg-green-20 hover:bg-green-40' : '',
                        index % 5 == 3 ? 'bg-blue-20 hover:bg-blue-40' : '',
                      )}
                    >
                      <p className="order-0 text-quot font-medium text-darkSkyBlue-100">
                        <time dateTime={schedule.startDateTime.toISOString()}>
                          {new Intl.DateTimeFormat('en-US', options).format(
                            schedule.startDateTime,
                          )}
                        </time>
                      </p>
                      <p className="text-darkSkyBlue-100 text-quot font-bold">
                        {schedule.student.firstName || schedule.group.title}
                      </p>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className="hidden desktop:w-[414px] tablet:w-[355px] flex-none border-l border-stroke py-10 px-4 tablet:block">
          <div className="flex items-center text-center text-darkSkyBlue-90">
            <button
              type="button"
              onClick={() => prevMonth()}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-darkSkyBlue-60 "
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex-auto font-semibold text-parS">{`${monthName(
              calendarDate,
            )} ${calendarDate.getFullYear()}`}</div>
            <button
              type="button"
              onClick={() => nextMonth()}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-darkSkyBlue-60"
            >
              <span className="sr-only">Next month</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-center text-quot leading-6 text-darkSkyBlue-60">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-stroke text-parS shadow ring-1 ring-mystic-100">
            {days.map((day, dayIdx) => (
              <Link
                href={`/calendar/day/${day.date
                  .toISOString()
                  .substring(0, 10)}`}
                key={day.date.toISOString()}
                className={clsx(
                  'py-[7px] text-quot font-medium hover:bg-darkSkyBlue-20 focus:z-10',
                  day.isCurrentMonth ? 'bg-white' : 'bg-darkSkyBlue-10',
                  areSameDates(day.date, date) && !isToday(day.date)
                    ? 'text-white'
                    : '',
                  !areSameDates(day.date, date) &&
                    day.isCurrentMonth &&
                    !isToday(day.date)
                    ? 'text-darkSkyBlue-100'
                    : '',
                  !areSameDates(day.date, date) &&
                    !day.isCurrentMonth &&
                    !isToday(day.date)
                    ? 'text-darkSkyBlue-60'
                    : '',
                  isToday(day.date) && !areSameDates(day.date, date)
                    ? 'text-blue-80'
                    : '',
                  dayIdx === 0 ? 'rounded-tl-lg' : '',
                  dayIdx === 6 ? 'rounded-tr-lg' : '',
                )}
              >
                <time
                  dateTime={day.date.toISOString().substring(0, 10)}
                  className={clsx(
                    'mx-auto w-8 h-8 p-0 flex items-center justify-center rounded-full',
                    areSameDates(day.date, date) &&
                      'rounded-full bg-green-90 text-white',
                    !areSameDates(day.date, date) &&
                      isToday(day.date) &&
                      'text-green-100',
                  )}
                >
                  {day.date.getDate()}
                </time>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
