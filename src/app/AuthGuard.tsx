"use client";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { status } = useSession();

    // Com o middleware gerenciando a autenticação, 
    // o AuthGuard pode ser mais simples e focar apenas na experiência do usuário
    // durante a autenticação e não na lógica de redirecionamento

    // Durante o carregamento inicial da sessão
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="text-lg text-gray-500">Carregando autenticação...</span>
            </div>
        );
    }

    // Renderiza o conteúdo
    return <>{children}</>;
}