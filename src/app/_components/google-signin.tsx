"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { googleSignIn } from "@/lib/actions/auth-actions";
const GoogleSignin = () => {
  return (
    <form action={googleSignIn}>
      <Button type="submit" variant="outline" className="w-full">
        Login with Google
      </Button>
    </form> 
  );
};  
export default GoogleSignin;