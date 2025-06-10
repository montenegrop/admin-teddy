import { PasswordInput } from "@/components/ui/password-input";
import { AuthStorage } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function LoginPage() {

    const handleSavePassword = (password: string) => {
        AuthStorage.setPassword(password);
        setPassword(password);
    };

    const [password, setPassword] = useState("");


    const navigate = useNavigate()

    useEffect(() => {
        if (password) {
            navigate({ to: '/dashboard' });
        }
    }, [password]);





    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-200 py-2">
                <h1 className="text-3xl font-bold tracking-tight">Call Logs</h1>

            </div>

            {/* Search and Controls */}
            <div className="flex items-center justify-between gap-4">

                <div className="flex gap-4 items-center">
                    <PasswordInput onSave={handleSavePassword} className="w-64" />
                </div>
            </div>
            <div className="border rounded-lg">

            </div>


        </div>
    );
}