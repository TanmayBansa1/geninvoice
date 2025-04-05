import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export async function getUser(options: { 
    allowUnauthenticated?: boolean, 
    redirectTo?: string 
} = {}) {
    try {
        const session = await auth();
        
        // If no session and not allowing unauthenticated access
        if (!session || !session.user || !session.user.id) {
            if (options.allowUnauthenticated) {
                return null;
            }
            
            // Use custom redirect path or default to sign-in
            const redirectPath = options.redirectTo || "/sign-in";
            return redirect(redirectPath);
        }
        
        return session.user;
    } catch (error) {
        // If error occurs and not allowing unauthenticated access
        if (options.allowUnauthenticated) {
            return null;
        }
        
        console.error("Session retrieval error:", error);
        
        // Use custom redirect path or default to sign-in
        const redirectPath = options.redirectTo || "/sign-in";
        return redirect(redirectPath);
    }
}