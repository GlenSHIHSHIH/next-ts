import { Auth, AuthReducer, initialState } from "context/reducer";
import { createContext, useContext, useMemo, useReducer } from "react";

interface ContextProps {
    state: Auth;
    dispatch: any;
}

const AuthStateContext = createContext<any>({ state: initialState(), dispatch: { type: '' } } as ContextProps);

export default function UseAuthState({ children }: any) {
    const [state, dispatch] = useReducer(AuthReducer, initialState());
    // const [appState, setAppState] = useState({});
    const contextValue = useMemo(() => {
        return {state, dispatch};
    }, [state, dispatch]);

    return (
        <AuthStateContext.Provider value={contextValue}>
            {children}
        </AuthStateContext.Provider>
    );
}

export function useAuthStateContext() {
    return useContext(AuthStateContext);
}

