"use client"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({text}: {text: string}) => {
      const {pending} = useFormStatus();
    
  return (
    <div>
      <Button disabled={pending} type="submit" className="w-full bg-green-400 hover:bg-green-600">
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          text
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
