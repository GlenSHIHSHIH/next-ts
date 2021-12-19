import { createContext, Dispatch, useContext, useMemo, useReducer, useState } from "react";
import { Auth, AuthReducer, initialState } from "context/reducer";

interface IContextProps {
    state: Auth;
    dispatch: any;
}

const AuthStateContext = createContext<any>({ state: initialState, dispatch: { type: 'REQUEST_LOGIN' } });
// const AuthStateContext = createContext({ state: initialState } as IContextProps);

export default function UseAuthState({ children }: any) {
    const [state, dispatch] = useReducer(AuthReducer, initialState);
    // const [appState, setAppState] = useState({});
    const contextValue = useMemo(() => {
        return { state, dispatch };
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

