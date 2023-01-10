import Link from 'next/link';

import clsx from 'clsx';

import AccountImage from '~/public/AccountImage.svg';
import Logo from '~/public/Favicon.svg';
import CalendarIcon from '~/public/IconsSet/calendar-check-01.svg';
import NotificationIcon from '~/public/IconsSet/notification-box.svg';

import type { Page } from '~/types';
import type { FC } from 'react';

export type GeneralHeaderProps = {
  currantPage: Page;
};

const links: Array<{ id: Page; href: string; name: string }> = [
  { id: 'calendar', href: '/calendar', name: 'Calendar' },
  { id: 'students', href: '/students', name: 'Students' },
  { id: 'materials', href: '/materials', name: 'Materials' },
  { id: 'settings', href: '/settings', name: 'Settings' },
];

export const GeneralHeader: FC<GeneralHeaderProps> = ({ currantPage }) => {
  return (
    <header className="flex justify-center px-4 py-2 tablet:px-6 bg-white bg-opacity-80">
      <nav className="flex tablet:gap-6 desktop:gap-8 items-center w-full">
        <Link
          href={'/'}
          className="focus:border-green-80 focus:ring-green-80 focus:ring-2 focus:outline-none"
        >
          <Logo className="w-6 tablet:w-7" />
        </Link>
        <div className="hidden tablet:flex space-x-8 font-medium  text-quot desktop:text-parS">
          {links.map(({ id, name, href }) => {
            const isCurrent = id === currantPage;
            return (
              <Link
                key={id}
                className={clsx(
                  'py-2 px-3 rounded-md focus:border-green-80 focus:ring-green-80 focus:ring-2 focus:outline-none',
                  isCurrent
                    ? 'bg-mystic-100 text-darkSkyBlue-90'
                    : 'bg-white hover:bg-darkSkyBlue-20 text-darkSkyBlue-60',
                )}
                href={href}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href={'#'}
          className="w-0 tablet:w-8 tablet:h-8 hidden h-0 rounded-full tablet:flex flex-col tablet:border border-stroke justify-center items-center hover:bg-darkSkyBlue-20 focus:border-green-80 focus:ring-green-80 focus:ring-2 focus:outline-none"
        >
          <CalendarIcon className="w-4 text-darkSkyBlue-80" />
        </Link>
        <Link
          href={'#'}
          className="w-8 tablet:flex h-8 hidden rounded-full tablet:border border-stroke flex-col justify-center items-center hover:bg-darkSkyBlue-20 focus:border-green-80 focus:ring-green-80 focus:ring-2 focus:outline-none"
        >
          <NotificationIcon className="w-4 text-darkSkyBlue-80" />
        </Link>
        <Link
          href={'#'}
          className="w-7 h-7 rounded-full border solid border-stroke overflow-hidden tablet:w-8 tablet:h-8 focus:border-green-80 focus:ring-green-80 focus:ring-2 focus:outline-none"
        >
          <AccountImage />
        </Link>
      </div>
    </header>
  );
};
