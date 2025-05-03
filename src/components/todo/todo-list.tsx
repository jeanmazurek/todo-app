"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tabs, Tab, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge, Progress, Tooltip, Switch } from "@heroui/react";
import { TodoItem } from "./todo-item";
import { Task } from "@/types";
import { todoService } from "@/services/todoService";

export const TodoList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [dragEnabled, setDragEnabled] = useState(true);

    // Pegar parâmetros da URL para data e possível tarefa específica
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const taskIdParam = searchParams.get('task');

    // Estatísticas
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Contagem por prioridade
    const highPriorityCount = tasks.filter(task => task.priority === 'alta').length;
    const mediumPriorityCount = tasks.filter(task => task.priority === 'media').length;
    const lowPriorityCount = tasks.filter(task => task.priority === 'baixa').length;

    // Filtrar tarefas baseado nos filtros selecionados
    const filteredTasks = tasks.filter((task) => {
        // Se temos um ID de tarefa específico na URL, mostrar apenas essa tarefa
        if (taskIdParam && task.id === taskIdParam) {
            return true;
        }

        // Se temos uma data específica na URL, filtrar por essa data
        if (dateParam && !taskIdParam) {
            if (!task.dueDate) return false;
            
            // Comparar as datas em formato YYYY-MM-DD
            const dueDate = new Date(task.dueDate);
            const taskDateStr = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
            return taskDateStr === dateParam;
        }

        // Filtro por status
        const statusMatch =
            filter === "all" ? true :
                filter === "active" ? !task.completed :
                    task.completed;

        // Filtro por prioridade
        const priorityMatch =
            priorityFilter === "all" ? true :
                task.priority === priorityFilter;

        return statusMatch && priorityMatch;
    });

    // Carregar tarefas do localStorage ao iniciar
    useEffect(() => {
        const savedTasks = localStorage.getItem("todos") || localStorage.getItem("tasks");

        // Simulando um pequeno carregamento para mostrar o efeito de transição
        setTimeout(() => {
            if (savedTasks) {
                try {
                    // Precisamos converter as strings de data para objetos Date
                    const parsedTasks = JSON.parse(savedTasks);
                    setTasks(
                        parsedTasks.map((task: any) => ({
                            ...task,
                            createdAt: new Date(task.createdAt),
                        }))
                    );
                } catch (error) {
                    console.error("Erro ao carregar tarefas:", error);
                }
            }
            setIsLoading(false);
        }, 600);
    }, []);

    // Salvar tarefas no localStorage sempre que forem atualizadas
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("todos", JSON.stringify(tasks));
        }
    }, [tasks, isLoading]);

    // Função para reordenar tarefas - implementa a lógica de arrastar e soltar
    const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
        try {
            // Encontrar os IDs das tarefas filtradas no array original
            const draggedTaskId = filteredTasks[dragIndex]?.id;
            const hoverTaskId = filteredTasks[hoverIndex]?.id;

            if (!draggedTaskId || !hoverTaskId) {
                console.error("Erro ao reordenar: IDs de tarefas inválidos");
                return;
            }

            // Encontrar os índices correspondentes no array original
            const originalDragIndex = tasks.findIndex(task => task.id === draggedTaskId);
            const originalHoverIndex = tasks.findIndex(task => task.id === hoverTaskId);

            if (originalDragIndex === -1 || originalHoverIndex === -1) {
                console.error("Índices não encontrados no array original");
                return;
            }

            // Criar uma cópia do array para manipulação
            const newTasks = [...tasks];

            // Removendo a tarefa da posição original e inserindo na nova posição
            const [movedTask] = newTasks.splice(originalDragIndex, 1);
            newTasks.splice(originalHoverIndex, 0, movedTask);

            // Atualizar o estado com as tarefas reordenadas
            setTasks(newTasks);

            // Salvar explicitamente no localStorage para garantir persistência
            localStorage.setItem("todos", JSON.stringify(newTasks));
        } catch (error) {
            console.error("Erro durante a reordenação de tarefas:", error);
        }
    }, [tasks, filteredTasks]);

    const addTask = () => {
        if (newTask.trim() === "") return;

        // Criar uma data com o horário definido como meio-dia para evitar problemas de fuso horário
        let taskDueDate = undefined;
        if (dateParam) {
            // Extrair os componentes da data (ano, mês, dia) da string de data
            const [year, month, day] = dateParam.split('-').map(num => parseInt(num, 10));
            
            // Criar a data com horário ao meio-dia para evitar problemas de mudança de dia devido ao fuso horário
            taskDueDate = new Date(year, month - 1, day, 12, 0, 0);
        }

        const newTaskItem: Task = {
            id: crypto.randomUUID(),
            text: newTask.trim(),
            completed: false,
            priority: 'media', // Prioridade padrão
            createdAt: new Date(),
            dueDate: taskDueDate,
        };

        setTasks([newTaskItem, ...tasks]);
        setNewTask("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            addTask();
        }
    };

    const toggleTaskComplete = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? {
                    ...task,
                    completed: !task.completed,
                    // Definir ou limpar a data de conclusão
                    completedAt: !task.completed ? new Date().toISOString() : undefined
                } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const editTask = (updatedTask: Task) => {
        setTasks(
            tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
    };

    const clearCompleted = () => {
        setTasks(tasks.filter((task) => !task.completed));
    };

    // Se temos um ID de tarefa específico na URL e um taskCount diferente de zero,
    // desabilitar os filtros e mostrar apenas essa tarefa
    useEffect(() => {
        if (taskIdParam && tasks.length > 0) {
            setFilter("all");
            setPriorityFilter("all");
        }
    }, [taskIdParam, tasks.length]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Carregando tarefas..."
                    className="max-w-md mx-auto mb-4"
                />
                <p className="text-default-500">Carregando suas tarefas...</p>
            </div>
        );
    }

    return (
        <div className="todo-container todo-animate-in">
            {/* Estatísticas */}
            <div className="todo-stats-panel">
                <div className="todo-stats-header">
                    <h4 className="text-md font-medium">Progresso</h4>
                    <Tooltip content={`${completedTasks} de ${totalTasks} tarefas concluídas`}>
                        <Chip
                            color={completionRate >= 80 ? "success" : completionRate >= 40 ? "warning" : "primary"}
                            variant="shadow"
                            className="todo-transition"
                        >
                            {completionRate}% concluído
                        </Chip>
                    </Tooltip>
                </div>
                <Progress
                    aria-label="Progresso de tarefas"
                    size="md"
                    radius="sm"
                    value={completionRate}
                    color={completionRate >= 80 ? "success" : completionRate >= 40 ? "warning" : "primary"}
                    className="mb-4 todo-transition"
                    showValueLabel
                />
                <div className="flex gap-4 justify-center mt-4">
                    <div className="flex gap-1">
                        <Badge content={highPriorityCount} color="danger" size="sm">
                            <Chip size="sm" variant="flat" color="danger" className="todo-hover-scale">Alta</Chip>
                        </Badge>
                    </div>
                    <div className="flex gap-1">
                        <Badge content={mediumPriorityCount} color="warning" size="sm">
                            <Chip size="sm" variant="flat" color="warning" className="todo-hover-scale">Média</Chip>
                        </Badge>
                    </div>
                    <div className="flex gap-1">
                        <Badge content={lowPriorityCount} color="success" size="sm">
                            <Chip size="sm" variant="flat" color="success" className="todo-hover-scale">Baixa</Chip>
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="todo-input-container">
                <Input
                    placeholder={dateParam 
                        ? `Adicionar tarefa para ${new Date(dateParam).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}...` 
                        : "Adicionar nova tarefa..."}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                    size="lg"
                    variant="bordered"
                    radius="lg"
                    startContent={<span className="text-lg text-default-400">+</span>}
                    classNames={{
                        inputWrapper: "shadow-sm hover:shadow todo-transition",
                    }}
                />
                <Button
                    color="primary"
                    onPress={addTask}
                    size="lg"
                    radius="lg"
                    className="px-6 font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 todo-transition"
                >
                    Adicionar
                </Button>
            </div>

            {dateParam && !taskIdParam && (
                <div className="my-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-sm">
                    <p>Mostrando tarefas para: <strong>{new Date(dateParam).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></p>
                    <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="mt-2"
                        onClick={() => {
                            // Remover o filtro de data da URL
                            window.history.pushState({}, '', '/');
                            // Recarregar a página para mostrar todas as tarefas
                            window.location.reload();
                        }}
                    >
                        Mostrar todas
                    </Button>
                </div>
            )}

            {taskIdParam && (
                <div className="my-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-sm">
                    <p>Visualizando tarefa específica</p>
                    <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="mt-2"
                        onClick={() => {
                            // Remover o ID da tarefa da URL
                            const url = new URL(window.location.href);
                            url.searchParams.delete('task');
                            window.history.pushState({}, '', url);
                            // Recarregar a página para mostrar todas as tarefas
                            window.location.reload();
                        }}
                    >
                        Voltar
                    </Button>
                </div>
            )}

            <div className="todo-filters-container">
                <Tabs
                    aria-label="Filtros"
                    color="primary"
                    variant="underlined"
                    selectedKey={filter}
                    onSelectionChange={(key) => setFilter(key as any)}
                    className="flex-1"
                    size="lg"
                    classNames={{
                        tab: "data-[selected=true]:font-medium",
                        tabList: "gap-6",
                        cursor: "w-full bg-gradient-to-r from-primary to-secondary",
                    }}
                >
                    <Tab key="all" title="Todas" />
                    <Tab key="active" title="Ativas" />
                    <Tab key="completed" title="Concluídas" />
                </Tabs>

                <div className="flex items-center gap-3">
                    <Tooltip content="Habilitar/desabilitar reordenação de tarefas" placement="top">
                        <div className="flex items-center gap-2">
                            <Switch
                                isSelected={dragEnabled}
                                onValueChange={setDragEnabled}
                                size="sm"
                                color="primary"
                            />
                            <span className="text-sm text-default-500">Reordenar</span>
                        </div>
                    </Tooltip>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                size="md"
                                radius="full"
                                className="min-w-[140px]"
                            >
                                {priorityFilter === 'all' ? 'Todas prioridades' :
                                    priorityFilter === 'alta' ? '🔴 Alta prioridade' :
                                        priorityFilter === 'media' ? '🟠 Média prioridade' :
                                            '🟢 Baixa prioridade'}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Filtrar por prioridade"
                            selectedKeys={[priorityFilter]}
                            onSelectionChange={(keys) => {
                                const selectedKey = Array.from(keys).join('');
                                if (selectedKey) {
                                    setPriorityFilter(selectedKey);
                                }
                            }}
                            selectionMode="single"
                            variant="flat"
                        >
                            <DropdownItem key="all">Todas prioridades</DropdownItem>
                            <DropdownItem key="alta" startContent="🔴">Alta</DropdownItem>
                            <DropdownItem key="media" startContent="🟠">Média</DropdownItem>
                            <DropdownItem key="baixa" startContent="🟢">Baixa</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <div className="space-y-4 perspective">
                {filteredTasks.length === 0 ? (
                    <div className="todo-empty-state">
                        <div className="text-3xl mb-2">✨</div>
                        <p className="text-default-500 font-medium">
                            {filter === "all" && priorityFilter === "all"
                                ? "Adicione sua primeira tarefa!"
                                : "Nenhuma tarefa corresponde aos filtros."}
                        </p>
                    </div>
                ) : (
                    filteredTasks.map((task, index) => (
                        <div
                            key={task.id}
                            className={`todo-item todo-delay-${index % 10}`}
                        >
                            <TodoItem
                                task={task}
                                index={index}
                                onToggleComplete={toggleTaskComplete}
                                onDelete={deleteTask}
                                onEdit={editTask}
                                moveTask={dragEnabled ? moveTask : undefined}
                            />
                        </div>
                    ))
                )}
            </div>

            {tasks.some((task) => task.completed) && (
                <div className="todo-footer">
                    <Button
                        size="md"
                        color="danger"
                        variant="light"
                        onPress={clearCompleted}
                        radius="full"
                        className="hover:bg-danger-50 todo-transition"
                    >
                        Limpar concluídas
                    </Button>
                </div>
            )}

            {tasks.length > 0 && (
                <div className="todo-counter">
                    <span>{tasks.filter((t) => !t.completed).length} tarefas restantes de {tasks.length} total</span>
                </div>
            )}
        </div>
    );
};