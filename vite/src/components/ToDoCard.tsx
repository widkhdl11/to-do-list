import { FC } from "react";
import { IToDo } from "..";

interface ToDoCardProps {
    todo: IToDo;
}

const ToDoCard: FC<ToDoCardProps> = ({ todo }) => {
    return <div className="bg-gray-100">{todo.content}</div>;
};

export default ToDoCard;
