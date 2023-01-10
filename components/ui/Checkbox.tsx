import React from 'react';
import clsx from 'clsx';

import type { ReactNode } from 'react';

export type CheckboxProps = {
  name?: string;
  id?: string;
  children: ReactNode;
  className?: string;
  errorText?: string;
};

export const Checkbox: React.FC<CheckboxProps> = React.forwardRef<
  HTMLInputElement,
  CheckboxProps
>(
  (
    {
      name = 'agreement',
      id = 'agreement',
      children,
      className,
      ...restInputProps
    },
    ref,
  ) => {
    return (
      <>
        <div className={clsx(className)}>
          <label className="flex items-center gap-2">
            <input
              ref={ref}
              type="checkbox"
              id={id}
              name={name}
              {...restInputProps}
              className="rounded border-stroke shadow-sm focus:border-green-100 focus:ring focus:ring-green-100 focus:ring-opacity-50 focus:ring-offset-0 text-green-100"
            />
            <p className="text-quot tablet:text-parS font-medium text-[#374151]">
              {children}
            </p>
          </label>
        </div>
      </>
    );
  },
);
Checkbox.displayName = 'Checkbox';
