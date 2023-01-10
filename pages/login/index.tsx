import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { signIn } from 'next-auth/react';

import { useForm } from 'react-hook-form';

import { AuthorizationLayout } from '~/components/layouts/authorization/Layout';
import { InputEmail } from '~/components/ui/InputEmail';
import { InputPassword } from '~/components/ui/InputPassword';
import { SubmitButton } from '~/components/ui/SubmitButton';
import { getEmailRegex, getPswRegex } from '~/utils/regex';

import type { RegisterOptions } from 'react-hook-form';

export type LoginFields = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ shouldFocusError: false });

  const handleLogin = async (data: LoginFields) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!res?.error && res?.status === 200 && res.ok) {
      Router.push(`/calendar/day/${new Date().toISOString().substring(0, 10)}`);
    }
  };

  const handleError = (errors: object) => {
    console.warn(errors);
  };

  const registerOptions: Record<string, RegisterOptions> = {
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
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <AuthorizationLayout>
        <form
          method="post"
          onSubmit={handleSubmit(handleLogin, handleError)}
          className="mb-4 desktop:mb-16"
          noValidate
        >
          <p className="text-quot tablet:text-parM text-darkSkyBlue-90 font-medium mb-6">
            Welcome to edgeek!
          </p>
          <h2 className="text-parL tablet:text-dispS1 font-semibold mb-8 text-darkSkyBlue-100">
            Login with
          </h2>
          <div className="space-y-4 tablet:space-y-6 mb-4">
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
          <div className="text-right desktop:text-parS text-quot font-medium text-darkSkyBlue-90 mb-6">
            <Link href="/recover-password" className="hover:text-green-100">
              Forgot password?
            </Link>
          </div>
          <SubmitButton text="Log In" />
        </form>
        <div className="text-center text-darkSkyBlue-90 text-quot tablet:text-parM font-medium mb-8">
          Don’t have an account?{' '}
          <Link
            href={'/register'}
            className="text-green-100 hover:text-green-100"
          >
            Sign up
          </Link>
        </div>
      </AuthorizationLayout>
    </>
  );
};

export default LoginPage;
