"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { useEffect, ReactNode } from "react";

// Rotas onde o Navbar não deve aparecer
const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];

// Função utilitária para detectar rotas dinâmicas (exemplo: /reset/[token])
function shouldHideNavbar(pathname: string) {
    // Permite esconder rotas dinâmicas como /reset/[token]
    return (
        hideNavbarRoutes.includes(pathname) ||
        hideNavbarRoutes.some(route =>
            route.includes("[") && pathname.startsWith(route.split("[")[0])
        ) ||
        /^\/reset\/[^/]+$/.test(pathname) // Esconde para /reset/qualquer-coisa
    );
}

interface NavbarWrapperProps {
    children: ReactNode;
}

export default function NavbarWrapper({ children }: NavbarWrapperProps) {
    const pathname = usePathname();

    // Scroll para o topo ao navegar para uma nova página com animação suave
    useEffect(() => {
        // Usa um atraso curto para garantir que os eventos de scroll funcionem corretamente
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
    }, [pathname]);

    // Adiciona/remover classe ao body para estilização global
    useEffect(() => {
        const showNavbar = !shouldHideNavbar(pathname);
        document.body.classList.toggle("with-navbar", showNavbar);

        // Adiciona classe para aplicar transições suaves ao conteúdo
        if (showNavbar) {
            document.body.classList.add("navbar-transition");
        }

        return () => {
            document.body.classList.remove("with-navbar");
            document.body.classList.remove("navbar-transition");
        };
    }, [pathname]);

    if (shouldHideNavbar(pathname)) {
        return <>{children}</>;
    }

    return (
        <Navbar>
            {children}
        </Navbar>
    );
}