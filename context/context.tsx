import React, { createContext, useReducer } from "react";
import { AuthReducer, initialState } from "context/reducer";

export const [userInfo, dispatch] = useReducer(AuthReducer, initialState);

const AuthStateContext = createContext(userInfo);

export function useAuthState() {
    const context = React.useContext(AuthStateContext);
    if (context.userInfo == null || context.authorityJwt == null) {
        throw new Error("useAuthState must be used within a AuthProvider");
    }

    return context;
}


