'use client';
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@heroui/input";
import Logo from "./logo";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Form, Checkbox } from "@heroui/react";
import { GoogleIcon, FacebookIcon } from "./icons";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getValidCallbackUrl } from "@/utils/helpers";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = getValidCallbackUrl(
        searchParams?.get("callbackUrl"),
        siteConfig.auth.defaultLoginRedirect
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.ok) {
                router.push(callbackUrl);
                router.refresh();
            } else {
                console.log("Erro de autenticação:", res?.error);
                setError("Email ou senha inválidos");
            }
        } catch (err) {
            console.error("Erro durante a autenticação:", err);
            setError("Ocorreu um erro durante a autenticação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl });
    };

    return (
        <div className="w-full max-w-lg p-8 md:p-10 rounded-xl shadow-xl border-small bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-zinc-900/90 relative overflow-hidden">
            {/* Elemento decorativo no topo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-2xl"></div>

            {/* Conteúdo principal com efeito de vidro */}
            <div className="relative z-10 w-full">
                <div className="flex flex-col items-center mb-8 animate-fadeIn">
                    <div className="p-3 mb-4 transition-transform hover:scale-105">
                        <Logo />
                    </div>
                    <h1 className="text-3xl font-bold mt-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Bem-vindo de volta!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-center">
                        Entre para gerenciar suas tarefas de forma eficiente
                    </p>
                </div>

                <Form
                    className="space-y-6 w-full animate-slideUp"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col items-center justify-center space-y-5 w-full">
                        <div className="w-full">
                            <Input
                                type="email"
                                label="Email"
                                labelPlacement="outside"
                                placeholder="seu.email@exemplo.com"
                                size="lg"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                                className="transition-all duration-300 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm w-full"
                                startContent={
                                    <i className="far fa-envelope text-blue-500 dark:text-blue-400 text-sm"></i>
                                }
                                variant="bordered"
                                fullWidth
                            />
                        </div>

                        <div className="w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                label="Senha"
                                labelPlacement="outside"
                                placeholder="••••••••"
                                size="lg"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="transition-all duration-300 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm w-full"
                                startContent={
                                    <i className="far fa-lock text-blue-500 dark:text-blue-400 text-sm"></i>
                                }
                                variant="bordered"
                                fullWidth
                                endContent={
                                    <button
                                        type="button"
                                        className="focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label="Mostrar/ocultar senha"
                                    >
                                        <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer`}></i>
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-center animate-shake w-full">
                            <i className="far fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="text-blue-600"
                                size="md"
                            >
                                <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                                    Lembrar-me
                                </span>
                            </Checkbox>
                        </div>

                        <Link
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-full after:h-px after:bg-blue-600 after:transition-all hover:after:right-0"
                        >
                            Esqueceu a senha?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        variant="solid"
                        color="primary"
                        className="w-full py-3 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] overflow-hidden relative"
                        isLoading={loading}
                        disabled={loading}
                        fullWidth
                    >
                        <span className="relative z-10">Entrar</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </Button>
                </Form>

                <div className="flex items-center my-6 w-full">
                    <hr className="w-full border-gray-300 dark:border-gray-700" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 w-full">
                    <Button
                        variant="bordered"
                        className="py-2 text-base flex items-center justify-center gap-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 group border-gray-300 dark:border-gray-700 w-full"
                        onPress={() => handleSocialLogin("google")}
                        aria-label="Entrar com Google"
                        fullWidth
                    >
                        <GoogleIcon className="text-lg group-hover:scale-110 transition-transform" />
                        <span>Google</span>
                    </Button>
                    <Button
                        variant="bordered"
                        className="py-2 text-base flex items-center justify-center gap-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 group border-gray-300 dark:border-gray-700 w-full"
                        onPress={() => handleSocialLogin("facebook")}
                        aria-label="Entrar com Facebook"
                        fullWidth
                    >
                        <FacebookIcon className="text-lg group-hover:scale-110 transition-transform" />
                        <span>Facebook</span>
                    </Button>
                </div>

                <div className="flex flex-col items-center gap-2 mt-6 text-center animate-fadeIn w-full">
                    <p className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        Não tem uma conta?{" "}
                        <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium relative inline-block">
                            <span className="relative z-10">Cadastre-se agora</span>
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 transition-transform origin-left hover:scale-x-100"></span>
                        </Link>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mt-4">
                        Ao continuar, você concorda com nossos{" "}
                        <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Termos de uso
                        </Link>{" "}
                        e{" "}
                        <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Política de privacidade
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}