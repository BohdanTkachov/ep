import Link from 'next/link';

import clsx from 'clsx';

import {
  areSameDates,
  getWeekDayNames,
  isToday,
  monthData,
  weekData,
} from '~/utils/calendar/calendar';

import { CalendarHeader } from './Headers/CalendarHeader';
import { Schedule } from './Schedule';

import type { CalendarProps } from '~/types';
import type { FC } from 'react';

export const CalendarMonthly: FC<CalendarProps> = ({
  dateString,
  className,
  schedules,
  twelveHoursFormat,
  viewType,
}) => {
  const weekDayNames = getWeekDayNames();

  const calendarDate = new Date(dateString);

  const days = monthData(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    calendarDate,
  );

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: twelveHoursFormat,
  });

  return (
    <div
      className={clsx(
        'flex max-h-full flex-col tablet:px-4 tablet:pt-4',
        className,
      )}
    >
      <div className="tablet:border tablet:border-stroke tablet: rounded-xl mb-6">
        <CalendarHeader currentDate={calendarDate} viewType={viewType} />
        <div className="shadow ring-1 ring-stroke ring-opacity-5 rounded-b-xl">
          <div className="grid grid-cols-7 gap-px border-b border-stroke text-center text-quot font-medium text-darkSkyBlue-100">
            {weekData(calendarDate).map((day, index) => (
              <div
                key={`day-header-${index}`}
                className={clsx(
                  'py-2  border-stroke m-0',
                  index == 6 ? '' : 'border-r',
                )}
              >
                <span className="inline tablet:hidden">
                  {weekDayNames[index].charAt(0)}
                </span>

                <span className="hidden tablet:inline">
                  {weekDayNames[index].substring(0, 3)}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-b-xl">
            <div
              className={`isolate grid w-full rounded-b-xl grid-cols-7 grid-rows-${
                days.length / 7
              } gap-px`}
            >
              {days.map((day, dayIndex) => {
                const filteredSchedules = schedules.filter((x) =>
                  areSameDates(x.startDateTime, day.date),
                );
                return (
                  <Link
                    href={`/calendar/day/${day.date
                      .toISOString()
                      .substring(0, 10)}`}
                    key={day.date.toISOString()}
                    className={clsx(
                      day.isCurrentMonth
                        ? 'bg-white hover:bg-[#EDF1F3]'
                        : 'bg-[#EDF1F3] hover:bg-darkSkyBlue-20',
                      !day.isSelected && day.isToday && 'text-green-100',
                      !day.isSelected &&
                        !day.isCurrentMonth &&
                        !day.isToday &&
                        'text-gray-500',
                      'flex flex-col items-center desktop:items-start pt-2 hover:bg-gray-100 focus:z-10 border-stroke pb-2.5 desktop:h-[116px]',
                      days.length - 7 == dayIndex ? 'rounded-bl-xl' : '',
                      days.length - 1 == dayIndex ? 'rounded-br-xl' : '',
                      days.length - 7 > dayIndex ? 'border-b' : '',
                      dayIndex % 7 == 6 ? '' : 'border-r',
                    )}
                  >
                    <div className="flex flex-col tablet:mr-2 tablet:ml-auto desktop:px-2 desktop:w-full desktop:mx-0 desktop:text-left">
                      <time
                        dateTime={day.date.toISOString()}
                        className={clsx(
                          areSameDates(calendarDate, day.date)
                            ? 'bg-green-100 text-white'
                            : '',
                          'mx-auto text-quot font-medium align-middle items-center flex h-6 w-6 text-center desktop:ml-0 justify-center rounded-full mb-1',
                        )}
                      >
                        {day.date.getDate()}
                      </time>
                      <div className="hidden desktop:flex flex-col items-center justify-center w-full text-darkSkyBlue-100">
                        {filteredSchedules.length <= 2 ? (
                          filteredSchedules.map((schedule, index) => {
                            return (
                              <div
                                key={`schedule ${schedule.id}`}
                                className={clsx(
                                  'flex flex-row justify-between w-full px-1.5 py-1 text-quot font-medium rounded mb-1',
                                  index % 2 == 1
                                    ? 'bg-purple-20 hover:bg-purple-40'
                                    : 'bg-blue-20 hover:bg-blue-40',
                                )}
                              >
                                <span>
                                  {schedule.student.firstName ||
                                    schedule.group.title}
                                </span>
                                <span>
                                  {dateFormatter.format(schedule.startDateTime)}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex flex-col w-full space-y-1">
                            <div className="flex flex-row justify-between w-full bg-green-40 px-1.5 py-1 text-quot font-medium rounded">
                              <span className="flex">
                                {schedules[0].student.firstName ||
                                  schedules[0].group.title}
                              </span>
                              <span className="flex">
                                {dateFormatter.format(
                                  schedules[0].startDateTime,
                                )}
                              </span>
                            </div>
                            <div className="flex flex-row w-full justify-center bg-green-40 px-1.5 py-1 text-quot font-medium rounded text-green-100 ">
                              {`+ ${filteredSchedules.length - 1} more lessons`}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="desktop:hidden flex flex-row items-center w-full space-x-1 justify-center">
                        {filteredSchedules
                          .slice(0, 2)
                          .map((schedule, index) => {
                            return (
                              <div
                                key={`${schedule.id}-${schedule.createdAt}`}
                                className={clsx(
                                  'w-2 h-2 rounded',
                                  day.isCurrentMonth && index % 2 === 0
                                    ? 'bg-purple-40'
                                    : '',
                                  day.isCurrentMonth && index % 2 === 1
                                    ? 'bg-yellow-40'
                                    : '',
                                  !day.isCurrentMonth
                                    ? 'bg-darkSkyBlue-20'
                                    : '',
                                )}
                              />
                            );
                          })}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 flex flex-col desktop:hidden space-y-4">
        <h3 className="text-parL text-darkSkyBlue-100 font-semibold">Today</h3>
        <div className="space-y-3 overflow-y-auto">
          {schedules
            .filter((sch) => isToday(sch.startDateTime))
            .sort(
              (x, y) => x.startDateTime.getTime() - y.startDateTime.getTime(),
            )
            .slice(0, 4)
            .map((schedule, index) => (
              <Schedule
                schedule={schedule}
                className={clsx(
                  index % 5 == 0 ? 'bg-yellow-20 hover:bg-yellow-40' : '',
                  index % 5 == 1 ? 'bg-orange-20 hover:bg-orange-40' : '',
                  index % 5 == 4 ? 'bg-purple-20 hover:bg-purple-40' : '',
                  index % 5 == 2 ? 'bg-green-20 hover:bg-green-40' : '',
                  index % 5 == 3 ? 'bg-blue-20 hover:bg-blue-40' : '',
                )}
                isTwelveHoursTimeFormat={twelveHoursFormat}
                key={`Schedule component ${schedule.id}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
