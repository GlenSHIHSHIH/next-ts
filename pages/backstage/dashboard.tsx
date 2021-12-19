import { useAuthStateContext } from "@context/context";

export default function DashBoard() {
    const { state, dispatch } = useAuthStateContext();

    console.log(state);
    return (
        <div>
            ok
        </div>
    )
}