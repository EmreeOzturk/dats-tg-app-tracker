import { Suspense } from 'react';
import UserTable from '@/components/dashboard/user-table';
import { redirect } from "next/navigation";
import { verifyAuth } from '@/lib/verifyUser';
import LogoutButton from '@/components/dashboard/logout-button';
export default async function DashboardPage() {
    const user = await verifyAuth();
    if (!user) {
        redirect("/");
    }

    return (
        <div className="container mx-auto py-10">
           <div className='flex items-center justify-between w-full'>
           <h1 className="text-3xl font-bold mb-5">User Dashboard</h1>
           <LogoutButton />
           </div>
            
            <Suspense fallback={<div>Loading...</div>}>
                <UserTable />
            </Suspense>
        </div>
    );
}