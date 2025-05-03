"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarView } from "@/components/calendar/CalendarView";
import { Button } from "@heroui/button";
import { TodoItem } from "@/components/todo/todo-item";
import { Input } from "@heroui/input";
import { Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { PlusIcon, CalendarIcon } from "@/components/icons";
import { Todo } from '@/types';

// Modal de confirmação para substituir o componente ConfirmationModal que não foi encontrado
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <p>{message}</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={onClose}>
                        {cancelText}
                    </Button>
                    <Button color="danger" onPress={onConfirm}>
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const CalendarPage = () => {
    // Estados
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("todas");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; index: number | null }>({
        show: false,
        index: null,
    });
    const router = useRouter();

    // Buscar tarefas do localStorage
    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            const parsedTodos = JSON.parse(savedTodos);
            setTodos(parsedTodos);

            // Extrair categorias únicas
            const uniqueCategories = Array.from(
                new Set(parsedTodos.filter((t: Todo) => t.category).map((t: Todo) => t.category))
            ) as string[];
            setCategories(uniqueCategories);
        }
    }, []);

    // Filtrar tarefas para a data selecionada ou por categoria
    useEffect(() => {
        let filtered = todos;

        // Filtrar por categoria se não for "todas"
        if (selectedCategory !== "todas") {
            filtered = filtered.filter(
                (todo) => todo.category === selectedCategory
            );
        }

        setFilteredTodos(filtered);
    }, [todos, selectedCategory]);

    // Verificar se uma tarefa está atrasada
    const isOverdue = useCallback((todo: Todo) => {
        if (!todo.dueDate || todo.completed) return false;
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(23, 59, 59, 999);
        return dueDate < new Date();
    }, []);

    // Funções para gerenciar as tarefas
    const handleToggleComplete = (id: string) => {
        const todosCopy = [...todos];
        const index = todosCopy.findIndex((t) => t.id === id);

        if (index !== -1) {
            todosCopy[index].completed = !todosCopy[index].completed;

            // Adicionar data de conclusão ou remover se estiver desmarcando
            if (todosCopy[index].completed) {
                todosCopy[index].completedAt = new Date().toISOString();
            } else {
                todosCopy[index].completedAt = undefined;
            }

            setTodos(todosCopy);
            localStorage.setItem('todos', JSON.stringify(todosCopy));
        }
    };

    const handleDelete = (id: string) => {
        const todosCopy = [...todos];
        const index = todosCopy.findIndex((t) => t.id === id);

        if (index !== -1) {
            todosCopy.splice(index, 1);
            setTodos(todosCopy);
            localStorage.setItem('todos', JSON.stringify(todosCopy));
        }
    };

    const handleEdit = (updatedTask: Todo) => {
        const todosCopy = [...todos];
        const index = todosCopy.findIndex((t) => t.id === updatedTask.id);

        if (index !== -1) {
            todosCopy[index] = updatedTask;
            setTodos(todosCopy);
            localStorage.setItem('todos', JSON.stringify(todosCopy));

            // Atualizar categorias se necessário
            if (updatedTask.category && !categories.includes(updatedTask.category)) {
                setCategories([...categories, updatedTask.category]);
            }
        }
    };

    // Funções específicas para o calendário
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        // Permanece na página de calendário com a data selecionada como parâmetro
        router.push(`/calendar?date=${formatDate(date)}`);
    };

    // Função auxiliar para formatar a data no formato YYYY-MM-DD
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Função para navegar para a página de nova tarefa com a data selecionada
    const navigateToAddTask = useCallback((date: Date) => {
        // Garantir que a data é formatada corretamente
        const formattedDate = formatDate(date);
        router.push(`/?date=${formattedDate}`);
    }, [router]);

    const handleTodoClick = (todo: Todo) => {
        // Usar a função formatDate para garantir consistência
        const date = todo.dueDate ? new Date(todo.dueDate) : new Date();
        router.push(`/?date=${formatDate(date)}&task=${todo.id}`);
    };

    // Tarefas do dia selecionado
    const todosForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];

        return todos.filter(todo => {
            if (!todo.dueDate) return false;
            const dueDate = new Date(todo.dueDate);
            return (
                dueDate.getFullYear() === selectedDate.getFullYear() &&
                dueDate.getMonth() === selectedDate.getMonth() &&
                dueDate.getDate() === selectedDate.getDate()
            );
        });
    }, [todos, selectedDate]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6 text-blue-500" />
                    <span>Calendário de Tarefas</span>
                </h1>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Filtro de categorias */}
                    <Select
                        size="sm"
                        label="Filtrar por categoria"
                        selectedKeys={[selectedCategory]}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-44"
                        radius="lg"
                    >
                        <SelectItem key="todas" textValue="Todas as categorias">
                            Todas as categorias
                        </SelectItem>
                        <>
                            {categories.map((cat) => (
                                <SelectItem key={cat} textValue={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </>
                    </Select>

                    {/* Botão para adicionar nova tarefa */}
                    <Button
                        color="primary"
                        startContent={<PlusIcon size={20} />}
                        onClick={() => navigateToAddTask(selectedDate)}
                        className="w-full sm:w-auto"
                        radius="lg"
                    >
                        Nova Tarefa
                    </Button>
                </div>
            </div>

            {/* Visualização do calendário */}
            <CalendarView
                todos={todos}
                onDateSelect={handleDateSelect}
                onTodoClick={handleTodoClick}
                onToggleTodo={(todo) => {
                    handleToggleComplete(todo.id);
                }}
            />

            {/* Lista de tarefas para o dia selecionado */}
            {todosForSelectedDate.length > 0 ? (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">
                        Tarefas para {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </h2>
                    <ul className="space-y-4">
                        {todosForSelectedDate.map((task, index) => (
                            <TodoItem
                                key={task.id}
                                task={task}
                                index={index}
                                onToggleComplete={handleToggleComplete}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="mt-6 text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-gray-500 dark:text-gray-400">
                        Não há tarefas agendadas para {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}.
                    </p>
                    <Button
                        color="primary"
                        variant="flat"
                        startContent={<PlusIcon size={16} />}
                        onClick={() => navigateToAddTask(selectedDate)}
                        className="mt-3"
                        radius="lg"
                    >
                        Adicionar tarefa para este dia
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;