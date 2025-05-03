"use client";
import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from "@heroui/dropdown";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { BellIcon, TaskIcon, CheckCircleIcon, AlarmIcon, SystemUpdateIcon } from "@/components/icons";

export function NotificationsDropdown() {
    const [unread, setUnread] = useState(3);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const notifications = [
        {
            id: 1,
            title: "Nova tarefa adicionada",
            message: "A tarefa 'Preparar apresentação' foi adicionada",
            time: "5 min",
            read: false,
            icon: "task"
        },
        {
            id: 2,
            title: "Tarefa concluída",
            message: "A tarefa 'Enviar relatório' foi marcada como concluída",
            time: "1h",
            read: false,
            icon: "check_circle"
        },
        {
            id: 3,
            title: "Lembrete",
            message: "A tarefa 'Reunião semanal' vence em breve",
            time: "3h",
            read: false,
            icon: "alarm"
        },
        {
            id: 4,
            title: "Sistema atualizado",
            message: "O sistema foi atualizado para a versão 2.0",
            time: "1d",
            read: true,
            icon: "system_update"
        }
    ];

    // Função para obter o ícone correto baseado no tipo
    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case "task":
                return <TaskIcon size={16} />;
            case "check_circle":
                return <CheckCircleIcon size={16} />;
            case "alarm":
                return <AlarmIcon size={16} />;
            case "system_update":
                return <SystemUpdateIcon size={16} />;
            default:
                return <BellIcon size={16} />;
        }
    };

    const markAllRead = () => {
        setUnread(0);
    };

    return (
        <Dropdown placement="bottom-end" onOpenChange={setDropdownOpen}>
            <DropdownTrigger>
                <Button
                    isIconOnly
                    aria-label="Notificações"
                    className="relative bg-transparent hover:bg-default-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    variant="light"
                    radius="full"
                >
                    <BellIcon size={20} className="text-default-500" />
                    {unread > 0 && (
                        <Badge
                            color="danger"
                            size="sm"
                            className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3"
                        >
                            {unread}
                        </Badge>
                    )}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Notificações"
                className="w-80 p-0 max-h-[70vh] overflow-y-auto"
                emptyContent="Não há notificações."
            >
                {/* Static Section for Header */}
                <DropdownSection showDivider={false} className="p-0 sticky top-0 bg-white dark:bg-zinc-900 z-10 border-b border-default-100 dark:border-zinc-800">
                    <DropdownItem
                        key="notification-header"
                        isReadOnly
                        className="p-0 hover:bg-transparent focus:bg-transparent"
                    >
                        <div className="px-4 py-3 flex items-center justify-between">
                            <h3 className="font-medium">Notificações</h3>
                            {unread > 0 && (
                                <Button
                                    size="sm"
                                    variant="light"
                                    onPress={markAllRead}
                                    className="text-primary-500 text-xs"
                                >
                                    Marcar tudo como lido
                                </Button>
                            )}
                        </div>
                    </DropdownItem>
                </DropdownSection>

                {/* Dynamic Section for Notifications */}
                <DropdownSection items={notifications} showDivider={false} className="p-0">
                    {(notification) => (
                        <DropdownItem
                            key={notification.id}
                            className={clsx(
                                "p-3 gap-3 border-b border-default-100 dark:border-zinc-800 last:border-0",
                                !notification.read && "bg-primary-50 dark:bg-primary-900/20"
                            )}
                        >
                            <div className="flex gap-3 items-start">
                                <div className={clsx(
                                    "p-2 rounded-full text-white",
                                    notification.read ? "bg-default-300 dark:bg-zinc-700" : "bg-primary-500 dark:bg-primary-600"
                                )}>
                                    {getIconComponent(notification.icon)}
                                </div>
                                <div className="flex-1">
                                    <p className={clsx(
                                        "text-sm mb-0.5",
                                        !notification.read && "font-semibold"
                                    )}>
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-default-500 mb-1">{notification.message}</p>
                                    <p className="text-xs text-default-400">{notification.time}</p>
                                </div>
                            </div>
                        </DropdownItem>
                    )}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
}

export default NotificationsDropdown;