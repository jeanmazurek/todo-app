"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CircularProgress } from "@heroui/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import todoService from "@/services/todoService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faClock, faCalendarAlt, faChartBar, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// Componente para exibir mensagem quando não há tarefas
const NoTasksMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <FontAwesomeIcon icon={faInfoCircle} className="text-4xl text-default-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">Nenhuma tarefa encontrada</h3>
        <p className="text-default-500 max-w-md">
            Adicione algumas tarefas para visualizar estatísticas detalhadas sobre sua produtividade.
        </p>
    </div>
);

export default function StatsContent() {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        favorites: 0,
        highPriority: 0
    });

    const [categoryStats, setCategoryStats] = useState<{ name: string, count: number }[]>([]);
    const [weekdayStats, setWeekdayStats] = useState<{ name: string, count: number }[]>([]);
    const [priorityStats, setPriorityStats] = useState<{ name: string, value: number, color: string }[]>([]);
    const [completionRateByCategory, setCompletionRateByCategory] = useState<{ name: string, completed: number, pending: number }[]>([]);
    const [completionRate, setCompletionRate] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            loadStats();
        } catch (err) {
            console.error('Erro ao carregar estatísticas:', err);
            setError('Ocorreu um erro ao carregar as estatísticas. Por favor, atualize a página.');
            setLoading(false);
        }
    }, []);

    const loadStats = () => {
        setLoading(true);
        setError(null);

        try {
            // Estatísticas básicas
            const basicStats = todoService.getStats();
            setStats(basicStats);

            // Taxa de conclusão
            const completionRate = basicStats.total > 0
                ? Math.round((basicStats.completed / basicStats.total) * 100)
                : 0;
            setCompletionRate(completionRate);

            // Estatísticas por categoria
            const todos = todoService.getTodos();

            if (todos.length === 0) {
                setLoading(false);
                return; // Não há tarefas para analisar
            }

            const categoryCounts: Record<string, { total: number, completed: number }> = {};

            // Contagem por categoria e taxa de conclusão por categoria
            todos.forEach(todo => {
                const category = todo.category || "Sem categoria";

                if (!categoryCounts[category]) {
                    categoryCounts[category] = { total: 0, completed: 0 };
                }

                categoryCounts[category].total++;

                if (todo.completed) {
                    categoryCounts[category].completed++;
                }
            });

            // Formatar dados para os gráficos
            const categoryData = Object.entries(categoryCounts).map(([name, { total }]) => ({
                name,
                count: total
            })).sort((a, b) => b.count - a.count);

            const completionByCategory = Object.entries(categoryCounts).map(([name, { total, completed }]) => ({
                name,
                completed,
                pending: total - completed
            })).filter(cat => cat.completed > 0 || cat.pending > 0).sort((a, b) =>
                (b.completed + b.pending) - (a.completed + a.pending)
            );

            setCategoryStats(categoryData);
            setCompletionRateByCategory(completionByCategory);

            // Estatísticas por dia da semana
            const weekdays: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
            const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

            todos.forEach(todo => {
                if (todo.createdAt) {
                    const date = new Date(todo.createdAt);
                    const day = date.getDay();
                    weekdays[day]++;
                }
            });

            const weekdayData = Object.entries(weekdays).map(([day, count]) => ({
                name: weekdayNames[parseInt(day)],
                count
            }));

            setWeekdayStats(weekdayData);

            // Estatísticas por prioridade
            const priorityCounts = {
                alta: 0,
                media: 0,
                baixa: 0,
                undefined: 0
            };

            todos.forEach(todo => {
                const priority = todo.priority || "undefined";
                priorityCounts[priority]++;
            });

            const priorityData = [
                { name: "Alta", value: priorityCounts.alta, color: "#f31260" },
                { name: "Média", value: priorityCounts.media, color: "#f5a524" },
                { name: "Baixa", value: priorityCounts.baixa, color: "#17c964" },
                { name: "Indefinida", value: priorityCounts.undefined, color: "#889096" }
            ].filter(p => p.value > 0);

            setPriorityStats(priorityData);
        } catch (err) {
            console.error('Erro ao processar estatísticas:', err);
            setError('Ocorreu um erro ao processar as estatísticas.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <CircularProgress aria-label="Carregando estatísticas..." className="mb-4" />
                <p className="text-default-500">Carregando estatísticas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-danger mb-4">
                    <FontAwesomeIcon icon={faInfoCircle} size="2x" />
                </div>
                <p className="text-danger">{error}</p>
                <button
                    onClick={() => loadStats()}
                    className="mt-4 px-4 py-2 rounded-md bg-primary text-white"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    if (stats.total === 0) {
        return <NoTasksMessage />;
    }

    return (
        <div className="space-y-8">
            {/* Cards com números gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardBody className="p-6">
                        <div className="text-lg text-blue-600 dark:text-blue-400 mb-1">Total de Tarefas</div>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CardBody className="p-6">
                        <div className="text-lg text-green-600 dark:text-green-400 mb-1">Tarefas Concluídas</div>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.completed}</div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                    <CardBody className="p-6">
                        <div className="text-lg text-yellow-600 dark:text-yellow-400 mb-1">Tarefas Pendentes</div>
                        <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                    <CardBody className="p-6">
                        <div className="text-lg text-red-600 dark:text-red-400 mb-1">Tarefas Atrasadas</div>
                        <div className="text-3xl font-bold text-red-700 dark:text-red-300">{stats.overdue}</div>
                    </CardBody>
                </Card>
            </div>

            {/* Taxa de conclusão */}
            <div className="flex flex-col items-center my-8">
                <h4 className="text-xl font-semibold mb-4">Taxa de Conclusão</h4>
                <div className="relative h-52 w-52 flex items-center justify-center">
                    <CircularProgress
                        classNames={{
                            svg: "drop-shadow-md",
                            indicator: completionRate >= 80 ? "stroke-success" : completionRate >= 40 ? "stroke-warning" : "stroke-primary",
                            track: "stroke-default-100"
                        }}
                        value={completionRate}
                        strokeWidth={5}
                        size="lg"
                    />
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{completionRate}%</span>
                        <span className="text-sm text-default-500">concluído</span>
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de barras por categoria */}
                {categoryStats.length > 0 && (
                    <Card className="bg-content1/40 shadow-sm">
                        <CardBody>
                            <h4 className="text-xl font-semibold mb-4">
                                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                                Tarefas por Categoria
                            </h4>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={categoryStats}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
                                        barSize={35}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis
                                            dataKey="name"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis />
                                        <Bar
                                            dataKey="count"
                                            name="Tarefas"
                                            fill="var(--primary)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* Gráfico de pizza por prioridade */}
                {priorityStats.length > 0 && (
                    <Card className="bg-content1/40 shadow-sm">
                        <CardBody>
                            <h4 className="text-xl font-semibold mb-4">
                                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                                Tarefas por Prioridade
                            </h4>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={priorityStats}
                                            nameKey="name"
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            labelLine={true}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {priorityStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>

            {/* Gráfico adicional - Atividade por dia da semana */}
            {weekdayStats.some(day => day.count > 0) && (
                <Card className="bg-content1/40 shadow-sm">
                    <CardBody>
                        <h4 className="text-xl font-semibold mb-4">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                            Atividade por Dia da Semana
                        </h4>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={weekdayStats}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                                    barSize={35}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Bar
                                        dataKey="count"
                                        name="Tarefas criadas"
                                        fill="var(--secondary)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Conclusão por categoria */}
            {completionRateByCategory.length > 0 && (
                <Card className="bg-content1/40 shadow-sm">
                    <CardBody>
                        <h4 className="text-xl font-semibold mb-4">
                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                            Conclusão por Categoria
                        </h4>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={completionRateByCategory}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
                                    barSize={35}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis />
                                    <Legend />
                                    <Bar
                                        dataKey="completed"
                                        name="Concluídas"
                                        stackId="a"
                                        fill="var(--success)"
                                        radius={[4, 0, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="pending"
                                        name="Pendentes"
                                        stackId="a"
                                        fill="var(--warning)"
                                        radius={[0, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}