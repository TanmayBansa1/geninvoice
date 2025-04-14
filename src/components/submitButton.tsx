"use client"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

const SubmitButton = ({text, disabled}: {text: string, disabled?: boolean}) => {
  return (
    <div>
      <Button disabled={disabled} type="submit" className="cursor-pointer w-full bg-green-400 hover:bg-green-600">
        {disabled ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {text}
          </>
        ) : (
          text
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
