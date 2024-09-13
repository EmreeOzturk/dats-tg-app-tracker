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
        <div className="w-full relative overflow-hidden h-screen py-12 px-4
          bg-gradient-to-b from-slate-950 to-slate-900
        ">
            <div className="max-w-7xl mx-auto w-full relative overflow-hidden  p-4  ">
                <div className='flex items-center justify-between w-full'>
                    <h1 className="text-3xl font-bold mb-5">User Dashboard</h1>
                    <LogoutButton />
                </div>
                <UserTable />
            </div>
        </div>
    );
}