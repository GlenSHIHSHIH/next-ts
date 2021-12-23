import { Container, Grid } from "@mui/material";
import AuthLayout from "component/backstage/AuthLayout";
import React from "react";

export default function DashBoard() {

    // const { state } = useAuthStateContext();
    // useEffect(() => {
    //     // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
    //     const fetchData = async () => {
    //       // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
    //       const data = await jwtAuthMiddleware(state);

    //       console.log('data', data);
    //     };

    //     // STEP 5：呼叫 fetchData 這個方法
    //     fetchData();
    //   }, []);

    return (
        <AuthLayout>
        <Container maxWidth="xl">
            <Grid container spacing={2} marginTop={2} direction="row" justifyContent="center" >
                ok
            </Grid>
        </Container>
        </AuthLayout>
    )
}