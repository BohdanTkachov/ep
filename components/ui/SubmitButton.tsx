import clsx from 'clsx';

import type { FC } from 'react';

export type SubmitButtonProps = {
  text: string;
  className?: string;
};

export const SubmitButton: FC<SubmitButtonProps> = ({ text, className }) => {
  return (
    <button
      type="submit"
      className={clsx(
        'bg-green-90 text-parS desktop:text-parM font-medium text-white w-full desktop:w-auto rounded-xl tablet:px-16 py-3 hover:bg-green-100',
        className,
      )}
    >
      {text}
    </button>
  );
};
