import { Suspense, ReactNode } from 'react';
import AdminAuth from './AdminAuthantication';




export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <AdminAuth>{children}</AdminAuth>
                
         
        </Suspense>
    );
}