import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-r from-green-100 to-amber-50">
      <div className="w-full max-w-sm">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-green-600 hover:bg-green-700",
              footerActionLink: "text-green-600 hover:text-green-700",
            },
          }}
          signInUrl="/sign-in"
          forceRedirectUrl="/sync"
        />
      </div>
    </div>
  );
} 