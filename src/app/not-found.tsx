'use client'
import { BackIcon, HomeIcon, RefreshIcon, MoonFilledIcon, SunFilledIcon, CalendarIcon } from "@/components/icons";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(
        typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );

    // Redireciona automaticamente para a home após 10 segundos
    useEffect(() => {
        if (countdown <= 0) {
            router.push("/");
            return;
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, router]);

    // Troca de tema
    useEffect(() => {
        if (typeof window !== "undefined") {
            document.documentElement.classList.toggle("dark", theme === "dark");
        }
    }, [theme]);

    // Copiar URL para área de transferência
    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 transition-colors p-4 overflow-hidden relative">
            {/* Elementos decorativos de fundo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-16 -top-16 w-64 h-64 bg-primary-200 dark:bg-primary-900/20 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute left-1/3 bottom-10 w-72 h-72 bg-amber-200 dark:bg-amber-900/20 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <div className="w-full max-w-md bg-white/80 dark:bg-zinc-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden relative z-10">
                {/* Status da página */}
                <div className="absolute top-4 right-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800/30 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Página não disponível
                </div>

                {/* Elemento decorativo no topo */}
                <div className="h-1.5 w-full bg-gradient-to-r from-primary-400 via-blue-400 to-amber-400"></div>

                {/* Ilustração e cabeçalho - ajustado para tamanho mais compacto */}
                <div className="py-8 px-6 relative flex flex-col items-center">
                    <div className="relative mb-3">
                        {/* Efeito circular pulsante */}
                        <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900/40 animate-ping opacity-75"></div>

                        <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border-4 border-primary-100 dark:border-primary-900 relative z-10">
                            <span className="text-5xl font-bold bg-gradient-to-br from-primary-500 to-blue-600 dark:from-primary-400 dark:to-blue-500 text-transparent bg-clip-text">404</span>
                        </div>
                    </div>

                    {/* Ilustração de documento não encontrado - tamanho reduzido */}
                    <div className="relative w-32 h-32 mb-3">
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            {/* Documento principal */}
                            <rect x="40" y="30" width="120" height="150" rx="8" className="fill-gray-100 dark:fill-zinc-700" />
                            <rect x="60" y="60" width="80" height="10" rx="2" className="fill-gray-300 dark:fill-zinc-600" />
                            <rect x="60" y="80" width="60" height="10" rx="2" className="fill-gray-300 dark:fill-zinc-600" />
                            <rect x="60" y="100" width="80" height="10" rx="2" className="fill-gray-300 dark:fill-zinc-600" />
                            <rect x="60" y="120" width="40" height="10" rx="2" className="fill-gray-300 dark:fill-zinc-600" />

                            {/* Documento em plano inclinado (com animação) */}
                            <g className="origin-bottom-right animate-[wiggle_4s_ease-in-out_infinite]">
                                <rect x="80" y="10" width="100" height="140" rx="8" transform="rotate(15 80 10)" className="fill-primary-100 dark:fill-primary-900/30" />
                                <rect x="95" y="50" width="70" height="8" rx="2" transform="rotate(15 95 50)" className="fill-primary-300 dark:fill-primary-700" />
                                <rect x="90" y="70" width="50" height="8" rx="2" transform="rotate(15 90 70)" className="fill-primary-300 dark:fill-primary-700" />
                                <rect x="85" y="90" width="70" height="8" rx="2" transform="rotate(15 85 90)" className="fill-primary-300 dark:fill-primary-700" />
                            </g>

                            {/* Lupa com animação */}
                            <g className="origin-center animate-[pulse_3s_ease-in-out_infinite]">
                                <circle cx="140" cy="100" r="25" className="fill-amber-100 dark:fill-amber-900/30" />
                                <circle cx="140" cy="100" r="20" className="fill-white dark:fill-zinc-800 stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" />
                                <rect x="155" y="115" width="25" height="8" rx="4" transform="rotate(45 155 115)" className="fill-amber-400 dark:fill-amber-500" />
                            </g>
                        </svg>
                    </div>

                    <h1 className="text-xl font-bold mb-1 bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 text-transparent bg-clip-text">Página não encontrada</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-center text-sm">
                        A página que você está procurando pode ter sido removida ou não existe.
                    </p>

                    {/* Contador de redirecionamento */}
                    <div className="mb-4 bg-gray-50 dark:bg-zinc-700/30 rounded-lg p-3 w-full max-w-sm border border-gray-200 dark:border-zinc-700">
                        <div className="flex items-center justify-center gap-2">
                            <CalendarIcon size={14} className="text-primary-500 dark:text-primary-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Redirecionando em <span className="font-semibold text-primary-600 dark:text-primary-400">{countdown}s</span>
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-primary-500 to-blue-500 dark:from-primary-400 dark:to-blue-400 h-full rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${(countdown / 10) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Ações principais */}
                    <div className="grid grid-cols-2 gap-3 mb-3 w-full">
                        <Button
                            className="rounded-lg"
                            color="primary"
                            variant="solid"
                            onPress={() => router.push("/")}
                            startContent={<HomeIcon size={16} />}
                            fullWidth
                        >
                            Página inicial
                        </Button>
                        <Button
                            className="rounded-lg"
                            color="default"
                            variant="flat"
                            onPress={() => router.back()}
                            startContent={<BackIcon size={16} />}
                            fullWidth
                        >
                            Voltar
                        </Button>
                    </div>

                    {/* Menu de navegação rápida - layout mais compacto */}
                    <div className="w-full mb-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 text-center">
                            Acesso rápido:
                        </p>
                        <div className="flex justify-center flex-wrap gap-1.5">
                            <Link
                                href="/"
                                className="text-xs bg-gray-50 dark:bg-zinc-700/50 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md transition-colors"
                            >
                                Tarefas
                            </Link>
                            <Link
                                href="/calendar"
                                className="text-xs bg-gray-50 dark:bg-zinc-700/50 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md transition-colors"
                            >
                                Calendário
                            </Link>
                            <Link
                                href="/projects"
                                className="text-xs bg-gray-50 dark:bg-zinc-700/50 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md transition-colors"
                            >
                                Projetos
                            </Link>
                        </div>
                    </div>

                    {/* Ações secundárias */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-zinc-700 w-full">
                        <Button
                            size="sm"
                            variant="light"
                            color="default"
                            onPress={handleCopyUrl}
                            className="rounded-md text-xs"
                        >
                            {copied ? "URL copiada ✓" : "Copiar URL"}
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="light"
                                color="default"
                                onPress={() => window.location.reload()}
                                className="rounded-md"
                                isIconOnly
                                title="Recarregar página"
                            >
                                <RefreshIcon size={14} />
                            </Button>
                            <Button
                                size="sm"
                                variant="light"
                                color="default"
                                onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="rounded-md"
                                isIconOnly
                                title={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
                            >
                                {theme === "dark" ? <SunFilledIcon size={14} /> : <MoonFilledIcon size={14} />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Data atual e informação de contato - formato mais compacto */}
                <div className="bg-gray-50 dark:bg-zinc-800/80 py-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-700">
                    <p>29 de abril de 2025</p>
                </div>
            </div>
        </section>
    );
}