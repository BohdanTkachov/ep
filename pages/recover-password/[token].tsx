import Head from 'next/head';
import Link from 'next/link';

import { useForm } from 'react-hook-form';

import { AuthorizationLayout } from '~/components/layouts/authorization/Layout';
import { InputPassword } from '~/components/ui/InputPassword';
import { SubmitButton } from '~/components/ui/SubmitButton';
import { getPswRegex } from '~/utils/regex';

import type { GetServerSideProps } from 'next';
import type { RegisterOptions } from 'react-hook-form';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = Array.isArray(ctx.query.token)
    ? ctx.query.token[0]
    : ctx.query.token;
  return {
    props: {
      token: token,
    },
  };
};

const PasswordRecoveryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ password: string; cpassword: string }>({
    shouldFocusError: false,
  });
  const handleRegistration = (data: object) => {
    console.log(data);
  };

  const handleError = (errors: object) => {
    console.warn(errors);
  };

  const initialPassword = watch('password');
  const registerOptions: Record<'password' | 'cpassword', RegisterOptions> = {
    password: {
      required: 'Password is required',
      pattern: {
        value: getPswRegex(),
        message:
          'At least 8 characters, one uppercase, one number, one symbol [#$&]',
      },
    },
    cpassword: {
      required: 'Password is required',
      pattern: {
        value: getPswRegex(),
        message:
          'At least 8 characters, one uppercase, one number, one symbol [#$&]',
      },
      validate: (value: string) =>
        value === initialPassword || 'Password mismatch',
    },
  };

  return (
    <>
      <Head>
        <title>Recover password</title>
      </Head>
      <AuthorizationLayout>
        <h1 className=" tablet:text-dispS1 text-parL font-semibold text-darkSkyBlue-100 mb-1 tablet:mb-2 desktop:mb-4">
          Password recovery
        </h1>
        <p className="tablet:text-parM text-quot font-medium text-darkSkyBlue-90 mb-8">
          Create new password for your account
        </p>
        <form
          className="mb-6 desktop:mb-36"
          onSubmit={handleSubmit(handleRegistration, handleError)}
          method="post"
        >
          <div className="space-y-4 tablet:space-y-6 mb-16 tablet:mb-36 desktop:mb-12">
            <InputPassword
              label="New password"
              {...register('password', registerOptions.password)}
              errorText={errors?.password?.message?.toString()}
            />
            <InputPassword
              label="Confirm password"
              {...register('cpassword', registerOptions.cpassword)}
              errorText={errors?.cpassword?.message?.toString()}
            />
          </div>
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

export default PasswordRecoveryForm;
