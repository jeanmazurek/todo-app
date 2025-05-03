"use client";
import { signOut } from "next-auth/react";
import { Button } from "@heroui/button";
import { LogoutIcon } from "./icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { getValidCallbackUrl } from "@/utils/helpers";

export function LogoutButton() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    // Verifica e valida o callbackUrl para o logout
    const callbackUrl = getValidCallbackUrl(
        searchParams?.get("callbackUrl"),
        siteConfig.auth.defaultLogoutRedirect
    );

    const handleLogout = async () => {
        setLoading(true);
        await signOut({ redirect: false });
        router.push(callbackUrl);
        setLoading(false);
    };

    return (
        <Button
            isIconOnly={false}
            variant="light"
            size="md"
            aria-label="Sair"
            onPress={handleLogout}
            color="danger"
            className="flex gap-2 items-center"
            isLoading={loading}
        >
            <LogoutIcon />
            <span className="hidden sm:inline">Sair</span>
        </Button>
    );
}