import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Substitua pela lógica de autenticação real
                const { email, password } = credentials || {};

                // Exemplo de validação simples
                if (email === "admin@todoapp.com" && password === "admin123") {
                    return { id: "1", name: "Admin", email: "admin@todoapp.com" };
                }

                // Retorne null se as credenciais forem inválidas
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login", // Página de login personalizada
        signOut: "/logout", // Página de logout personalizada
    },
    session: {
        strategy: "jwt", // Use JWT para gerenciar sessões
        maxAge: 24 * 60 * 60, // A sessão expira após 24 horas
        updateAge: 2 * 60 * 60, // Atualizar a sessão a cada 2 horas
    },
    // Confirme que as variáveis de ambiente estão sendo usadas corretamente
    secret: process.env.NEXTAUTH_SECRET,

    // A propriedade 'url' não é necessária aqui, o NextAuth usa a variável de ambiente NEXTAUTH_URL automaticamente

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // Adicionando callback de sessão para garantir que os dados do usuário sejam passados corretamente
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development", // Habilita logs detalhados em ambiente de desenvolvimento
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };