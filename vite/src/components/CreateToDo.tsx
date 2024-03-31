import { FC, FormEvent, useState } from "react";
import supabase from "../lib/supabaseClient";

const CreateToDo: FC = () => {
    const [content, setContent] = useState<string>("");

    const onSubmitCreateTodo = async (e: FormEvent) => {
        try {
            e.preventDefault();
            if (!content) return;
            const response = await supabase.functions.invoke("create-to-do", {
                body: { content },
            });

            console.log(response);
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
