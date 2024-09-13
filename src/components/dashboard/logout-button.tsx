"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { logoutAction } from '@/actions/logout-action'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        const result = await logoutAction()
        if (result.success) {
            router.push('/')
            router.refresh()
        }
    }

    return (
        <Button onClick={handleLogout} variant="destructive">
            Logout
        </Button>
    )
}