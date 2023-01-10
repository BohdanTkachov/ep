import React from 'react';
import clsx from 'clsx';

import MarkImg from '~/public/LoginImages/Mark.svg';

import { InputValidationMessage } from '../tooltips/InputValidationMessage';

export type InputTextProps = {
  label: string;
  name?: string;
  id?: string;
  errorText?: string;
  className?: string;
};

export const InputText: React.FC<InputTextProps> = React.forwardRef<
  HTMLInputElement,
  InputTextProps
>(
  (
    {
      label,
      name = 'text',
      id = 'text',
      errorText,
      className,
      ...restInputProps
    },
    ref,
  ) => {
    return (
      <div className={clsx(className)}>
        <label
          htmlFor={id}
          className="text-parS font-medium text-darkSkyBlue-100 mb-1 block"
        >
          {label}
        </label>
        <input
          ref={ref}
          type="text"
          id={id}
          name={name}
          className={clsx(
            'block border',
            'w-full rounded-md focus:border-green-80 focus:ring-green-80 focus:ring-1 focus:outline-none py-2 px-3 autofill:text-parM text-parM',
            errorText ? 'border-error-80' : 'border-stroke',
          )}
          {...restInputProps}
        />
        {errorText ? (
          <MarkImg className="float-right w-5 h-5 -mt-8 mr-4 text-[#EF4444]" />
        ) : null}
        {errorText ? (
          <div className="flex justify-end">
            <InputValidationMessage
              markerPosition="top-right"
              className=""
              text={errorText}
            />
          </div>
        ) : null}
      </div>
    );
  },
);

InputText.displayName = 'InputText';
