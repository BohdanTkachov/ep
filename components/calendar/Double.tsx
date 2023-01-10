import Link from 'next/link';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

import ChevronLeft from '~/public/IconsSet/chevron-left.svg';
import ChevronRight from '~/public/IconsSet/chevron-right.svg';
import {
  areSameDates,
  getDayOfWeek,
  getWeekDayNames,
  isToday,
  monthData,
  monthName,
} from '~/utils/calendar/calendar';

import { CalendarHeader } from './Headers/CalendarHeader';

import type { CalendarProps } from '~/types';
import type { FC } from 'react';

export const CalendarDouble: FC<CalendarProps> = ({
  dateString,
  className,
  schedules,
  twelveHoursFormat,
  viewType,
}) => {
  const date = new Date(dateString);

  const [dateForFirstCalendar, setDateForFirstCalendar] = useState(
    new Date(dateString),
  );
  const [dateForSecondCalendar, setDateForSecondCalendar] = useState(() => {
    const newDate = new Date(dateString);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
  });

  const weekDayNames = getWeekDayNames();

  const [monthDataForFirstCalendar, setMonthDataForFirstCalendar] = useState(
    monthData(
      dateForFirstCalendar.getFullYear(),
      dateForFirstCalendar.getMonth(),
      date,
    ),
  );

  const [monthDataForSecondCalendar, setMonthDataForSecondCalendar] = useState(
    monthData(
      dateForSecondCalendar.getFullYear(),
      dateForSecondCalendar.getMonth(),
      date,
    ),
  );

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: twelveHoursFormat,
  });

  const filteredScheduls = () => {
    return schedules
      .filter((x) => x.startDateTime.getTime() > new Date().getTime())
      .sort((x, y) => x.startDateTime.getTime() - y.startDateTime.getTime())
      .slice(0, 4);
  };

  const nextMonth = () => {
    setDateForFirstCalendar((prevValue) => {
      const nextValue = new Date(+prevValue);
      nextValue.setMonth(nextValue.getMonth() + 1);
      return nextValue;
    });

    setDateForSecondCalendar((prevValue) => {
      const nextValue = new Date(+prevValue);
      nextValue.setMonth(nextValue.getMonth() + 1);
      return nextValue;
    });
  };

  const prevMonth = () => {
    setDateForFirstCalendar((prevValue) => {
      const nextValue = new Date(+prevValue);
      nextValue.setMonth(nextValue.getMonth() - 1);
      return nextValue;
    });

    setDateForSecondCalendar((prevValue) => {
      const nextValue = new Date(+prevValue);
      nextValue.setMonth(nextValue.getMonth() - 1);
      return nextValue;
    });
  };

  useEffect(() => {
    setMonthDataForFirstCalendar(
      monthData(
        dateForFirstCalendar.getFullYear(),
        dateForFirstCalendar.getMonth(),
        date,
      ),
    );
    setMonthDataForSecondCalendar(
      monthData(
        dateForSecondCalendar.getFullYear(),
        dateForSecondCalendar.getMonth(),
        date,
      ),
    );
  }, [dateForFirstCalendar]);

  return (
    <div
      className={clsx(
        'flex max-h-full flex-col tablet:px-4 tablet:pt-4',
        className,
      )}
    >
      <div className="tablet:border tablet:border-stroke rounded-xl mb-6 tablet:min-h-[685px]">
        <CalendarHeader
          showArrows={false}
          currentDate={date}
          title={`${monthName(dateForFirstCalendar).substring(
            0,
            3,
          )}-${monthName(dateForSecondCalendar).substring(
            0,
            3,
          )} ${dateForFirstCalendar.getFullYear()}`}
          viewType={viewType}
        />
        <div className="flex w-full desktop:w-[768px] mx-auto flex-col">
          <div className="isolate flex flex-auto overflow-hidden bg-white tablet:rounded-br-xl">
            <div className="tablet:w-1/2 w-full flex-none py-6 px-2 tablet:pr-5 tablet:block">
              <div className="flex items-center text-center text-darkSkyBlue-90 mx-1.5">
                <button
                  type="button"
                  onClick={() => prevMonth()}
                  className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-darkSkyBlue-60 "
                >
                  <span className="sr-only">Previous month</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex-auto font-semibold text-parS text-darkSkyBlue-100">{`${monthName(
                  dateForFirstCalendar,
                )} ${dateForFirstCalendar.getFullYear()}`}</div>
                <button
                  type="button"
                  onClick={() => nextMonth()}
                  className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-darkSkyBlue-60 tablet:hidden"
                >
                  <span className="sr-only">Next month</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 grid grid-cols-7 text-center text-quot leading-6 text-darkSkyBlue-60 font-medium">
                {weekDayNames.map((name) => (
                  <div key={`day ${name}`}>{name.charAt(0)}</div>
                ))}
              </div>
              <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-stroke text-parS shadow ring-1 ring-mystic-100">
                {monthDataForFirstCalendar.map((day, dayIdx) => {
                  const hasEventOnThisDay =
                    schedules.filter((x) =>
                      areSameDates(x.startDateTime, day.date),
                    ).length > 0;

                  return (
                    <Link
                      href={`/calendar/day/${day.date
                        .toISOString()
                        .substring(0, 10)}`}
                      key={day.date.toISOString()}
                      className={clsx(
                        'py-1 text-quot font-medium hover:bg-darkSkyBlue-20 focus:z-10',
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
                        dayIdx === 0 ? 'rounded-tl-lg' : '',
                        dayIdx === 6 ? 'rounded-tr-lg' : '',
                        monthDataForFirstCalendar.length - 7 == dayIdx
                          ? 'rounded-bl-lg'
                          : '',
                        monthDataForFirstCalendar.length - 1 == dayIdx
                          ? 'rounded-br-lg'
                          : '',
                      )}
                    >
                      {hasEventOnThisDay && !day.isSelected ? (
                        <div
                          className={clsx(
                            'relative z-20 w-1.5 h-1.5 ml-auto mr-1 rounded flex',
                            day.isCurrentMonth
                              ? 'bg-green-100'
                              : 'bg-darkSkyBlue-40',
                          )}
                        />
                      ) : (
                        <div className="relative z-20 w-1.5 h-1.5 ml-auto mr-1 rounded flex" />
                      )}
                      <time
                        dateTime={day.date.toISOString().substring(0, 10)}
                        className={clsx(
                          'mx-auto w-6 h-6 p-0 flex items-center justify-center rounded-full',
                          day.isSelected &&
                            'rounded-full bg-green-90 text-white',
                          !day.isSelected && day.isToday && 'text-green-100',
                        )}
                      >
                        {day.date.getDate()}
                      </time>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="w-1/2 flex-none py-6 px-2 hidden tablet:pl-5 tablet:block">
              <div className="flex items-center text-center text-darkSkyBlue-90 mx-1.5">
                <button
                  type="button"
                  onClick={() => prevMonth()}
                  className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-darkSkyBlue-60 tablet:hidden"
                >
                  <span className="sr-only">Previous month</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex-auto font-semibold text-parS text-darkSkyBlue-100">{`${monthName(
                  dateForSecondCalendar,
                )} ${dateForSecondCalendar.getFullYear()}`}</div>
                <button
                  type="button"
                  onClick={() => nextMonth()}
                  className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-darkSkyBlue-60"
                >
                  <span className="sr-only">Next month</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 grid grid-cols-7 text-center text-quot leading-6 text-darkSkyBlue-60 font-medium">
                {weekDayNames.map((name) => (
                  <div key={`day ${name}`}>{name.charAt(0)}</div>
                ))}
              </div>
              <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-stroke text-parS shadow ring-1 ring-mystic-100">
                {monthDataForSecondCalendar.map((day, dayIdx) => {
                  const hasEventOnThisDay =
                    schedules.filter((x) =>
                      areSameDates(x.startDateTime, day.date),
                    ).length > 0;

                  return (
                    <Link
                      href={`/calendar/day/${day.date
                        .toISOString()
                        .substring(0, 10)}`}
                      key={day.date.toISOString()}
                      className={clsx(
                        'py-1 text-quot font-medium hover:bg-darkSkyBlue-20 focus:z-10',
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
                        dayIdx === 0 ? 'rounded-tl-lg' : '',
                        dayIdx === 6 ? 'rounded-tr-lg' : '',

                        monthDataForSecondCalendar.length - 7 == dayIdx
                          ? 'rounded-bl-lg'
                          : '',
                        monthDataForSecondCalendar.length - 1 == dayIdx
                          ? 'rounded-br-lg'
                          : '',
                      )}
                    >
                      {hasEventOnThisDay && !day.isSelected ? (
                        <div
                          className={clsx(
                            'relative z-20 w-1.5 h-1.5 ml-auto mr-1 rounded flex',
                            day.isCurrentMonth
                              ? 'bg-green-100'
                              : 'bg-darkSkyBlue-40',
                          )}
                        />
                      ) : (
                        <div className="relative z-20 w-1.5 h-1.5 ml-auto mr-1 rounded flex" />
                      )}
                      <time
                        dateTime={day.date.toISOString().substring(0, 10)}
                        className={clsx(
                          'mx-auto w-6 h-6 p-0 flex items-center justify-center rounded-full',
                          day.isSelected &&
                            'rounded-full bg-green-90 text-white',
                          !day.isSelected && day.isToday && 'text-green-100',
                        )}
                      >
                        {day.date.getDate()}
                      </time>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="px-4 tablet:px-6">
            <h3 className="text-parM text-darkSkyBlue-100 font-semibold mb-4">
              Upcoming lessons
            </h3>
            <div className="flex flex-col">
              {filteredScheduls().map((schedule) => (
                <div
                  key={`schedule ${schedule.id}}`}
                  className="flex flex-col tablet:flex-row tablet:items-center pb-3 tablet:py-4 mb-4 tablet:mb-6 border-b border-stroke"
                >
                  <div className="text-quot text-darkSkyBlue-60 font-medium mb-1 ml-0 tablet:my-0 tablet:w-[100px]">
                    {`${weekDayNames[
                      getDayOfWeek(schedule.startDateTime)
                    ].substring(0, 3)}, ${monthName(
                      schedule.startDateTime,
                    ).substring(0, 3)} ${schedule.startDateTime.getDate()}`}
                  </div>
                  <div className="text-parS font-semibold text-darkSkyBlue-100">
                    {`${schedule.student?.firstName || schedule.group?.title} ${
                      schedule.student?.lastName || ''
                    }`}
                  </div>
                  <div className="text-parS text-darkSkyBlue-60 font-medium tablet:ml-auto">
                    {`${dateFormatter.format(
                      schedule.startDateTime,
                    )} - ${dateFormatter.format(schedule.endDateTime)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
