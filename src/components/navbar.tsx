"use client";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import {
  Logo, MenuIcon, ChevronRightIcon,
  ChevronLeftIcon
} from "@/components/icons";
import { Suspense, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Tooltip } from "@heroui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./Footer";
import React from "react";

// Componentes modulares
import { NotificationsDropdown } from "@/components/navbar/NotificationsDropdown";
import { SearchInput } from "@/components/navbar/SearchInput";
import { AuthNav } from "@/components/navbar/AuthNav";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(true); // Força o estado scrolled como true desde o início
  const pathname = usePathname();
  const { theme } = useTheme();

  const asideRef = useRef<HTMLDivElement>(null);

  // Detectar scroll para aplicar efeito no cabeçalho
  useEffect(() => {
    // Verificar posição inicial
    const checkScroll = () => {
      const isScrolled = window.scrollY > 1;
      setScrolled(isScrolled);
    };

    // Verificar estado inicial do scroll imediatamente
    checkScroll();

    // Garantir que o estado esteja correto após o carregamento completo
    window.setTimeout(checkScroll, 100);

    // Adicionar evento de scroll com debounce para melhor performance
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScroll, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Limpar evento
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Detectar tamanho da tela para colapsar automaticamente no modo móvel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Verificar no carregamento inicial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (open && asideRef.current) {
      asideRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredNavItems = siteConfig.navItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  function handleNavClick() {
    if (window.innerWidth < 768) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-zinc-950 dark:to-indigo-950/30 transition-colors">
      {/* Botão para abrir menu lateral no mobile - aplicando efeito vidro */}
      <button
        className="fixed top-4 left-4 z-50 rounded-full shadow-xl p-2.5 md:hidden 
                  bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md backdrop-saturate-150 
                  transition-all hover:bg-white/80 dark:hover:bg-zinc-800/80 active:scale-95 
                  hover-lift border border-white/20 dark:border-zinc-800/20"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        type="button"
        style={{
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <MenuIcon className="text-primary-500 dark:text-primary-400" />
      </button>

      {/* Cabeçalho fixo para navegação rápida - aplicando efeito vidro */}
      <header
        className={clsx(
          "fixed top-0 z-30 transition-all duration-300 flex items-center px-4 md:px-6 w-full h-16",
          collapsed ? "md:left-[80px] md:w-[calc(100%-80px)]" : "md:left-[240px] md:w-[calc(100%-240px)]",
        )}
        style={{
          display: pathname === "/login" ? "none" : "flex",
          backgroundColor: theme === 'dark' ? 'rgba(24, 24, 27, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          borderBottom: theme === 'dark' ? '1px solid rgba(63, 63, 70, 0.3)' : '1px solid rgba(229, 231, 235, 0.3)',
          boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="ml-12 md:ml-0 flex-1 flex items-center justify-end gap-4">
          <div className="flex items-center gap-3">
            {!collapsed && (
              <div className="hidden md:block w-64">
                <SearchInput
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            )}
            <div className="hidden sm:flex">
              <NotificationsDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Menu lateral - aplicando efeito vidro */}
      <aside
        ref={asideRef}
        className={clsx(
          "fixed md:sticky md:top-0 top-0 left-0 h-screen max-h-screen transition-all duration-300 ease-in-out outline-none z-40 flex flex-col",
          open ? "translate-x-0 w-64" : "-translate-x-full w-64",
          collapsed ? "md:w-20" : "md:w-60",
          "md:translate-x-0 md:shadow-none",
          "bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl backdrop-saturate-150",
          "border-r border-gray-200/30 dark:border-zinc-800/30"
        )}
        style={{
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          boxShadow: theme === 'dark'
            ? '5px 0 25px rgba(0, 0, 0, 0.2)'
            : '5px 0 25px rgba(0, 0, 0, 0.05)'
        }}
        tabIndex={open ? 0 : -1}
        aria-label="Menu lateral"
        role="navigation"
      >
        <nav className={clsx("flex-1 flex flex-col gap-1 p-3", collapsed && "items-center")}>
          <div className={clsx(
            "flex items-center gap-2 px-4 py-5 mb-4 border-b border-gray-200/30 dark:border-zinc-800/30 transition-all",
            collapsed ? "justify-center" : "justify-between"
          )}>
            <div className="flex items-center gap-2">
              <Logo className={clsx("transition-transform", !collapsed && "scale-110 animate-pulse")} />
              {!collapsed && <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-300">TODO</span>}
            </div>
            {/* Botão para colapsar menu no desktop */}
            <button
              className="hidden md:flex p-2 rounded-full hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-colors items-center justify-center active:scale-95 focus-ring"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
              type="button"
            >
              <span className="text-lg transform transition-transform duration-300" style={{
                transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)'
              }}>
                {collapsed ? <ChevronRightIcon className="text-gray-500 hover:text-primary-500 transition-colors" /> : <ChevronLeftIcon className="text-gray-500 hover:text-primary-500 transition-colors" />}
              </span>
            </button>
          </div>

          {filteredNavItems.length === 0 && search && (
            <span className="text-gray-400 text-sm px-6 py-2 animate-fade-in">Nenhum item encontrado</span>
          )}

          <div className="mt-2 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || pathname === item.href + "/";
              const linkContent = (
                <>
                  {item.icon && (
                    typeof item.icon === "string" ? (
                      <span className={clsx(
                        "material-icons text-lg flex-shrink-0 transition-all duration-200",
                        isActive ? "text-primary-600 scale-110" : "text-gray-400 group-hover:text-primary-500"
                      )}>
                        {item.icon}
                      </span>
                    ) : (
                      React.createElement(item.icon, {
                        size: collapsed ? 22 : 20,
                        className: clsx(
                          "text-lg flex-shrink-0 transition-all duration-200",
                          isActive ? "text-primary-600 scale-110" : "text-gray-400 group-hover:text-primary-500"
                        )
                      })
                    )
                  )}
                  {!collapsed && (
                    <span className="flex items-center gap-2 transition-all">
                      <span className="truncate font-medium">{item.label}</span>
                      {item.badge && (
                        typeof item.badge === "string" ? (
                          <span className="ml-2 px-2 py-0.5 rounded bg-gray-100/70 dark:bg-zinc-800/70 backdrop-blur-sm text-gray-500 dark:text-gray-300 text-xs font-normal border border-gray-200/30 dark:border-zinc-700/30">
                            {item.badge}
                          </span>
                        ) : (
                          React.createElement(item.badge)
                        )
                      )}
                    </span>
                  )}
                </>
              );

              if (collapsed) {
                return (
                  <Tooltip
                    content={item.label}
                    placement="right"
                    key={item.href}
                    className="z-[120] light:text-black dark:text-white"
                    delay={200}
                  >
                    <NextLink
                      href={item.href}
                      onClick={handleNavClick}
                      className={clsx(
                        linkStyles({ color: "foreground" }),
                        "group px-4 py-2.5 rounded-lg flex items-center gap-3 font-normal outline-none transition-all duration-200",
                        "hover:bg-white/50 dark:hover:bg-zinc-800/50 backdrop-blur-lg",
                        "justify-center px-2",
                        isActive
                          ? "bg-primary-50/70 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold animate-pulse-glow"
                          : "text-gray-700 dark:text-gray-200",
                        "focus-visible:ring-2 focus-visible:ring-primary-400",
                        "hover:scale-105 active:scale-95"
                      )}
                      title={item.label}
                      aria-current={isActive ? "page" : undefined}
                      tabIndex={0}
                    >
                      {linkContent}
                    </NextLink>
                  </Tooltip>
                );
              }

              return (
                <motion.div key={item.href} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <NextLink
                    href={item.href}
                    onClick={handleNavClick}
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "group px-4 py-2.5 rounded-lg flex items-center gap-3 font-normal outline-none transition-all duration-200",
                      "hover:bg-white/50 dark:hover:bg-zinc-800/50 backdrop-blur-lg",
                      isActive
                        ? "bg-gradient-to-r from-primary-50/70 to-indigo-50/70 dark:from-primary-900/30 dark:to-indigo-900/30 text-primary-600 dark:text-primary-400 font-semibold"
                        : "text-gray-700 dark:text-gray-200",
                      "focus-visible:ring-2 focus-visible:ring-primary-400",
                      "active:scale-98"
                    )}
                    title={item.label}
                    aria-current={isActive ? "page" : undefined}
                    tabIndex={0}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 dark:bg-primary-400 rounded-full"
                        layoutId="activeIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {linkContent}
                  </NextLink>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-auto text-xs select-none">
            <Suspense fallback={null}>
              <AuthNav collapsed={collapsed} />
            </Suspense>
            <div className={clsx(
              "flex flex-col gap-1 mt-5 items-center justify-center border-t border-gray-200/30 dark:border-zinc-800/30 pt-3 pb-2",
              !collapsed ? "px-4" : ""
            )}>
              <span className="text-xs text-gray-400">{siteConfig.appInfo.name}</span>
              <span className="text-xs text-gray-400">{siteConfig.appInfo.version}</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* Overlay para fechar menu no mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            tabIndex={0}
          />
        )}
      </AnimatePresence>

      {/* Conteúdo da página ao lado do menu */}
      <main className={clsx(
        "flex-1 ml-0 md:ml-0 transition-all duration-300",
        pathname !== "/login" && "pt-16"
      )} style={{ minWidth: 0 }}>
        {children}
        <Footer />
      </main>
    </div>
  );
};
