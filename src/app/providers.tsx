"use client";

import * as React from "react";
import type { ThemeProviderProps } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@heroui/toast";
import { AuthGuard } from "./AuthGuard";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

/**
 * Componente global de providers para contexto de sessão, tema e UI.
 */
export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <SessionProvider>
      <DndProvider backend={HTML5Backend}>
        <HeroUIProvider>
          <NextThemesProvider {...themeProps}>
            <ToastProvider placement="top-right" />
            <AuthGuard>
              {children}
            </AuthGuard>
          </NextThemesProvider>
        </HeroUIProvider>
      </DndProvider>
    </SessionProvider>
  );
}
