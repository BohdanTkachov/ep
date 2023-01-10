import { useState } from 'react';
import clsx from 'clsx';

import type { FC } from 'react';

export type UserType = 'teacher' | 'student';

export type AccountTypeSwitchProps = {
  id?: string;
  className?: string;
  onChange: (user: UserType) => void;
  initialUser: UserType;
};

export const AccountTypeSwitch: FC<AccountTypeSwitchProps> = ({
  id,
  className,
  onChange,
  initialUser,
}) => {
  const [userType, setUserType] = useState<UserType>(initialUser);

  const onSelectHandler = (user: UserType) => {
    setUserType(user);
    onChange(user);
  };

  return (
    <div
      id={id}
      className={clsx(
        className,
        'flex tablet:w-[280px] bg-mystic-100 text-quot desktop:text-parS p-0.5 text-center rounded-lg text-darkSkyBlue-100 font-medium overflow-visible',
      )}
    >
      <button
        type="button"
        onClick={() => onSelectHandler('teacher')}
        className={`w-1/2 py-2 tablet:px-10 rounded-md focus:border-green-80 focus:ring-green-80 focus:ring-2 focus:outline-none mr-1 ${
          userType === 'teacher' ? 'bg-white' : ''
        }`}
      >
        Teacher
      </button>
      <button
        type="button"
        onClick={() => onSelectHandler('student')}
        className={`py-2 w-1/2 tablet:px-10 rounded-md focus:border-green-80 focus:ring-green-80 focus:ring-2 focus:outline-none ${
          userType === 'student' ? 'bg-white' : ''
        }`}
      >
        Student
      </button>
    </div>
  );
};
AccountTypeSwitch.displayName = 'AccountTypeSwitch';
