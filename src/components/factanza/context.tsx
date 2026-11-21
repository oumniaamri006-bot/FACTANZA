import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initialUser, parseUser, storageKey, type UserState } from "@/lib/factanza-state";

type StateContext = {
  user: UserState;
  ready: boolean;
  update: (patch: Partial<UserState>) => void;
  vote: (id: string, choice: string) => void;
  notify: (text: string) => void;
  logout: () => void;
};
const Context = createContext<StateContext | null>(null);
export function FactanzaProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(initialUser);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    setUser(parseUser(localStorage.getItem(storageKey)));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(user));
  }, [user, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  const update = (patch: Partial<UserState>) => setUser((previous) => ({ ...previous, ...patch }));
  const vote = (id: string, choice: string) =>
    setUser((previous) => ({ ...previous, votes: { ...previous.votes, [id]: choice } }));
  const logout = () => {
    localStorage.removeItem(storageKey);
    setUser({ ...initialUser });
  };
  return (
    <Context.Provider value={{ user, ready, update, vote, notify: setToast, logout }}>
      {children}
      {toast && (
        <div role="status" className="toast">
          {toast}
        </div>
      )}
    </Context.Provider>
  );
}
export function useFactanza() {
  const context = useContext(Context);
  if (!context) throw new Error("Factanza provider missing");
  return context;
}
