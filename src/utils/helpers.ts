/**
 * Formata uma data (string ou Date) para o formato dd/mm/aaaa ou dd/mm/aaaa hh:mm.
 * @param dateString A data a ser formatada.
 * @param includeTime Se deve incluir a hora no formato final.
 * @returns A data formatada ou uma string vazia se a data for inválida.
 */
export function formatDate(dateString: string | Date | undefined | null, includeTime: boolean = false): string {
    if (!dateString) {
        return "";
    }

    try {
        const date = new Date(dateString);

        // Verifica se a data é válida
        if (isNaN(date.getTime())) {
            console.warn("Data inválida fornecida para formatDate:", dateString);
            return "Data inválida";
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são 0-indexados
        const year = date.getFullYear();

        if (includeTime) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }

        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error("Erro ao formatar data:", error);
        return "Erro na data";
    }
}

import { siteConfig } from "@/config/site";

/**
 * Cria uma URL para a página de login com um redirecionamento opcional
 * @param callbackUrl URL para redirecionar após o login bem-sucedido
 * @returns URL formatada para a página de login
 */
export function createLoginUrl(callbackUrl?: string): string {
    const loginPath = siteConfig.auth.loginPage;

    if (!callbackUrl) {
        return loginPath;
    }

    const encodedCallback = encodeURIComponent(callbackUrl);
    return `${loginPath}?callbackUrl=${encodedCallback}`;
}

/**
 * Cria uma URL para o processo de logout com redirecionamento opcional
 * @param callbackUrl URL para redirecionar após o logout
 * @returns URL formatada para o processo de logout
 */
export function createLogoutUrl(callbackUrl?: string): string {
    const logoutPath = "/api/auth/signout";

    if (!callbackUrl) {
        callbackUrl = siteConfig.auth.defaultLogoutRedirect;
    }

    const encodedCallback = encodeURIComponent(callbackUrl);
    return `${logoutPath}?callbackUrl=${encodedCallback}`;
}

/**
 * Extrai e valida a URL de callback de uma query string
 * @param callbackUrl URL de callback para validar
 * @param defaultUrl URL padrão para usar se o callback não estiver presente ou for inválido
 * @returns URL de callback validada ou URL padrão
 */
export function getValidCallbackUrl(callbackUrl: string | null | undefined, defaultUrl: string): string {
    // Se não houver callback ou for vazio, use o padrão
    if (!callbackUrl) {
        return defaultUrl;
    }

    try {
        // Verifica se a URL é uma rota absoluta interna ou URL externa válida
        const url = new URL(callbackUrl, window.location.origin);

        // Se for uma URL interna (do mesmo domínio) ou uma rota relativa, permite
        if (url.origin === window.location.origin || callbackUrl.startsWith('/')) {
            return callbackUrl;
        }

        // Se chegou aqui, é uma URL externa - rejeita e usa o padrão
        console.warn('URL de callback externa não permitida:', callbackUrl);
        return defaultUrl;
    } catch (error) {
        // Se não é uma URL válida, usa o padrão
        console.warn('URL de callback inválida:', callbackUrl);
        return defaultUrl;
    }
}
