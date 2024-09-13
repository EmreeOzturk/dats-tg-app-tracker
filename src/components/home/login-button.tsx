"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LogIn } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ExpandButton from "../ui/expand-button"
import { motion } from "framer-motion"
import { useFormState } from "react-dom";
import { loginAction } from "@/actions/login-action";
import { useRouter } from "next/navigation";

const LoginButton = () => {
    const [state, action] = useFormState(loginAction, { message: "", success: false });
    const router = useRouter();
    if (state.success) {
        router.push("/dashboard");
    }
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 1,
            }}
            className="flex items-center justify-end w-full ">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className="rounded-lg w-28 font-semibold">
                        <LogIn className="mr-2" /> Login
                    </Button>
                </PopoverTrigger>
                <PopoverContent >
                    <form className="p-4 w-full" action={action}>
                        <Label className="text-neutral-400">Username</Label>
                        <Input className="mt-2" name="username" type="text" />
                        <Label className="text-neutral-400 mt-4">Password</Label>
                        <Input className="mt-2" name="password" type="password" />
                        <Separator className="mt-4" />
                        {state.message && <p className={state.success ? "text-green-500" : "text-red-500"}>{state.message}</p>}
                        <ExpandButton />
                    </form>
                </PopoverContent>
            </Popover>

        </motion.div>
    )
}

export default LoginButton