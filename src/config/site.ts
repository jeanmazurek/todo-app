import {
  SettingsIcon,
  LogoutIcon,
  CircleUserIcon,
  ListCheckIcon,
  CalendarIcon,
  AnalyticsIcon,
} from "@/components/icons";

export type NavItem = {
  icon?: React.ComponentType<any> | string;
  label: string;
  href: string;
  badge?: string | React.ComponentType<any>;
};

export type UserMenuItem = {
  icon?: React.ComponentType<any> | string;
  label: string;
  href: string;
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ToDo APP",
  description: "Uma aplicação de gerenciamento de tarefas simples e eficaz.",

  // Configurações para rotas de autenticação
  auth: {
    // Página padrão após o login bem-sucedido
    defaultLoginRedirect: "/",
    // Página padrão após o logout
    defaultLogoutRedirect: "/login",
    // Página de login
    loginPage: "/login",
    // Caminho para API de autenticação
    authApiPath: "/api/auth",
  },

  navItems: [
    {
      icon: ListCheckIcon,
      label: "Minhas Tarefas",
      href: "/",
    },
    {
      icon: CalendarIcon,
      label: "Calendário",
      href: "/calendar",
    },
    {
      icon: AnalyticsIcon,
      label: "Estatísticas",
      href: "/stats",
    },
  ] as NavItem[],
  userMenu: [
    {
      icon: CircleUserIcon,
      label: "Perfil",
      href: "/profile",
    },
    {
      icon: SettingsIcon,
      label: "Configurações",
      href: "/settings",
    },
    {
      icon: "theme",
      label: "Tema",
      href: "#theme",
    },
    {
      icon: LogoutIcon,
      label: "Sair",
      href: "/logout",
    },
  ],
  appInfo: {
    name: "ToDo APP",
    description: "Uma aplicação de gerenciamento de tarefas simples e eficaz.",
    version: "1.0.0",
  },
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
