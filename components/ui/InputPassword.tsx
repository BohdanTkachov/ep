import React, { useState } from 'react';
import clsx from 'clsx';

import EyeIcon from '~/public/IconsSet/eye.svg';
import EyeOffIcon from '~/public/IconsSet/eye-off.svg';
import MarkImg from '~/public/LoginImages/Mark.svg';

import { InputValidationMessage } from '../tooltips/InputValidationMessage';

export type InputPasswordProps = {
  label: string;
  name?: string;
  id?: string;
  errorText?: string;
  className?: string;
};

export const InputPassword: React.FC<InputPasswordProps> = React.forwardRef<
  HTMLInputElement,
  InputPasswordProps
>(
  (
    {
      label,
      name = 'password',
      id = 'password',
      errorText,
      className,
      ...restInputProps
    },
    ref,
  ) => {
    const [pswInputType, setPswInputType] = useState<'password' | 'text'>(
      'password',
    );

    const changePswInputType = (): void => {
      pswInputType === 'password'
        ? setPswInputType('text')
        : setPswInputType('password');
    };

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
          type={pswInputType}
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
          <MarkImg className="float-right w-5 h-5 -mt-8 mr-4 z-10 text-[#EF4444]" />
        ) : (
          <button
            type="button"
            className="w-5 h-5 float-right relative -mt-8 mr-4 rounded-full text-darkSkyBlue-40 hover:text-darkSkyBlue-60 focus-visible:border-green-80 focus-visible:ring-green-80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={changePswInputType}
          >
            {pswInputType === 'password' ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
        {errorText ? (
          <div className="flex justify-end">
            <InputValidationMessage
              markerPosition="top-right"
              text={errorText}
              className="max-w-[280px] tablet:max-w-full"
            />
          </div>
        ) : null}
      </div>
    );
  },
);

InputPassword.displayName = 'InputPassword';
