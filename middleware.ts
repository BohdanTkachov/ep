import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

import type { NextRequest } from 'next/server';

// eslint-disable-next-line import/no-default-export
export default withAuth(
  function middleware(req: NextRequest) {
    // return NextResponse
    return NextResponse.rewrite(new URL('/calendar', req.url));
  },
  {
    callbacks: {
      authorized({ token }) {
        return token?.password != undefined && token?.password != '';
      },
    },
  },
);

export const config = { matcher: ['/calendar'] };
