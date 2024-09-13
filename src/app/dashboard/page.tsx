import { Suspense } from 'react';
import UserTable from '@/components/dashboard/user-table';
import { redirect } from "next/navigation";
import { verifyAuth } from '@/lib/verifyUser';
export default async function DashboardPage() {
    const user = await verifyAuth();
    if (!user) {
        redirect("/");
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-5">User Dashboard</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <UserTable />
            </Suspense>
        </div>
    );
}