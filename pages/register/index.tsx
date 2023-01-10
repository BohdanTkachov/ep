import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { signIn } from 'next-auth/react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AccountTypeSwitch } from '~/components/ui/AccountTypeSwitch';
import { Checkbox } from '~/components/ui/Checkbox';
import { InputEmail } from '~/components/ui/InputEmail';
import { InputPassword } from '~/components/ui/InputPassword';
import { InputPhone } from '~/components/ui/InputPhone';
import { InputText } from '~/components/ui/InputText';
import { SubmitButton } from '~/components/ui/SubmitButton';
import { byDialCode } from '~/utils/phone/codes';
import { getEmailRegex, getPswRegex } from '~/utils/regex';

import { AuthorizationLayout } from '../../components/layouts/authorization/Layout';

import type { UserType } from '~/components/ui/AccountTypeSwitch';
import type { RegisterOptions } from 'react-hook-form';

export type RegisterFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  agreement: boolean;
};

export type RegisterResponseType = {
  acess_token: string;
  id: number;
  username: string;
  currantRoleId: number;
};

const RegisterPage = () => {
  const [userType, setUserType] = useState<UserType>('teacher');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({ shouldFocusError: false });

  const handleRegistration = (data: RegisterFields) => {
    const requestBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      roleId: userType === 'teacher' ? 1 : 2,
      password: data.password,
      passwordConfirm: data.password,
    };

    fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return Promise.reject();
      })
      .then((val: RegisterResponseType) => {
        signIn('credentials', {
          email: val.username,
          password: data.password,
          redirect: false,
        }).then((res) => {
          if (!res?.error && res?.status === 200 && res.ok) {
            Router.push(
              `/calendar/day/${new Date().toISOString().substring(0, 10)}`,
            );
          }
        });
      });
  };

  const handleError = (errors: object) => {
    console.warn(errors);
  };

  const registerOptions: Record<
    'password' | 'email' | 'firstName' | 'lastName' | 'phone' | 'agreement',
    RegisterOptions
  > = {
    email: {
      required: 'Email is required',
      pattern: {
        value: getEmailRegex(),
        message: 'Please enter a valid email',
      },
    },
    password: {
      required: 'Password is required',
      pattern: {
        value: getPswRegex(),
        message:
          'At least 8 characters, one uppercase, one number, one symbol [#$&]',
      },
    },
    firstName: {
      required: 'First name is required',
    },
    lastName: {
      required: 'Last name is required',
    },
    phone: {
      validate: (val: string) => {
        // if input is empty or contains only a country code
        if (!val || Boolean(byDialCode[val])) {
          return 'Phone is required';
        }

        return true;
      },
      pattern: {
        value: /^\+\d+$/,
        message: 'Invalid phone number',
      },
    },
    agreement: {
      required: 'You must agree with our rules',
    },
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <AuthorizationLayout>
        <form
          method="post"
          onSubmit={handleSubmit(handleRegistration, handleError)}
          className="mb-6 tablet:mb-8 desktop:mb-10"
          noValidate
        >
          <p className="text-quot font-medium text-darkSkyBlue-90 mb-1 tablet:mb-6 tablet:text-parM">
            Welcome to edgeek!
          </p>
          <div className="flex flex-col tablet:flex-col-reverse">
            <h2 className="text-parL font-semibold text-darkSkyBlue-100 mb-6 tablet:text-dispS1">
              Create new account
            </h2>
            <AccountTypeSwitch
              onChange={(userType) => setUserType(userType)}
              initialUser="teacher"
              className="mb-8"
            />
          </div>
          <div className="space-y-4 tablet:space-y-6 mb-8">
            <div className="flex flex-col tablet:flex-row gap-4 tablet:gap-6">
              <InputText
                {...register('firstName', registerOptions.firstName)}
                id="firstName"
                label="First name"
                errorText={errors?.firstName?.message?.toString()}
                className="w-full"
              />

              <InputText
                {...register('lastName', registerOptions.lastName)}
                id="lastName"
                label="Last name"
                errorText={errors?.lastName?.message?.toString()}
                className="w-full"
              />
            </div>
            <InputPhone
              label="Phone number"
              {...register('phone', registerOptions.phone)}
              errorText={errors?.phone?.message?.toString()}
            />
            <InputEmail
              {...register('email', registerOptions.email)}
              label="Email address"
              errorText={errors?.email?.message?.toString()}
            />
            <InputPassword
              {...register('password', registerOptions.password)}
              label="Password"
              errorText={errors?.password?.message?.toString()}
            />
          </div>
          <Checkbox
            {...register('agreement', registerOptions.agreement)}
            className="mb-10"
          >
            I accept user{' '}
            <Link
              className="text-green-100 outline-none focus:outline-green-100"
              href={'#'}
              target="_blank"
            >
              agreement
            </Link>{' '}
            and{' '}
            <Link
              className="text-green-100 outline-none focus:outline-green-100"
              href={'#'}
              target="_blank"
            >
              privacy policy
            </Link>
          </Checkbox>

          <SubmitButton text="Sign up" />
        </form>
        <div className="text-center text-darkSkyBlue-90 text-quot tablet:text-parM font-medium mb-8">
          Already have an account?{' '}
          <Link className="text-green-100" href={'/login'}>
            Log in
          </Link>
        </div>
      </AuthorizationLayout>
    </>
  );
};

export default RegisterPage;
