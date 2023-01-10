import Link from 'next/link';

import Logo from '~/public/Logo.svg';

import type { LayoutProps } from '~/types';
import type { FC } from 'react';

export const AuthorizationLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col h-auto desktop:flex-row desktop:h-screen">
        <div className="flex flex-col justify-between flex-grow shrink-0">
          <header className="bg-softGreen desktop:bg-white desktop:w-[calc(100%-640px)] mb-10 tablet:mb-12 desktop:mb-0">
            <div className="w-full tablet:w-[460px] mx-auto px-4 tablet:px-0 py-9 tablet:py-10 bg-[url('/LoginImages/SmallIlustration.svg')] tablet:bg-[url('/LoginImages/TabletIllustration.svg')] desktop:bg-none bg-no-repeat bg-right-top bg-contain">
              <Link
                href="/"
                className="focus:border-green-80 focus:ring-green-80 focus:ring-2 focus:ring-offset-2 focus:outline-none inline-block"
              >
                <Logo className="w-[104px] h-[32px]" />
              </Link>
            </div>
          </header>
          <main className="flex flex-col justify-center items-center flex-grow px-4 desktop:w-[calc(100%-640px)] tablet:px-10">
            <div className="w-full tablet:w-[460px]">{children}</div>
          </main>
        </div>
        <aside className="hidden desktop:block desktop:fixed top-0 right-0 h-full bg-softGreen w-[640px] p-10">
          <div className="h-full bg-[url('/LoginImages/BigIlustration.svg')] bg-no-repeat bg-center bg-contain"></div>
        </aside>
      </div>
    </>
  );
};
