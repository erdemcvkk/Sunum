import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'admin_auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME)
  return authCookie?.value === 'authenticated'
}

export async function setAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  })
}

export async function removeAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export function checkPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}
