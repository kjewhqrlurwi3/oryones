import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Construct the URL for the API endpoint
  const verifyTokenUrl = new URL('/api/auth/verify-token', request.url);

  // Check if the request is for the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const response = await fetch(verifyTokenUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.isValid) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Middleware: Token verification fetch failed', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check if the request is for login/signup when user is already authenticated
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
    if (token) {
      try {
        const response = await fetch(verifyTokenUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.isValid) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.next();
        }
      } catch (error) {
        console.error('Middleware: Existing token verification fetch failed', error);
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}; 