import { signOut } from "@/server/auth"
import { redirect } from "next/navigation"

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({ redirectTo: "/sign-in" })
        redirect("/sign-in")
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  )
}
