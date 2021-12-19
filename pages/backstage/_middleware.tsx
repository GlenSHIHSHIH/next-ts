import { useAuthStateContext } from "@context/context";

export default function AuthInvailidMiddleware() {
    const { state, dispatch } = useAuthStateContext();

    console.log(state);
    return null;
}