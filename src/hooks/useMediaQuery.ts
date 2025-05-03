"use client";
import { useState, useEffect } from "react";

/**
 * Hook customizado para detectar correspondência de consulta de mídia (media query)
 * Útil para aplicar lógica condicional baseada no tamanho da tela
 * 
 * @param query A consulta de mídia CSS para verificar
 * @returns Boolean indicando se a consulta corresponde ao estado atual
 * 
 * Exemplo de uso: 
 * const isMobile = useMediaQuery('(max-width: 640px)')
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        // Verificar se estamos em ambiente de navegador
        if (typeof window === "undefined") {
            return;
        }

        const media = window.matchMedia(query);

        // Definir valor inicial
        setMatches(media.matches);

        // Definir callback para mudanças
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Adicionar listener para mudança de estado
        if (media.addEventListener) {
            media.addEventListener("change", listener);
        } else {
            // Para suporte a navegadores mais antigos
            media.addListener(listener);
        }

        // Limpar listener
        return () => {
            if (media.removeEventListener) {
                media.removeEventListener("change", listener);
            } else {
                // Para suporte a navegadores mais antigos
                media.removeListener(listener);
            }
        };
    }, [query]);

    return matches;
}

export default useMediaQuery;