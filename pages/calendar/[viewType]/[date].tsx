/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getToken } from 'next-auth/jwt';

import { CalendarDaily } from '~/components/calendar/Daliy';
import { CalendarDouble } from '~/components/calendar/Double';
import { CalendarMonthly } from '~/components/calendar/Monthly';
import { CalendarWeekly } from '~/components/calendar/Weekly';
import { GeneralLayout } from '~/components/layouts/General/Layout';

import type { ScheduleResponse } from '~/types';
import type { GetServerSideProps } from 'next';
import type { FC } from 'react';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = await getToken({
    req: ctx.req,
  });

  if (token?.token) {
    let viewType = Array.isArray(ctx.query.viewType)
      ? ctx.query.viewType[0]
      : ctx.query.viewType;

    if (
      !viewType &&
      !(
        viewType == 'day' ||
        viewType == 'week' ||
        viewType == 'month' ||
        viewType == 'double'
      )
    ) {
      viewType = 'day';
    }

    let dateStr = Array.isArray(ctx.query.date)
      ? ctx.query.date[0]
      : ctx.query.date;

    if (!dateStr) {
      dateStr = new Date().toISOString().substring(0, 10);
    }

    const dateFrom = new Date(dateStr);
    const dateTo = new Date(dateStr);

    switch (viewType) {
      case 'day': {
        dateFrom.setDate(dateFrom.getDate() - 1);
        dateTo.setDate(dateTo.getDate() + 1);
        break;
      }
      case 'week': {
        dateFrom.setDate(dateFrom.getDate() - 7);
        dateTo.setDate(dateTo.getDate() + 7);
        break;
      }
      case 'month': {
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        dateTo.setMonth(dateTo.getMonth() + 1);
        break;
      }
      case 'double': {
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        dateTo.setMonth(dateTo.getMonth() + 2);
        break;
      }
    }

    const response = await fetch('http://localhost:3001/schedules', {
      method: 'POST',
      body: JSON.stringify({
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
      }),
      headers: {
        'Content-Type': 'application/json',
        //@ts-ignore
        Authorization: `Bearer ${token?.token}`,
      },
    });

    let scheds: ScheduleResponse[] = [];

    if (response.ok) {
      scheds = (await response.json()).items;
    }

    const schedules = scheds.map((item: ScheduleResponse) => {
      return {
        ...item,
        startDateTime: new Date(item.startDateTime),
        endDateTime: new Date(item.endDateTime),
      };
    });

    return {
      props: { viewType: viewType, date: dateStr, schedules: schedules },
    };
  } else {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

export type CalendarProps = {
  date: string;
  viewType: 'day' | 'week' | 'month' | 'double';
  schedules: ScheduleResponse[];
};

const CalendarPage: FC<CalendarProps> = ({ date, viewType, schedules }) => {
  return (
    <>
      <GeneralLayout currantPage="calendar">
        {viewType === 'day' ? (
          <CalendarDaily
            twelveHoursFormat={true}
            dateString={date}
            className="desktop:w-[1200px] desktop:mx-auto"
            schedules={schedules}
            viewType={viewType}
          />
        ) : viewType === 'week' ? (
          <div>
            <CalendarWeekly
              twelveHoursFormat={true}
              dateString={date}
              className="desktop:w-[1200px] desktop:mx-auto tablet:flex hidden"
              schedules={schedules}
              viewType={viewType}
            />

            <CalendarDaily
              twelveHoursFormat={true}
              dateString={date}
              className="flex tablet:hidden"
              schedules={schedules}
              viewType={viewType}
            />
          </div>
        ) : viewType === 'month' ? (
          <CalendarMonthly
            twelveHoursFormat={true}
            dateString={date}
            className="desktop:w-[1200px] desktop:mx-auto"
            schedules={schedules}
            viewType={viewType}
          />
        ) : (
          <CalendarDouble
            twelveHoursFormat={true}
            dateString={date}
            className="desktop:w-[1200px] desktop:mx-auto"
            schedules={schedules}
            viewType={viewType}
          />
        )}
      </GeneralLayout>
    </>
  );
};

export default CalendarPage;
