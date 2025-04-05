"use client"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
      const {pending} = useFormStatus();
    
  return (
    <div>
      <Button disabled={pending} type="submit" className="w-full">
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Send Magic Link"
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
