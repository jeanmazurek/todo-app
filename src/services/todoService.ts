import { Todo, SubTask, Tag, PriorityLevel } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'todo_app_tasks';

// Verifica se está no ambiente do navegador
const isBrowser = typeof window !== 'undefined';

/**
 * Serviço para gerenciar tarefas com armazenamento local
 * Futuramente pode ser substituído por chamadas a uma API REST
 */
export const todoService = {
    /**
     * Recupera todas as tarefas do armazenamento local
     */
    getTodos: (): Todo[] => {
        if (!isBrowser) {
            console.warn('Tentativa de acessar localStorage fora do navegador');
            return [];
        }

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao recuperar tarefas:', error);
            return [];
        }
    },

    /**
     * Salva tarefas no armazenamento local
     */
    saveTodos: (todos: Todo[]): void => {
        if (!isBrowser) {
            console.warn('Tentativa de acessar localStorage fora do navegador');
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error('Erro ao salvar tarefas:', error);
        }
    },

    /**
     * Adiciona uma nova tarefa
     */
    addTodo: (todoData: {
        text: string;
        dueDate?: string;
        dueTime?: string;
        category?: string;
        priority?: PriorityLevel;
        notes?: string;
        subTasks?: SubTask[];
        tags?: Tag[];
    }): Todo => {
        const todos = todoService.getTodos();

        const newTodo: Todo = {
            id: uuidv4(),
            text: todoData.text,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dueDate: todoData.dueDate,
            dueTime: todoData.dueTime,
            category: todoData.category,
            priority: todoData.priority,
            notes: todoData.notes,
            subTasks: todoData.subTasks || [],
            tags: todoData.tags || [],
            favorite: false
        };

        const updatedTodos = [...todos, newTodo];
        todoService.saveTodos(updatedTodos);

        return newTodo;
    },

    /**
     * Atualiza uma tarefa existente
     */
    updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | null => {
        const todos = todoService.getTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) return null;

        const updatedTodo = {
            ...todos[todoIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        todos[todoIndex] = updatedTodo;
        todoService.saveTodos(todos);

        return updatedTodo;
    },

    /**
     * Deleta uma tarefa
     */
    deleteTodo: (id: string): boolean => {
        const todos = todoService.getTodos();
        const filteredTodos = todos.filter(todo => todo.id !== id);

        if (filteredTodos.length === todos.length) return false;

        todoService.saveTodos(filteredTodos);
        return true;
    },

    /**
     * Marca uma tarefa como concluída ou não concluída
     */
    toggleTodoCompletion: (id: string): Todo | null => {
        const todos = todoService.getTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) return null;

        const updatedTodo = {
            ...todos[todoIndex],
            completed: !todos[todoIndex].completed,
            updatedAt: new Date().toISOString()
        };

        // Adicionar ou remover a data de conclusão
        if (updatedTodo.completed) {
            updatedTodo.completedAt = new Date().toISOString();
        } else {
            delete updatedTodo.completedAt;
        }

        todos[todoIndex] = updatedTodo;
        todoService.saveTodos(todos);

        return updatedTodo;
    },

    /**
     * Marca uma subtarefa como concluída ou não concluída
     */
    toggleSubTaskCompletion: (todoId: string, subTaskId: string): Todo | null => {
        const todos = todoService.getTodos();
        const todoIndex = todos.findIndex(todo => todo.id === todoId);

        if (todoIndex === -1) return null;

        const todo = todos[todoIndex];
        if (!todo.subTasks) return null;

        const subTaskIndex = todo.subTasks.findIndex(st => st.id === subTaskId);
        if (subTaskIndex === -1) return null;

        // Cria um novo array de subtarefas com a subtarefa atualizada
        const updatedSubTasks = [...todo.subTasks];
        updatedSubTasks[subTaskIndex] = {
            ...updatedSubTasks[subTaskIndex],
            completed: !updatedSubTasks[subTaskIndex].completed
        };

        // Atualiza a tarefa com as subtarefas atualizadas
        const updatedTodo = {
            ...todo,
            subTasks: updatedSubTasks,
            updatedAt: new Date().toISOString()
        };

        todos[todoIndex] = updatedTodo;
        todoService.saveTodos(todos);

        return updatedTodo;
    },

    /**
     * Marca ou desmarca uma tarefa como favorita
     */
    toggleFavorite: (id: string): Todo | null => {
        const todos = todoService.getTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) return null;

        const updatedTodo = {
            ...todos[todoIndex],
            favorite: !todos[todoIndex].favorite,
            updatedAt: new Date().toISOString()
        };

        todos[todoIndex] = updatedTodo;
        todoService.saveTodos(todos);

        return updatedTodo;
    },

    /**
     * Recupera todas as categorias distintas das tarefas
     */
    getCategories: (): string[] => {
        const todos = todoService.getTodos();
        const categoriesSet = new Set<string>();

        todos.forEach(todo => {
            if (todo.category) {
                categoriesSet.add(todo.category);
            }
        });

        return Array.from(categoriesSet);
    },

    /**
     * Recupera todas as tags distintas das tarefas
     */
    getTags: (): Tag[] => {
        const todos = todoService.getTodos();
        const tagsMap = new Map<string, Tag>();

        todos.forEach(todo => {
            if (todo.tags && todo.tags.length > 0) {
                todo.tags.forEach(tag => {
                    tagsMap.set(tag.id, tag);
                });
            }
        });

        return Array.from(tagsMap.values());
    },

    /**
     * Filtra tarefas por categoria
     */
    filterByCategory: (category: string): Todo[] => {
        const todos = todoService.getTodos();
        return todos.filter(todo => todo.category === category);
    },

    /**
     * Filtra tarefas por tag
     */
    filterByTag: (tagId: string): Todo[] => {
        const todos = todoService.getTodos();
        return todos.filter(todo =>
            todo.tags?.some(tag => tag.id === tagId)
        );
    },

    /**
     * Filtra tarefas por prioridade
     */
    filterByPriority: (priority: PriorityLevel): Todo[] => {
        const todos = todoService.getTodos();
        return todos.filter(todo => todo.priority === priority);
    },

    /**
     * Filtra tarefas por status de conclusão
     */
    filterByCompletion: (completed: boolean): Todo[] => {
        const todos = todoService.getTodos();
        return todos.filter(todo => todo.completed === completed);
    },

    /**
     * Filtra tarefas favoritas
     */
    filterByFavorite: (): Todo[] => {
        const todos = todoService.getTodos();
        return todos.filter(todo => todo.favorite === true);
    },

    /**
     * Filtra tarefas atrasadas
     */
    filterByOverdue: (): Todo[] => {
        const todos = todoService.getTodos();
        const now = new Date();

        return todos.filter(todo => {
            if (!todo.dueDate || todo.completed) return false;
            const dueDate = new Date(todo.dueDate);
            if (todo.dueTime) {
                const [hours, minutes] = todo.dueTime.split(':').map(Number);
                dueDate.setHours(hours, minutes);
            } else {
                // Se não tem hora específica, considera o final do dia
                dueDate.setHours(23, 59, 59);
            }
            return dueDate < now;
        });
    },

    /**
     * Pesquisa tarefas por texto
     */
    searchTodos: (query: string): Todo[] => {
        if (!query.trim()) return todoService.getTodos();

        const todos = todoService.getTodos();
        const normalizedQuery = query.toLowerCase().trim();

        return todos.filter(todo => {
            // Pesquisa no texto principal
            if (todo.text.toLowerCase().includes(normalizedQuery)) return true;

            // Pesquisa nas notas
            if (todo.notes?.toLowerCase().includes(normalizedQuery)) return true;

            // Pesquisa na categoria
            if (todo.category?.toLowerCase().includes(normalizedQuery)) return true;

            // Pesquisa nas subtarefas
            if (todo.subTasks?.some(subTask =>
                subTask.text.toLowerCase().includes(normalizedQuery)
            )) return true;

            // Pesquisa nas tags
            if (todo.tags?.some(tag =>
                tag.name.toLowerCase().includes(normalizedQuery)
            )) return true;

            return false;
        });
    },

    /**
     * Ordena tarefas por data de criação
     */
    sortByDate: (direction: 'asc' | 'desc' = 'desc'): Todo[] => {
        const todos = todoService.getTodos();
        return [...todos].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return direction === 'asc' ? dateA - dateB : dateB - dateA;
        });
    },

    /**
     * Ordena tarefas por data de vencimento
     */
    sortByDueDate: (direction: 'asc' | 'desc' = 'asc'): Todo[] => {
        const todos = todoService.getTodos();
        return [...todos].sort((a, b) => {
            // Coloca itens sem data de vencimento no final
            if (!a.dueDate) return direction === 'asc' ? 1 : -1;
            if (!b.dueDate) return direction === 'asc' ? -1 : 1;

            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return direction === 'asc' ? dateA - dateB : dateB - dateA;
        });
    },

    /**
     * Ordena tarefas por prioridade
     */
    sortByPriority: (direction: 'asc' | 'desc' = 'desc'): Todo[] => {
        const todos = todoService.getTodos();
        const priorityMap = { alta: 3, media: 2, baixa: 1 };

        return [...todos].sort((a, b) => {
            const priorityA = a.priority ? priorityMap[a.priority] : 0;
            const priorityB = b.priority ? priorityMap[b.priority] : 0;
            return direction === 'asc' ? priorityA - priorityB : priorityB - priorityA;
        });
    },

    /**
     * Ordena tarefas alfabeticamente
     */
    sortAlphabetically: (direction: 'asc' | 'desc' = 'asc'): Todo[] => {
        const todos = todoService.getTodos();
        return [...todos].sort((a, b) => {
            return direction === 'asc'
                ? a.text.localeCompare(b.text)
                : b.text.localeCompare(a.text);
        });
    },

    /**
     * Reordena tarefas movendo uma tarefa de uma posição para outra
     */
    reorderTodos: (sourceIndex: number, destinationIndex: number): Todo[] => {
        const todos = todoService.getTodos();

        // Se os índices são iguais ou inválidos, não faz nada
        if (
            sourceIndex === destinationIndex ||
            sourceIndex < 0 ||
            destinationIndex < 0 ||
            sourceIndex >= todos.length ||
            destinationIndex >= todos.length
        ) {
            return todos;
        }

        // Remove o item da posição atual e o insere na nova posição
        const reorderedTodos = [...todos];
        const [movedTodo] = reorderedTodos.splice(sourceIndex, 1);
        reorderedTodos.splice(destinationIndex, 0, movedTodo);

        // Salva a nova ordem
        todoService.saveTodos(reorderedTodos);

        return reorderedTodos;
    },

    /**
     * Apaga todas as tarefas
     */
    clearAllTodos: (): void => {
        todoService.saveTodos([]);
    },

    /**
     * Remove todas as tarefas concluídas
     */
    clearCompletedTodos: (): void => {
        const todos = todoService.getTodos();
        const activeTodos = todos.filter(todo => !todo.completed);
        todoService.saveTodos(activeTodos);
    },

    /**
     * Marca todas as tarefas como concluídas
     */
    markAllAsCompleted: (): void => {
        const todos = todoService.getTodos();
        const now = new Date().toISOString();

        const updatedTodos = todos.map(todo => ({
            ...todo,
            completed: true,
            completedAt: now,
            updatedAt: now
        }));

        todoService.saveTodos(updatedTodos);
    },

    /**
     * Obtém estatísticas das tarefas
     */
    getStats: () => {
        const todos = todoService.getTodos();

        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        const overdue = todoService.filterByOverdue().length;
        const favorites = todos.filter(todo => todo.favorite).length;
        const highPriority = todos.filter(todo => todo.priority === 'alta').length;

        return {
            total,
            completed,
            pending,
            overdue,
            favorites,
            highPriority
        };
    },

    /**
     * Exporta tarefas para diferentes formatos
     */
    exportTodos: (format: 'json' | 'csv' | 'txt', options?: {
        includeCompleted?: boolean;
        includeNotes?: boolean;
        includeSubtasks?: boolean;
    }): string => {
        let todos = todoService.getTodos();

        // Aplicar filtros conforme opções
        if (options?.includeCompleted === false) {
            todos = todos.filter(todo => !todo.completed);
        }

        // Clonar para não modificar originais
        todos = JSON.parse(JSON.stringify(todos));

        // Remover campos conforme opções
        if (options?.includeNotes === false) {
            todos.forEach(todo => delete todo.notes);
        }

        if (options?.includeSubtasks === false) {
            todos.forEach(todo => delete todo.subTasks);
        }

        switch (format) {
            case 'json':
                return JSON.stringify(todos, null, 2);

            case 'csv': {
                // Cabeçalho CSV
                const headers = ['ID', 'Texto', 'Concluída', 'Criada em', 'Favorita', 'Data limite', 'Categoria', 'Prioridade', 'Notas'];

                // Converter cada tarefa para CSV
                const rows = todos.map(todo => {
                    const statusText = todo.completed ? 'Sim' : 'Não';
                    const favoriteText = todo.favorite ? 'Sim' : 'Não';

                    // Escapar texto com aspas para CSV
                    const escapeCSV = (text: string | undefined) =>
                        text ? `"${text.replace(/"/g, '""')}"` : '';

                    return [
                        todo.id,
                        escapeCSV(todo.text),
                        statusText,
                        new Date(todo.createdAt).toLocaleDateString('pt-BR'),
                        favoriteText,
                        todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('pt-BR') : '',
                        escapeCSV(todo.category || ''),
                        todo.priority || '',
                        escapeCSV(todo.notes || '')
                    ].join(',');
                });

                return [headers.join(','), ...rows].join('\n');
            }

            case 'txt': {
                return todos.map(todo => {
                    const status = todo.completed ? '[✓]' : '[ ]';
                    const favorite = todo.favorite ? '[★]' : '';

                    let result = `${status} ${favorite} ${todo.text}\n`;

                    if (todo.dueDate) {
                        result += `    Vencimento: ${new Date(todo.dueDate).toLocaleDateString('pt-BR')}\n`;
                    }

                    if (todo.category) {
                        result += `    Categoria: ${todo.category}\n`;
                    }

                    if (todo.priority) {
                        result += `    Prioridade: ${todo.priority}\n`;
                    }

                    if (todo.notes && options?.includeNotes !== false) {
                        result += `    Notas: ${todo.notes}\n`;
                    }

                    if (todo.subTasks && todo.subTasks.length > 0 && options?.includeSubtasks !== false) {
                        result += '    Subtarefas:\n';
                        todo.subTasks.forEach(subtask => {
                            const subStatus = subtask.completed ? '[✓]' : '[ ]';
                            result += `      ${subStatus} ${subtask.text}\n`;
                        });
                    }

                    return result + '\n';
                }).join('');
            }

            default:
                return JSON.stringify(todos);
        }
    },

    /**
     * Importa tarefas de um JSON
     * @returns Número de tarefas importadas com sucesso
     */
    importFromJSON: (jsonString: string): number => {
        try {
            const importedTodos = JSON.parse(jsonString);

            if (!Array.isArray(importedTodos)) {
                throw new Error('Formato inválido: não é um array');
            }

            // Validação básica
            const validTodos = importedTodos.filter(todo =>
                typeof todo === 'object' &&
                todo !== null &&
                typeof todo.text === 'string' &&
                todo.text.trim() !== ''
            );

            // Garantir que cada tarefa tenha os campos obrigatórios
            const currentTodos = todoService.getTodos();
            const now = new Date().toISOString();

            const processedTodos = validTodos.map(todo => ({
                id: todo.id || uuidv4(),
                text: todo.text,
                completed: Boolean(todo.completed),
                createdAt: todo.createdAt || now,
                updatedAt: now,
                ...todo
            }));

            // Adicionar ao estado existente
            todoService.saveTodos([...currentTodos, ...processedTodos]);

            return processedTodos.length;
        } catch (error) {
            console.error('Erro ao importar tarefas:', error);
            return 0;
        }
    }
};

export default todoService;