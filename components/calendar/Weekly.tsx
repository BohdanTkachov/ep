import Link from 'next/link';

import { Fragment, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import {
  areSameDates,
  getDayOfWeek,
  getHourRange,
  getWeekDayNames,
  isToday,
  scrollCalendarWindow,
  weekData,
} from '~/utils/calendar/calendar';

import { CalendarHeader } from './Headers/CalendarHeader';

import type { CalendarProps } from '~/types';
import type { FC } from 'react';

export const CalendarWeekly: FC<CalendarProps> = ({
  dateString,
  className,
  schedules,
  twelveHoursFormat,
  viewType,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  const weekDayNames = getWeekDayNames();

  const [calendarDate, setCalendarDate] = useState(new Date(dateString));

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: twelveHoursFormat,
  };

  useEffect(() => {
    // Set the container scroll position based on the first schedule time.

    let currentMinute = 0;

    if (schedules.length > 0) {
      currentMinute = schedules[0].startDateTime.getHours() * 60;
    } else {
      currentMinute = new Date().getHours() * 60;
    }

    scrollCalendarWindow(
      container,
      containerNav,
      containerOffset,
      currentMinute,
    );
  }, [schedules]);

  useEffect(() => {
    setCalendarDate(new Date(dateString));
  }, [dateString]);

  return (
    <div
      className={clsx(
        'flex h-[calc(100vh-100px)] overflow-y-auto flex-col tablet:border tablet:border-stroke tablet:rounded-xl desktop:mt-8 tablet:mt-4 tablet:mx-4',
        className,
      )}
    >
      <CalendarHeader currentDate={calendarDate} viewType={viewType} />
      <div
        ref={container}
        className="isolate flex flex-auto flex-col overflow-auto bg-white"
      >
        <div className="flex max-w-[1200px] flex-none flex-col overflow-x-hidden">
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-stroke ring-opacity-5"
          >
            <div className="-mr-px grid-cols-7 divide-x divide-stroke border-r border-stroke text-darkSkyBlue-80 grid">
              <div className="col-end-1 w-14" />
              {weekData(calendarDate).map((dayItem, index) => (
                <Link
                  href={`/calendar/week/${dayItem
                    .toISOString()
                    .substring(0, 10)}`}
                  className="flex flex-row items-center justify-center py-3 text-quot"
                  key={dayItem.toString()}
                >
                  <div className="font-medium text-darkSkyBlue-100">
                    {weekDayNames[index].substring(0, 3)}
                  </div>
                  <div
                    className={clsx(
                      'items-center justify-center text-center w-[22px] h-[22px] font-bold ml-0.5 pl-px pt-0.5',
                      areSameDates(calendarDate, dayItem)
                        ? 'bg-green-100 text-white rounded-full'
                        : '',
                      isToday(dayItem) && !areSameDates(calendarDate, dayItem)
                        ? 'text-green-100'
                        : 'text-darkSkyBlue-100',
                    )}
                  >
                    {dayItem.getDate()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-stroke" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-stroke"
                style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {getHourRange(twelveHoursFormat).map((item) => (
                  <Fragment key={item}>
                    <div>
                      <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-quot text-darkSkyBlue-80">
                        {item}
                      </div>
                    </div>
                    <div />
                  </Fragment>
                ))}
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 grid-cols-7 grid-rows-1 divide-x divide-stroke grid">
                <div className="col-start-1 row-span-full" />
                <div className="col-start-2 row-span-full" />
                <div className="col-start-3 row-span-full" />
                <div className="col-start-4 row-span-full" />
                <div className="col-start-5 row-span-full" />
                <div className="col-start-6 row-span-full" />
                <div className="col-start-7 row-span-full" />
                <div className="col-start-8 row-span-full" />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-7 "
                style={{
                  gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
                }}
              >
                {schedules.map((schedule, index) => (
                  <li
                    key={`schedule-${index}`}
                    className={clsx(
                      'text-quot py-[11px] px-[9px] m-[3px] relative rounded-md flex flex-col',
                      index % 5 == 0 ? 'bg-yellow-20 hover:bg-yellow-40' : '',
                      index % 5 == 1 ? 'bg-orange-20 hover:bg-orange-40' : '',
                      index % 5 == 4 ? 'bg-purple-20 hover:bg-purple-40' : '',
                      index % 5 == 2 ? 'bg-green-20 hover:bg-green-40' : '',
                      index % 5 == 3 ? 'bg-blue-20 hover:bg-blue-40' : '',
                      `col-start-${getDayOfWeek(schedule.startDateTime)}`,
                    )}
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
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
