import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import supabase from "../lib/supabaseClient";
import { IToDo } from "..";

interface CreateToDoProps {
    toDos: IToDo[];
    setToDos: Dispatch<SetStateAction<IToDo[]>>;
}

const CreateToDo: FC<CreateToDoProps> = ({ toDos, setToDos }) => {
    const [content, setContent] = useState<string>("");

    const onSubmitCreateTodo = async (e: FormEvent) => {
        try {
            e.preventDefault();
            if (!content) return;
            const { data } = await supabase.functions.invoke("create-to-do", {
                body: { content },
            });

            setContent("");

            setToDos([data, ...toDos]);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form className="bg-red-100" onSubmit={onSubmitCreateTodo}>
            {" "}
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />{" "}
            <input type="submit" value="투두생성" />{" "}
        </form>
    );
};

export default CreateToDo;
