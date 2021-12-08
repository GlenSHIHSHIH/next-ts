
// export const getStaticProps: GetStaticProps = async () => {
//     return {
//         redirect: {
//             destination: '/production/list',
//             permanent: true,
//         },
//     };
// };

import { Container, Grid } from "@mui/material";
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import styleProductionPage from "@styles/page/ProductionPage.module.css";
import HeaderTitle from "component/HeaderTitle";
import PageTitle from "component/PageTitle";
import { useRouter } from "next/router";
import React from "react";


export default function Custom404() {
    const router = useRouter();
    // useEffect(() => {
    //     router.push('/production/list');
    //  }, [])

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

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
