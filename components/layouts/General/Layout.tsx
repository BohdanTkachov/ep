import { GeneralHeader } from './Header';

import type { Page } from '~/types';
import type { FC, ReactNode } from 'react';

export type GeneralLayoutProps = {
  children: ReactNode;
  currantPage: Page;
};

export const GeneralLayout: FC<GeneralLayoutProps> = ({
  children,
  currantPage,
}) => {
  return (
    <>
      <div className="w-full sticky top-0 z-50">
        <div className="w-full desktop:w-[1200px] mx-auto bg-white">
          <GeneralHeader currantPage={currantPage} />
        </div>
        <div className="border-b border-stroke" />
      </div>

      <div className="max-h-screen overflow-y-auto">{children}</div>
    </>
  );
};
