import { Container, Grid } from "@mui/material";
import AuthLayout from "component/backstage/AuthLayout";
import React from "react";

export default function DashBoard() {

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