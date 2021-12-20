import { useAuthStateContext } from "@context/context";
import { Container, Grid } from "@mui/material";
import React from "react";

export default function DashBoard() {
    const { state } = useAuthStateContext();

    console.log(state);
    return (
        <Container maxWidth="xl">
            <Grid container spacing={2} marginTop={2} direction="row" justifyContent="center" >
                ok
            </Grid>
        </Container>

    )
}