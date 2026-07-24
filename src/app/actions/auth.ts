'use server'

import { checkPassword, setAdminCookie, removeAdminCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  if (!password) {
    return { success: false, error: 'Şifre gerekli' }
  }

  const isValid = checkPassword(password)
  if (!isValid) {
    return { success: false, error: 'Geçersiz şifre' }
  }

  await setAdminCookie()
  return { success: true }
}

export async function logoutAction() {
  await removeAdminCookie()
  redirect('/admin/login')
}
