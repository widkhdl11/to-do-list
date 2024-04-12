import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import { IToDo } from "..";
import supabase from "../lib/supabaseClient";

interface ToDoCardProps {
    todo: IToDo;
    toDos: IToDo[];
    setToDos: Dispatch<SetStateAction<IToDo[]>>;
}

const ToDoCard: FC<ToDoCardProps> = ({ todo, toDos, setToDos }) => {
    const [isDone, setIsDone] = useState<boolean>(todo.isdone);
    const [updateToggle, setUpdateToggle] = useState<boolean>(false);
    const [content, setContent] = useState<string>(todo.content);
    const [toDoContent, setToDoContent] = useState<string>(todo.content);

    const onClickIsDoneToDo = async () => {
        try {
            const { data } = await supabase.functions.invoke("is-done-to-do", {
                body: {
                    toDoId: todo.id,
                },
            });
            setIsDone(data.isdone);
        } catch (error) {
            console.log(error);
        }
    };
    const onSubmitUpdate = async (e: FormEvent) => {
        try {
            e.preventDefault(); // 새로고침 방지

            const { data } = await supabase.functions.invoke("update-to-do", {
                body: {
                    toDoId: todo.id,
                    content,
                },
            });
            setToDoContent(data.content);
            setUpdateToggle(false);
        } catch (error) {
            console.log(error);
        }
    };

    const onClickDeleteToDo = async () => {
        try {
            await supabase.functions.invoke("delete-to-do", {
                body: {
                    toDoId: todo.id,
                },
            });
            const temp = toDos.filter((v) => v.id !== todo.id);
            setToDos(temp);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <li className={`bg-green-100 block ${isDone && "line-through"}`}>
            {updateToggle ? (
                <form onSubmit={onSubmitUpdate}>
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <input type="submit" value="완료" />
                </form>
            ) : (
                <button
                    className={`${isDone && "line-through"}`}
                    onClick={onClickIsDoneToDo}
                >
                    {toDoContent}
                </button>
            )}{" "}
            <button onClick={() => setUpdateToggle(!updateToggle)}>
                {updateToggle ? "취소" : "수정"}
            </button>
            <button onClick={onClickDeleteToDo}>삭제</button>
        </li>
    );
};

export default ToDoCard;
