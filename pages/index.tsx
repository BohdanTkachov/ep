import { signIn } from 'next-auth/react';

import type { NextPage } from 'next';

const Index: NextPage = () => {
  return (
    <div>
      <h1 className="text-blue-100 text-dispL text">
        Hello World (prod deploy 9)
        <button
          onClick={() => {
            signIn();
          }}
        >
          Login
        </button>
      </h1>
    </div>
  );
};

export default Index;
