import { Suspense, ReactNode } from 'react';
import CustomerAuth from './CustomerAuth';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <CustomerAuth>
                {children}
            </CustomerAuth>
        </Suspense>
    );
}