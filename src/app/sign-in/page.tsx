import { LoginForm } from "@/app/_components/login-form"
import { useUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await useUser({ allowUnauthenticated: true });
    
    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}