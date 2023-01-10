import Head from 'next/head';
import Link from 'next/link';

import { useForm } from 'react-hook-form';

import { AuthorizationLayout } from '~/components/layouts/authorization/Layout';
import { InputEmail } from '~/components/ui/InputEmail';
import { SubmitButton } from '~/components/ui/SubmitButton';
import { getEmailRegex } from '~/utils/regex';

import type { RegisterOptions } from 'react-hook-form';

const PasswordRecovery = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({ shouldFocusError: false });
  const handleRegistration = (data: object) => {
    console.log(data);
  };

  const handleError = (errors: object) => {
    console.warn(errors);
  };
  const registerOptions: Record<'email', RegisterOptions> = {
    email: {
      required: 'Email is required',
      pattern: {
        value: getEmailRegex(),
        message: 'Please enter a valid email',
      },
    },
  };

  return (
    <>
      <Head>
        <title>Recover password</title>
      </Head>
      <AuthorizationLayout>
        <h1 className="font-semibold text-parL text-darkSkyBlue-100 mb-1 tablet:mb-2 desktop:mb-4 tablet:text-dispS1">
          Forgot password?
        </h1>
        <p className="text-quot font-medium text-darkSkyBlue-90 tablet:text-parM mb-8">
          Enter your email and we will send you a reset link
        </p>
        <form
          className="mb-6 desktop:mb-36"
          method="post"
          onSubmit={handleSubmit(handleRegistration, handleError)}
          noValidate
        >
          <InputEmail
            {...register('email', registerOptions.email)}
            label="Email address"
            errorText={errors?.email?.message?.toString()}
            className="mb-16 tablet:mb-56 desktop:mb-12"
          />
          <SubmitButton text="Submit" />
        </form>
        <div className="text-center text-darkSkyBlue-90 text-quot tablet:text-parM font-medium mb-8">
          Remember password?{' '}
          <Link className="ml-1.5 text-green-100" href={'/login'}>
            Log in
          </Link>
        </div>
      </AuthorizationLayout>
    </>
  );
};

export default PasswordRecovery;
