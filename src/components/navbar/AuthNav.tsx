"use client";
import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { siteConfig } from "@/config/site";
import { useSession, signOut } from "next-auth/react";
import { UserAvatar } from "@/components/user-avatar";
import { ChevronUpIcon, ChevronDownIcon, MoonFilledIcon, SunFilledIcon } from "@/components/icons";
import { useTheme } from "next-themes";
import NextLink from "next/link";
import clsx from "clsx";
import React from "react";
import { useRouter } from "next/navigation";

interface AuthNavProps {
    collapsed: boolean;
}

export function AuthNav({ collapsed }: AuthNavProps) {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push(siteConfig.auth.defaultLogoutRedirect);
    };

    if (!session) {
        return (
            <div className="flex flex-col gap-2 mt-8">
                <span className="text-sm text-gray-500 px-4">
                    Olá, <span className="font-semibold">Visitante</span>
                </span>
            </div>
        );
    }

    return (
        <div className="fixed top-4 right-4 z-[100] md:static md:mt-8 md:px-4 md:z-auto">
            <Dropdown placement="bottom-end" onOpenChange={setDropdownOpen}>
                <DropdownTrigger>
                    <Button
                        className={clsx(
                            "flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none hover:bg-default-100 dark:hover:bg-zinc-800 rounded transition",
                            "focus-visible:ring-2 focus-visible:ring-primary-400"
                        )}
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                        tabIndex={0}
                        type="button"
                        variant="light"
                    >
                        <UserAvatar name={session.user?.name} image={session.user?.image} />
                        {!collapsed && (
                            <>
                                <span className="max-w-[120px] truncate">{session.user?.name}</span>
                                <span className="material-icons text-base">
                                    {dropdownOpen ? <ChevronUpIcon size={10} /> : <ChevronDownIcon size={10} />}
                                </span>
                            </>
                        )}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Gerenciamento da conta" className="w-full z-[110]">
                    <>
                        <DropdownItem
                            key="user-info"
                            className="flex items-center gap-2 cursor-default select-text bg-default-50 dark:bg-zinc-800"
                            isReadOnly
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-semibold">{session.user?.name}</span>
                                <span className="text-xs text-gray-500">{session.user?.email}</span>
                            </div>
                        </DropdownItem>
                        {siteConfig.userMenu.map((item) => {
                            if (item.label === "Tema") {
                                return (
                                    <DropdownItem
                                        key="theme"
                                        className="flex items-center gap-2"
                                        closeOnSelect={false}
                                        onPress={() => setTheme(theme === "light" ? "dark" : "light")}
                                        startContent={
                                            theme === "light"
                                                ? <SunFilledIcon size={15} className="material-icons text-lg" />
                                                : <MoonFilledIcon size={15} className="material-icons text-lg" />
                                        }
                                    >
                                        {item.label}
                                    </DropdownItem>
                                );
                            }
                            return (
                                <DropdownItem
                                    as={NextLink}
                                    href={item.href}
                                    key={item.label}
                                    className={clsx(
                                        "flex items-center gap-2",
                                        item.label === "Sair" && "text-danger"
                                    )}
                                    startContent={
                                        item.icon
                                            ? typeof item.icon === "string"
                                                ? <span className="material-icons text-lg">{item.icon}</span>
                                                : <span className="text-lg">{React.createElement(item.icon, { size: 15 })}</span>
                                            : null
                                    }
                                    onPress={item.label === "Sair" ? handleLogout : undefined}
                                >
                                    {item.label}
                                </DropdownItem>
                            );
                        })}
                    </>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

export default AuthNav;