import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PlusIcon } from '@/components/icons';
import { Todo } from '@/types'; // Importar o tipo Todo do arquivo de tipos global

interface CalendarDayTasksProps {
    selectedDate: Date;
    tasks: Todo[];
    onTaskClick: (todo: Todo) => void;
    onToggleTask: (todo: Todo) => void;
    onAddTask: (date: Date) => void;
}

export const CalendarDayTasks: React.FC<CalendarDayTasksProps> = ({
    selectedDate,
    tasks,
    onTaskClick,
    onToggleTask,
    onAddTask
}) => {
    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">
                    Tarefas para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </h3>
                <button
                    className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => onAddTask(selectedDate)}
                    title="Adicionar nova tarefa para esta data"
                >
                    <PlusIcon className="h-3 w-3" />
                    Adicionar
                </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto px-2 py-1">
                {tasks.length === 0 ? (
                    <div className="py-4 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma tarefa para este dia.</p>
                    </div>
                ) : (
                    tasks.map((todo, idx) => {
                        let borderColor = 'border-l-gray-300 dark:border-l-gray-600';
                        if (todo.priority === 'alta') borderColor = 'border-l-red-500';
                        else if (todo.priority === 'media') borderColor = 'border-l-yellow-500';
                        else if (todo.priority === 'baixa') borderColor = 'border-l-blue-500';

                        return (
                            <div
                                key={idx}
                                onClick={() => onTaskClick(todo)}
                                className={`pl-2 py-1.5 border-l-2 ${borderColor} flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/50 rounded text-sm`}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            onToggleTask(todo);
                                        }}
                                        className="h-4 w-4 text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 flex-shrink-0"
                                        aria-label={`Marcar tarefa "${todo.text}" como concluída`}
                                    />
                                    <div className={`truncate ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {todo.text}
                                    </div>
                                </div>
                                {todo.category && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 ml-2 flex-shrink-0">
                                        {todo.category}
                                    </span>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};