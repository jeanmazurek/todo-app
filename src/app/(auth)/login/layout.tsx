import React from "react";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-gray- to-blue-50 dark:from-zinc-950 dark:to-indigo-950 p-4 overflow-hidden">
            {/* Bolhas decorativas animadas */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute bottom-1/4 right-1/5 w-60 h-60 bg-purple-400/15 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-float-reverse"></div>
                <div className="absolute bottom-1/2 left-2/3 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
                <div className="absolute top-10 right-10 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-float-slow"></div>

                {/* Grade decorativa */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] dark:bg-grid-white/[0.05]"></div>

                {/* Brilho no topo */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl"></div>
            </div>

            <div className="w-full max-w-lg relative animate-fadeIn">
                {/* Efeito de cartão flutuante com sombra */}
                <div className="absolute inset-0 -m-6 bg-white/10 dark:bg-black/20 rounded-2xl blur-xl transform rotate-1 scale-105 transition-all duration-700 animate-float-super-slow"></div>

                {/* Container principal com parallax suave no hover */}
                <div className="relative z-10 hover:translate-y-[-2px] transition-transform duration-300">
                    {children}
                </div>
            </div>
        </div>
    );
}