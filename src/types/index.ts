import { SVGProps } from "react";
import "next-auth";

// Estendendo os tipos do NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Definição de tipos para o aplicativo de tarefas

// Prioridade padronizada sem acento
export type PriorityLevel = 'baixa' | 'media' | 'alta';

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  completedAt?: string | Date;
  dueDate?: string | Date;
  dueTime?: string;
  category?: string;
  priority?: PriorityLevel;
  notes?: string;
  subTasks?: SubTask[];
  tags?: Tag[];
  favorite?: boolean;
  reminderDate?: string | Date;
}

// Alias do tipo Todo para compatibilidade com componentes existentes
export type Task = Todo;

// Tipos para o estado da aplicação
export interface TodoState {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: FilterType;
  categories: string[];
  tags: Tag[];
  search: string;
  sortBy: SortType;
  sortDirection: 'asc' | 'desc';
}

export type FilterType = 'all' | 'active' | 'completed' | 'favorite' | 'overdue';

export type SortType = 'date' | 'dueDate' | 'priority' | 'alphabetical';

// Tipos para interação com servidor/API (futura implementação)
export interface TodoResponse {
  success: boolean;
  data?: Todo[];
  error?: string;
}

export interface ApiOptions {
  endpoint: string;
  userId: string;
  token?: string;
}
