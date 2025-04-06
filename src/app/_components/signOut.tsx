import { handleSignout } from "@/lib/actions/auth-actions"

export function SignOut() {
  return (
    <form action={handleSignout}>
      <button type="submit">Sign Out</button>
    </form>
  )
}
