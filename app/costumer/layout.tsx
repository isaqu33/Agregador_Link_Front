import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import ShellClient from './shell-client';

export default async function CostumerLayout({ children }: { children: React.ReactNode }) {
  if (!(await auth())) redirect('/login');
  return <ShellClient>{children}</ShellClient>;
}
