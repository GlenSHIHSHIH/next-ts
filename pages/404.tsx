import { Container, Grid } from "@mui/material";
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import styleProductionPage from "@styles/page/ProductionPage.module.css";
import HeaderTitle from "component/HeaderTitle";
import PageTitle from "component/PageTitle";
import { useRouter } from "next/router";
import React, { useEffect } from "react";


export default function Custom404() {
    const router = useRouter();
    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    if(router.asPath.includes('/backstage',0)){
        useEffect(() => {
            router.push('/backstage/dashboard');
         }, [])
        return (
            <Container maxWidth="xl">
                <Grid container direction="column" justifyContent="center" alignItems="flex-start">
                    <h1>404 - Page Not Found</h1>
                </Grid>
            </Container>
        );
    }else{
         return (
            <Container maxWidth="xl">
                <HeaderTitle
                    url={router.basePath + process.env.DEFAULT_HOME_URL}
                />

                <PageTitle
                    theme={theme}
                    className={styleProductionPage.pageTitle}
                    url={router.basePath + process.env.DEFAULT_HOME_URL}
                />
                <Grid container direction="column" justifyContent="center" alignItems="flex-start">
                    <h1>404 - Page Not Found</h1>
                </Grid>
            </Container>
        )
    }

}
