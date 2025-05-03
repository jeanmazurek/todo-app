"use client";

import { Checkbox, Select, SelectItem, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState, useRef } from "react";
import { Todo, PriorityLevel } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faTrash,
    faEllipsisV,
    faFlag,
    faSave,
    faExclamationCircle,
    faCheckCircle,
    faGripVertical,
    faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import { useDrag, useDrop } from 'react-dnd';

interface TodoItemProps {
    task: Todo;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Todo) => void;
    index: number;
    moveTask?: (dragIndex: number, hoverIndex: number) => void;
}

// Tipo de item para o DnD
const ItemType = 'TODO_ITEM';

export const TodoItem = ({
    task,
    onToggleComplete,
    onDelete,
    onEdit,
    index,
    moveTask
}: TodoItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(task.text);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const ref = useRef<HTMLDivElement>(null);

    // Configuração do Drag and Drop
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: moveTask !== undefined, // Só permite arrastar se a função moveTask for fornecida
    });

    // Configuração do Drop (aceitar outros itens arrastados)
    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem: { index: number }, monitor) => {
            try {
                if (!ref.current || !moveTask) {
                    return;
                }

                const dragIndex = draggedItem.index;
                const hoverIndex = index;

                // Não substituir itens com eles mesmos
                if (dragIndex === hoverIndex) {
                    return;
                }

                // Determina o retângulo na tela
                const hoverBoundingRect = ref.current.getBoundingClientRect();

                // Obtém a posição vertical do meio
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

                // Determina a posição do mouse
                const clientOffset = monitor.getClientOffset();

                if (!clientOffset) return;

                // Obtém pixels até o topo
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                // Só realizar a movimentação quando o mouse passar do meio do item
                // Quando arrastando para baixo, só mover quando o cursor passar da metade
                // Quando arrastando para cima, só mover quando o cursor passar da metade
                if (
                    (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
                    (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
                ) {
                    return;
                }

                // Realiza a ação de reordenação
                moveTask(dragIndex, hoverIndex);

                // Atualiza o índice do item arrastado
                draggedItem.index = hoverIndex;
            } catch (error) {
                console.error("Erro durante o drag and drop:", error);
            }
        }
    });

    // Combina as refs do drag e drop
    drag(drop(ref));

    const handleEdit = () => {
        if (isEditing) {
            // Salvar a edição
            onEdit({ ...task, text: editedValue.trim() || task.text });
        }
        setIsEditing(!isEditing);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleEdit();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setEditedValue(task.text); // Restaura o valor original
        }
    };

    const handlePriorityChange = (value: string) => {
        onEdit({
            ...task,
            priority: value as PriorityLevel
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        onEdit({
            ...task,
            dueDate: newDate
        });
    };

    const clearDueDate = () => {
        setSelectedDate('');
        onEdit({
            ...task,
            dueDate: undefined
        });
    };

    const confirmDelete = () => {
        setIsDeleting(true);
        setTimeout(() => {
            onDelete(task.id);
        }, 300);
        setIsDeleteModalOpen(false);
    };

    // Define a cor base na prioridade
    const priorityColors: Record<string, string> = {
        'baixa': 'success',
        'media': 'warning',
        'alta': 'danger',
    };
    const priorityColor = priorityColors[task.priority || 'media'];

    // Ícones para cada prioridade
    const priorityIcons: Record<string, JSX.Element> = {
        'baixa': <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
        'media': <FontAwesomeIcon icon={faExclamationCircle} className="text-warning" />,
        'alta': <FontAwesomeIcon icon={faFlag} className="text-danger" />,
    };
    const priorityIcon = priorityIcons[task.priority || 'media'];

    // Formatar a data de criação
    const createdDate = new Date(task.createdAt);
    const formattedDate = createdDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
    });

    // Formatar a data de vencimento, se existir
    let formattedDueDate = '';
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dueDateTime = new Date(dueDate);
        dueDateTime.setHours(0, 0, 0, 0);

        // Verificar se é hoje, amanhã ou mostrar a data completa
        if (dueDateTime.getTime() === today.getTime()) {
            formattedDueDate = 'Hoje';
        } else if (dueDateTime.getTime() === tomorrow.getTime()) {
            formattedDueDate = 'Amanhã';
        } else {
            formattedDueDate = dueDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
        }
    }

    // Classes dinâmicas para o item
    const itemClasses = `flex items-center justify-between p-4 my-2 bg-content1/80 backdrop-blur-sm rounded-xl shadow-sm group hover:shadow-md todo-transition border-l-4 
        ${task.priority === 'alta' ? 'border-l-danger/70' :
            task.priority === 'media' ? 'border-l-warning/70' :
                task.priority === 'baixa' ? 'border-l-success/70' :
                    'border-l-default'}
        ${task.completed ? 'bg-opacity-50 border-opacity-40' : ''}
        ${isDeleting ? 'scale-90 opacity-0' : ''}
        ${isDragging ? 'opacity-50' : ''}`;

    return (
        <>
            <div ref={ref} className={itemClasses}>
                {moveTask && (
                    <div className="mr-1 cursor-move opacity-50 hover:opacity-100 todo-transition">
                        <FontAwesomeIcon icon={faGripVertical} />
                    </div>
                )}
                <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                        color="primary"
                        isSelected={task.completed}
                        onValueChange={() => onToggleComplete(task.id)}
                        size="lg"
                        className={task.completed ? "opacity-70" : ""}
                        classNames={{
                            wrapper: "before:border-2 before:border-primary-200 hover:before:border-primary-300 todo-transition",
                            label: "text-foreground"
                        }}
                    />
                    {isEditing ? (
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-b-2 border-primary focus:border-primary outline-none px-1 py-0.5 text-foreground"
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            aria-label="Editar tarefa"
                        />
                    ) : (
                        <span
                            className={`flex-1 py-1 todo-transition ${task.completed
                                ? "line-through text-default-400"
                                : "text-foreground"
                                }`}
                        >
                            {task.text}
                            <div className="flex gap-2 text-default-400 text-xs mt-1">
                                <span>{formattedDate}</span>
                                {task.dueDate && (
                                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${new Date(task.dueDate) < new Date() && !task.completed
                                            ? 'bg-danger/10 text-danger'
                                            : 'bg-primary/10 text-primary'
                                        }`}>
                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                        {formattedDueDate}
                                    </span>
                                )}
                            </div>
                        </span>
                    )}
                </div>

                <div className="flex gap-3 items-center">
                    {/* Seletor de Data */}
                    <Popover placement="bottom" showArrow={true}>
                        <PopoverTrigger>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className={`text-default-500 hover:bg-default-100 ${task.dueDate ? 'text-primary' : ''}`}
                                aria-label="Definir data de vencimento"
                            >
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2">
                            <div className="px-1 py-2">
                                <p className="text-small font-bold text-foreground mb-2">Data de vencimento</p>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className="max-w-[180px] min-w-[180px]"
                                        size="sm"
                                    />
                                    {task.dueDate && (
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            color="danger"
                                            onClick={clearDueDate}
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Tooltip content="Alterar prioridade" placement="left">
                        <Select
                            size="sm"
                            aria-label="Prioridade"
                            selectedKeys={[task.priority || 'media']}
                            className="max-w-[140px] min-w-[110px] w-auto"
                            color={priorityColor as any}
                            startContent={priorityIcon}
                            onChange={(e) => handlePriorityChange(e.target.value)}
                            classNames={{
                                trigger: "border border-default-200 bg-default-50 hover:bg-default-100 todo-transition h-8",
                                value: "text-sm whitespace-nowrap",
                            }}
                        >
                            <SelectItem key="baixa" startContent={<FontAwesomeIcon icon={faCheckCircle} className="text-success" />}>Baixa</SelectItem>
                            <SelectItem key="media" startContent={<FontAwesomeIcon icon={faExclamationCircle} className="text-warning" />}>Média</SelectItem>
                            <SelectItem key="alta" startContent={<FontAwesomeIcon icon={faFlag} className="text-danger" />}>Alta</SelectItem>
                        </Select>
                    </Tooltip>

                    <div className="opacity-0 group-hover:opacity-100 todo-transition scale-90 group-hover:scale-100">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-default-500 hover:bg-default-100"
                                    aria-label="Ações da tarefa"
                                >
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Ações da tarefa">
                                <DropdownItem
                                    key="edit"
                                    startContent={<FontAwesomeIcon icon={isEditing ? faSave : faEdit} />}
                                    onPress={handleEdit}
                                    description="Modificar texto da tarefa"
                                >
                                    {isEditing ? "Salvar" : "Editar"}
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    startContent={<FontAwesomeIcon icon={faTrash} />}
                                    className="text-danger"
                                    color="danger"
                                    description="Remover permanentemente"
                                    onPress={() => setIsDeleteModalOpen(true)}
                                >
                                    Excluir
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmação de Exclusão */}
            <Modal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                placement="center"
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirmar Exclusão</ModalHeader>
                            <ModalBody>
                                <p>
                                    Tem certeza que deseja excluir esta tarefa?
                                </p>
                                <p className="text-default-500 text-sm">
                                    <strong>"{task.text}"</strong>
                                </p>
                                <p className="text-danger text-sm">
                                    Esta ação não pode ser desfeita.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button color="danger" onPress={confirmDelete}>
                                    Excluir
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};