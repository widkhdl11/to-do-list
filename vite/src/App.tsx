import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import { FC, useEffect, useState } from "react";
import CreateToDo from "./components/CreateToDo";
import supabase from "./lib/supabaseClient";
import { IToDo } from ".";
import ToDoCard from "./components/ToDoCard";

const App: FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [toDos, setToDos] = useState<IToDo[]>([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        supabase.functions.invoke("get-all-to-do").then(({ data }) => {
            setToDos(data);
        });

        console.log(session);
    }, [session]);

    if (!session) {
        return (
            <Auth
                supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                }}
            />
        );
    } else {
        return (
            <div className="bg-red-100">
                Hello, {session.user.email}{" "}
                <button onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
                <CreateToDo toDos={toDos} setToDos={setToDos} />
                <ul>
                    {toDos?.map((v) => (
                        <ToDoCard
                            key={v.id}
                            todo={v}
                            toDos={toDos}
                            setToDos={setToDos}
                        />
                    ))}
                </ul>
            </div>
        );
    }
};

export default App;
