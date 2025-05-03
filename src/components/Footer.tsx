import React from 'react';
import { siteConfig } from '@/config/site';
import clsx from 'clsx';

interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className={clsx(
                "w-full py-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/30 dark:border-zinc-700/30",
                "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl backdrop-saturate-150",
                "shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.2)]",
                className
            )}
            style={{
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)'
            }}
        >
            <div className="container mx-auto px-4">
                <p className="font-medium">&copy; {currentYear} {siteConfig.name}. Todos os direitos reservados.</p>

                {/* Links adicionais do footer - opcional */}
                <div className="flex items-center justify-center gap-4 mt-2">
                    <a
                        href={siteConfig.links?.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                        GitHub
                    </a>
                    <span className="text-gray-400">•</span>
                    <a
                        href="/docs"
                        className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                        Documentação
                    </a>
                    <span className="text-gray-400">•</span>
                    <a
                        href="/privacy"
                        className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                        Privacidade
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;