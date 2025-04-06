import { LoginForm } from "@/app/_components/login-form"
import { getUser } from "@/hooks/getUser";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await getUser({ allowUnauthenticated: true });
    
    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-r from-green-100 to-amber-50">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}