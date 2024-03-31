import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import { FC, useEffect, useState } from "react";
import CreateToDo from "./components/CreateToDo";
import supabase from "./lib/supabaseClient";

const App: FC = () => {
  const [session, setSession] = useState<Session | null>(null);

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
    console.log(session);
  }, [session]);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return (
      <div className="bg-red-100">
        Hello, {session.user.email}{" "}
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        <CreateToDo />
      </div>
    );
  }
};

export default App;
