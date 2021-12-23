import { useAuthStateContext } from "@context/context";
import { jwtAuthMiddleware } from "@middleware/jwtAuthMiddleware";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthLayout({ children }: any) {

    const router = useRouter();
    const { state } = useAuthStateContext();
    useEffect(() => {
        // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
        const fetchData = async () => {
            // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
            const check = await jwtAuthMiddleware(state);

            console.log('data', check);
            if (check == false) {
                router.push('/backstage/login');
            }
        };
        fetchData();
    }, []);
    return (
        <main>{children}</main>
    )
}