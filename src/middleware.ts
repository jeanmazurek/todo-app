import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { siteConfig } from './config/site';

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Ignorando completamente as rotas de API de auth para evitar loops de redirecionamento
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // Obtém o token JWT da sessão
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = [
        siteConfig.auth.loginPage,
        '/register',
        '/forgot-password',
    ];

    // Verifica se a rota atual é pública
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    // Se o usuário está tentando acessar uma rota protegida sem estar autenticado
    if (!token && !isPublicRoute) {
        // Cria uma URL para redirecionamento após o login
        const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
        const redirectUrl = `${siteConfig.auth.loginPage}?callbackUrl=${callbackUrl}`;

        // Redireciona para a página de login com o callbackUrl
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Se o usuário está tentando acessar a página de login ou registro mas já está autenticado
    if (token && isPublicRoute) {
        // Se houver um callbackUrl nos parâmetros de consulta, use-o
        const callbackUrl = searchParams.get('callbackUrl') || siteConfig.auth.defaultLoginRedirect;

        // Redireciona para a página inicial ou para o callbackUrl
        return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    // Se nada precisa ser modificado, continue com a requisição normalmente
    return NextResponse.next();
}

// Define em quais caminhos o middleware será executado
export const config = {
    // Aplica o middleware em todas as rotas, exceto as especificadas
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (arquivos estáticos)
         * - _next/image (otimização de imagens)
         * - favicon.ico (ícone do site)
         * - public (arquivos públicos)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};