import clsx from 'clsx';

import ClockIcon from '~/public/IconsSet/clock.svg';

import type { ScheduleResponse } from '~/types';
import type { FC } from 'react';

export type ScheduleProps = {
  schedule: ScheduleResponse;
  isTwelveHoursTimeFormat: boolean;
  className: string;
};

export const Schedule: FC<ScheduleProps> = ({
  schedule,
  isTwelveHoursTimeFormat,
  className,
}) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: isTwelveHoursTimeFormat,
  };

  return (
    <div className={clsx('font-medium rounded-xl py-3 px-4', className)}>
      <div className="text-parM">
        {schedule.student.firstName || schedule.group.title}
      </div>
      <div className="flex flex-row items-center text-parS">
        <ClockIcon className="w-[13px] h-[13px] text-darkSkyBlue-100 mr-2" />
        <time dateTime={schedule.startDateTime.toISOString()}>
          {new Intl.DateTimeFormat('en-US', options).format(
            schedule.startDateTime,
          )}
          {` - `}
          {new Intl.DateTimeFormat('en-US', options).format(
            schedule.endDateTime,
          )}
        </time>
      </div>
    </div>
  );
};
