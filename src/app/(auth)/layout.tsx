import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ["todo", "tarefas", "organizador", "produtividade", "agenda", "calendário"],
    authors: [
        {
            name: "Todo App Team",
            url: "https://todoapp.example.com",
        },
    ],
    creator: "Todo App Team",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={clsx(
            "w-full h-full flex items-center justify-center"
        )}>
            {children}
        </div>
    );
}