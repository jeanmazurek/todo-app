"use client";

import { title, subtitle } from "@/components/primitives";
import { TodoList } from "@/components/todo/todo-list";
import { Card, CardBody, CardHeader, CardFooter, Divider } from "@heroui/react";
import "@/styles/components/todo.css";

export default function TodoPage() {
    return (
        <div className="flex flex-col items-center gap-12 py-12 px-6 md:py-16 md:px-10">
            <div className="text-center max-w-3xl">
                <h1 className={title({ color: "blue", className: "bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent" })}>
                    Gerenciador de Tarefas
                </h1>
                <h2 className={subtitle({ className: "mt-4" })}>
                    Organize seu dia a dia com nosso gerenciador de tarefas moderno
                </h2>
            </div>

            <Card className="w-full max-w-7xl mx-auto shadow-xl border border-opacity-20 backdrop-blur-sm">
                <CardHeader className="flex justify-center pb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Minhas Tarefas</h3>
                </CardHeader>
                <Divider className="opacity-50" />
                <CardBody className="py-8 px-4 md:px-8">
                    <TodoList />
                </CardBody>
                <Divider className="opacity-50" />
                <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between items-center py-5">
                    <p className="text-default-400 text-sm">
                        Dica: Passe o mouse sobre uma tarefa para acessar as opções
                    </p>
                    <span className="text-xs font-medium bg-default-100 px-3 py-1.5 rounded-full">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
}