import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/server/auth";

const GoogleSignin = async () => {
  return (
    <form action={async ()=>{
        "use server"
        await signIn("google")
    }}>
      <Button variant="outline" className="w-full">
        Login with Google
      </Button>
    </form> 
  );
};

export default GoogleSignin;
