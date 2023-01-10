import clsx from 'clsx';

import type { FC } from 'react';

export type InputValidationMessageProps = {
  className?: string;
  text: string;
  markerPosition: 'top-right' | 'top-left';
};

export const InputValidationMessage: FC<InputValidationMessageProps> = ({
  className,
  text,
  markerPosition,
}) => {
  return (
    <div className={clsx('absolute z-10 text-white', className)}>
      <div
        className={clsx(
          'w-0 h-0 border-l-[6px] border-l-transparent border-b-[6px] border-b-error-100 border-r-[6px] border-r-transparent',
          markerPosition === 'top-right' ? 'mr-5 ml-auto' : '',
          markerPosition === 'top-left' ? 'ml-1' : '',
        )}
      ></div>
      <div className="bg-error-100 rounded-sm py-1.5 px-2 font-medium text-quot">
        {text}
      </div>
    </div>
  );
};
