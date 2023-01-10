import Link from 'next/link';
import Router from 'next/router';

import ChevronLeft from '~/public/IconsSet/chevron-left.svg';
import ChevronRight from '~/public/IconsSet/chevron-right.svg';
import { monthName } from '~/utils/calendar/calendar';

import type { CalendarHeaderProps } from '~/types';
import type { FC } from 'react';

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  currentDate,
  showArrows = true,
  title,
  viewType,
}) => {
  const nextDay = new Date(currentDate.toISOString());
  nextDay.setDate(nextDay.getDate() + 1);

  let prevDay = new Date(currentDate.toISOString());
  if (prevDay.getDate() === 1) {
    prevDay = new Date(prevDay.getFullYear(), prevDay.getMonth(), 0);
  } else {
    prevDay.setDate(prevDay.getDate() - 1);
  }

  return (
    <header className="border-b border-stroke tablet:rounded-t-xl bg-[#FCFDFD]">
      <div className="flex flex-row justify-between py-4 px-4 tablet:pl-6">
        {title ? (
          <h1 className="text-parL font-semibold text-green-100 my-auto">
            {title}
          </h1>
        ) : (
          <h1 className="text-parL font-semibold text-green-100 my-auto">
            {currentDate.getDate()}{' '}
            <span className="inline tablet:hidden desktop:inline">
              {monthName(currentDate)}
            </span>
            <span className="hidden tablet:inline desktop:hidden">
              {monthName(currentDate).substring(0, 3)}
            </span>
          </h1>
        )}
        <div className="flex flex-row">
          {showArrows ? (
            <div className="flex flex-row">
              <Link
                href={`/calendar/day/${prevDay.toISOString().substring(0, 10)}`}
                className="flex justify-center w-[30px] h-[30px] rounded-l-md border border-stroke hover:bg-[#F9FAFB] focus:border-green-80"
              >
                <ChevronLeft className="text-darkSkyBlue-80 w-4 font-bold my-auto" />
              </Link>
              <Link
                href={`/calendar/day/${new Date()
                  .toISOString()
                  .substring(0, 10)}`}
                className="hidden tablet:flex justify-center tablet:w-[106px] items-center w-0 h-0 tablet:h-[30px] border-t border-b text-quot font-medium text-darkSkyBlue-80 border-stroke hover:bg-[#F9FAFB] focus:border-green-80"
              >
                Today
              </Link>
              <Link
                href={`/calendar/day/${nextDay.toISOString().substring(0, 10)}`}
                className="flex justify-center w-[30px] h-[30px] rounded-r-md border border-stroke mr-4 hover:bg-[#F9FAFB] focus:border-green-80"
              >
                <ChevronRight className="text-darkSkyBlue-80 w-4 font-bold my-auto" />
              </Link>
            </div>
          ) : null}
          <select
            name="CalendarTypeSelector"
            id="typeSelect"
            className="hidden tablet:flex border border-stroke rounded-md text-quot font-medium text-darkSkyBlue-80 h-[30px] pl-4 pr-10 py-0 items-center"
            value={viewType}
            onChange={(e) => {
              Router.push(
                `/calendar/${e.target.value}/${currentDate
                  .toISOString()
                  .substring(0, 10)}`,
              );
            }}
          >
            <option
              className="font-normal hover:bg-[#F3F6F7] hover:text-darkSkyBlue-100"
              value="day"
            >
              Daily view
            </option>
            <option
              className="py-2 font-normal hover:bg-[#F3F6F7] hover:text-darkSkyBlue-100"
              value="week"
            >
              Weekly view
            </option>
            <option
              className="py-2 font-normal hover:bg-[#F3F6F7] hover:text-darkSkyBlue-100"
              value="month"
            >
              Monthly view
            </option>
            <option
              className="py-2 font-normal hover:bg-[#F3F6F7] hover:text-darkSkyBlue-100"
              value="double"
            >
              Double view
            </option>
          </select>
          <div className="hidden tablet:flex w-[1px] h-[30px] border-l border-stroke mx-4" />

          <button className="hidden tablet:flex text-quot font-medium h-[30px] px-6 rounded-md text-white bg-green-90 items-center hover:bg-green-100">
            <span className="text-parL mr-[11px]">+</span>
            Create lesson
          </button>

          <button className="tablet:hidden flex flex-row space-x-0.5 justify-center w-[30px] h-[30px] rounded-md border border-stroke hover:bg-[#F9FAFB] focus:border-green-80">
            <div className="w-1 h-1 rounded-full bg-darkSkyBlue-80 my-auto"></div>
            <div className="w-1 h-1 rounded-full bg-darkSkyBlue-80 my-auto"></div>
            <div className="w-1 h-1 rounded-full bg-darkSkyBlue-80 my-auto"></div>
          </button>
        </div>
      </div>
    </header>
  );
};
