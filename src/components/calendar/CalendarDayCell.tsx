import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Todo } from '@/types';

interface CalendarDayCellProps {
    day: Date;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
    todosForDay: Todo[];
    highestPriority: 'alta' | 'media' | 'baixa' | null;
    onClick: (day: Date) => void;
    onTodoClick: (todo: Todo) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = React.memo(({
    day,
    isCurrentMonth,
    isSelected,
    isToday,
    todosForDay,
    highestPriority,
    onClick,
    onTodoClick
}) => {
    const todosCount = todosForDay.length;

    let priorityColor = '';
    if (highestPriority === 'alta') priorityColor = 'bg-red-500';
    else if (highestPriority === 'media') priorityColor = 'bg-yellow-500';
    else if (highestPriority === 'baixa') priorityColor = 'bg-blue-500';

    const handleClick = () => {
        if (isCurrentMonth) {
            onClick(day);
        }
    };

    return (
        <div
            className={clsx(
                "h-20 p-1 relative border transition-colors cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10",
                isCurrentMonth ? "bg-white dark:bg-zinc-800" : "bg-gray-50 dark:bg-zinc-900 text-gray-400 dark:text-gray-600 pointer-events-none opacity-50",
                isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200 dark:border-gray-700/50",
                isCurrentMonth && !isSelected ? "hover:border-blue-300 dark:hover:border-blue-700" : "",
                isToday ? "font-bold" : ""
            )}
            onClick={handleClick}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') handleClick();
            }}
            role="button"
            tabIndex={isCurrentMonth ? 0 : -1}
            aria-label={format(day, "d 'de' MMMM", { locale: ptBR })}
        >
            <div className={clsx("text-right mb-1 text-sm", isToday ? "text-blue-600 dark:text-blue-400" : "")}>
                {format(day, 'd')}
            </div>

            {isCurrentMonth && todosCount > 0 && (
                <div className="absolute bottom-1 left-1 right-1">
                    {todosCount > 2 ? (
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                                {highestPriority && <div className={`w-2 h-2 rounded-full ${priorityColor}`}></div>}
                                <span className="text-gray-600 dark:text-gray-400">{todosCount} tarefas</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1 overflow-hidden max-h-10">
                            {todosForDay.slice(0, 2).map((todo, idx) => {
                                let dotColor = 'bg-gray-400 dark:bg-gray-500';
                                if (todo.priority === 'alta') dotColor = 'bg-red-500';
                                else if (todo.priority === 'media') dotColor = 'bg-yellow-500';
                                else if (todo.priority === 'baixa') dotColor = 'bg-blue-500';

                                return (
                                    <div
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTodoClick(todo);
                                        }}
                                        title={todo.text}
                                        className="text-xs truncate flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`}></div>
                                        <div className={`truncate flex-1 ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {todo.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

CalendarDayCell.displayName = 'CalendarDayCell';