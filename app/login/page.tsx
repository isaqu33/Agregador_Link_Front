import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import LoginClient from './login-client';

export default async function LoginPage() {
  if (await auth()) redirect('/costumer');
  return <LoginClient />;
}
