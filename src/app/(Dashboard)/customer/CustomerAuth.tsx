import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function CustomerAuth({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect('/SignIn');
    }

    if (session.user.role !== 'Customer') {
        redirect('/unauth');
    }

    return <>{children}</>;
}