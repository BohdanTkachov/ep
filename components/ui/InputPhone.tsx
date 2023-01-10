import React, { useImperativeHandle, useRef, useState } from 'react';
import { Listbox } from '@headlessui/react';
import clsx from 'clsx';

import CheckIcon from '~/public/IconsSet/check.svg';
import ChevronDownIcon from '~/public/IconsSet/chevron-down.svg';
import ChevronUpIcon from '~/public/IconsSet/chevron-up.svg';
import MarkImg from '~/public/LoginImages/Mark.svg';
import { byDialCode, phoneCodes } from '~/utils/phone/codes';

import { InputValidationMessage } from '../tooltips/InputValidationMessage';

import type { ChangeHandler } from 'react-hook-form';

export type InputPhoneProps = {
  defaultCountryCode?: string;
  label: string;
  name?: string;
  id?: string;
  errorText?: string;
  className?: string;
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
};

export const InputPhone: React.FC<InputPhoneProps> = React.forwardRef<
  HTMLInputElement,
  InputPhoneProps
>(
  (
    {
      label,
      name = 'tel',
      id = 'telephone',
      errorText,
      className,
      onChange,
      onBlur,
      ...restInputProps
    },
    ref,
  ) => {
    const [country, setCountry] = useState(phoneCodes[0]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div className={clsx(className)}>
        <label
          htmlFor={id}
          className="text-parS font-medium text-darkSkyBlue-100 mb-1 block"
        >
          {label}
        </label>
        <div
          className={clsx(
            'flex relative top-full rounded-md focus-within:ring-green-90 ring-1 ring-transparent border focus-within:border-green-90 ',
            errorText ? 'border-error-80' : 'border-stroke',
          )}
        >
          <Listbox
            name="phone"
            value={country}
            onChange={(country) => {
              setCountry(country);
              if (inputRef.current) {
                inputRef.current.value = country.dial_code;
                onChange && onChange({ target: inputRef.current });
              }
            }}
          >
            {({ open }) => {
              return (
                <>
                  <Listbox.Button className="flex items-center gap-2 px-3 absolute top-0 left-0 h-full w-[70px] text-darkSkyBlue-90 outline-none bg-transparent focus-visible:bg-green-10 rounded-tl-md rounded-bl-md">
                    {country.code}
                    {open ? (
                      <ChevronUpIcon className="w-[20px] h-[20px]" />
                    ) : (
                      <ChevronDownIcon className="w-[20px] h-[20px]" />
                    )}
                  </Listbox.Button>
                  <Listbox.Options className="absolute top-full left-0 w-[140px] h-[224px] rounded border solid border-stroke bg-white shadow outline-none overflow-auto">
                    {phoneCodes.map((code) => (
                      <Listbox.Option key={code.code} value={code}>
                        {({ active, selected }) => {
                          return (
                            <div
                              className={clsx(
                                'p-3 cursor-pointer text-parS',
                                active && 'bg-green-10',
                              )}
                            >
                              <div className="flex justify-between item-ce gap-1">
                                <div>
                                  <span
                                    className={clsx(
                                      selected && 'font-semibold',
                                    )}
                                  >
                                    {code.code}
                                  </span>{' '}
                                  <span className="text-[#6B7280]">
                                    {code.dial_code}
                                  </span>
                                </div>
                                {selected ? (
                                  <CheckIcon className="text-green-100 w-[20px] h-[20px]" />
                                ) : null}
                              </div>
                            </div>
                          );
                        }}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </>
              );
            }}
          </Listbox>
          <input
            ref={inputRef}
            type="tel"
            inputMode="tel"
            onPaste={(event) => {
              const pastedData = event.clipboardData.getData('text');
              const matchedCountryPhoneCode = phoneCodes.find((item) =>
                pastedData.startsWith(item.dial_code),
              );

              if (matchedCountryPhoneCode) {
                setCountry(matchedCountryPhoneCode);
              }
            }}
            defaultValue={phoneCodes[0].dial_code}
            onBlur={(event) => {
              onBlur && onBlur({ target: event.target });
            }}
            onChange={(event) => {
              onChange && onChange({ target: event.target });

              if (inputRef.current) {
                inputRef.current.value = event.target.value;
              }

              const matchedCountryPhoneCode = byDialCode[event.target.value];

              if (matchedCountryPhoneCode) {
                setCountry({
                  dial_code: event.target.value,
                  ...matchedCountryPhoneCode,
                });
              }
            }}
            id={id}
            name={name}
            className={clsx(
              'block border',
              'w-full rounded-md py-2 pl-[70px] pr-3 autofill:text-parM text-parM outline-none border-0 focus:border-transparent focus:ring-transparent',
            )}
            {...restInputProps}
          />
        </div>

        {errorText ? (
          <MarkImg className="relative float-right w-5 h-5 -mt-8 mr-4 text-[#EF4444]" />
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

InputPhone.displayName = 'InputPhone';
