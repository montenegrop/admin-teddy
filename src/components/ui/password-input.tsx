import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  onSave: (password: string) => void;
  className?: string;
}

export function PasswordInput({
  className,
  onSave,
  ...props
}: PasswordInputProps) {
  const [password, setPassword] = React.useState("");
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = () => {
    onSave(password);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        {...props}
      />
      <Button onClick={handleSave} variant="outline">
        {isSaved ? "Saved!" : "Save"}
      </Button>
    </div>
  );
}
