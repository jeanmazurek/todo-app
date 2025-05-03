import React, { useState, useMemo, useCallback } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, CalendarDayIcon } from '@/components/icons';
import { CalendarDayCell } from './CalendarDayCell';
import { CalendarDayTasks } from './CalendarDayTasks';
import { Todo } from '@/types';

interface CalendarViewProps {
    todos: Todo[];
    onDateSelect: (date: Date) => void;
    onTodoClick: (todo: Todo) => void;
    onToggleTodo: (todo: Todo) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ todos, onDateSelect, onTodoClick, onToggleTodo }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const today = useMemo(() => new Date(), []);

    const todosByDate = useMemo(() => {
        const map = new Map<string, Todo[]>();
        todos.forEach(todo => {
            if (todo.dueDate) {
                try {
                    const dateObj = new Date(todo.dueDate);
                    
                    // Normalizar a data para evitar problemas com fuso horário
                    // Extraindo apenas ano, mês e dia
                    const year = dateObj.getFullYear();
                    const month = dateObj.getMonth();
                    const day = dateObj.getDate();
                    
                    // Criar uma nova data com horário meio-dia para evitar problemas de fuso horário
                    const normalizedDate = new Date(year, month, day, 12, 0, 0);
                    
                    // Formatar a chave de data para garantir agrupamento correto
                    const dateKey = format(normalizedDate, 'yyyy-MM-dd');
                    
                    const existing = map.get(dateKey) || [];
                    map.set(dateKey, [...existing, todo]);
                } catch (e) {
                    console.error("Data inválida encontrada:", todo.dueDate, e);
                }
            }
        });
        return map;
    }, [todos]);

    const getTodosByDate = useCallback((date: Date): Todo[] => {
        const dateKey = format(date, 'yyyy-MM-dd');
        return todosByDate.get(dateKey) || [];
    }, [todosByDate]);

    const getHighestPriority = useCallback((date: Date): 'alta' | 'media' | 'baixa' | null => {
        const dayTodos = getTodosByDate(date);
        if (dayTodos.length === 0) return null;

        const priorities = dayTodos.map(todo => todo.priority).filter(Boolean) as ('alta' | 'media' | 'baixa')[];
        if (priorities.includes('alta')) return 'alta';
        if (priorities.includes('media')) return 'media';
        if (priorities.includes('baixa')) return 'baixa';
        return null;
    }, [getTodosByDate]);

    const prevMonth = useCallback(() => {
        setCurrentMonth(subMonths(currentMonth, 1));
    }, [currentMonth]);

    const nextMonth = useCallback(() => {
        setCurrentMonth(addMonths(currentMonth, 1));
    }, [currentMonth]);

    const goToToday = useCallback(() => {
        const now = new Date();
        setCurrentMonth(now);
        setSelectedDate(now);
    }, []);

    const handleDateClick = useCallback((day: Date) => {
        setSelectedDate(day);
        onDateSelect(day);
    }, [onDateSelect]);

    const renderHeader = () => {
        const weekdays = [];
        const start = startOfWeek(new Date(), { locale: ptBR });
        for (let i = 0; i < 7; i++) {
            weekdays.push(
                <div key={i} className="text-xs font-medium py-2 text-center text-gray-500 dark:text-gray-400">
                    {format(addDays(start, i), 'eee', { locale: ptBR })}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-1">{weekdays}</div>;
    };

    const dateInterval = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart, { locale: ptBR });
        const endDate = startOfWeek(addDays(monthEnd, 6), { locale: ptBR });

        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);

    const renderDays = () => {
        const weeks: Date[][] = [];
        for (let i = 0; i < dateInterval.length; i += 7) {
            weeks.push(dateInterval.slice(i, i + 7));
        }
        return (
            <div className="calendar-grid" aria-labelledby="calendar-heading">
                <div className="calendar-grid-body">
                    {weeks.map((week, weekIdx) => (
                        <div className="grid grid-cols-7 gap-1" key={weekIdx}>
                            {week.map((day, i) => {
                                const isCurrentMonthFlag = isSameMonth(day, currentMonth);
                                const isSelectedFlag = isSameDay(day, selectedDate);
                                const isTodayFlag = isSameDay(day, today);
                                const todosForDay = getTodosByDate(day);
                                const highestPriority = getHighestPriority(day);

                                return (
                                    <CalendarDayCell
                                        key={i}
                                        day={day}
                                        isCurrentMonth={isCurrentMonthFlag}
                                        isSelected={isSelectedFlag}
                                        isToday={isTodayFlag}
                                        todosForDay={todosForDay}
                                        highestPriority={highestPriority}
                                        onClick={handleDateClick}
                                        onTodoClick={onTodoClick}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const todosForSelectedDay = getTodosByDate(selectedDate);

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/30">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 id="calendar-heading" className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                        {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                    <div className="flex items-center gap-1 sm:gap-3">
                        <button
                            type="button"
                            aria-label="Ir para hoje"
                            title="Ir para hoje"
                            onClick={goToToday}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400 hidden sm:block"
                        >
                            <CalendarDayIcon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Mês anterior"
                            onClick={prevMonth}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Mês seguinte"
                            onClick={nextMonth}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {renderHeader()}
            </div>

            <div className="p-2">
                {renderDays()}
            </div>

            <CalendarDayTasks
                selectedDate={selectedDate}
                tasks={todosForSelectedDay}
                onTaskClick={onTodoClick}
                onToggleTask={onToggleTodo}
                onAddTask={onDateSelect}
            />
        </div>
    );
};