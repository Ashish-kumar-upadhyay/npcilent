import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/bestsellers');
  return null;
} 