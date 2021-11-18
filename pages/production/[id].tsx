import { Container, Grid } from "@mui/material";
import { getProductionById } from "@pages/api/productionIntroduceApi";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";


interface ProductionCardData {
    id?: Number,
    name?: string,
    categories?: string,
    options?: string,
    description?: string,
    image?: string,
    price?: Number,
    priceMin?: Number,
    url?: string,
}


export const getServerSideProps: GetServerSideProps = async (context) => {

    var paramObj = context.params;
    var prodcution: ProductionCardData = {};

    await getProductionById(paramObj)?.then(res => {
        // console.log("get categories list");
        // console.log(res);
        prodcution = res.data.production;
    }).catch(error => {
        console.log("getCategoryList 錯誤");
    })

    return {
        props: {
            // "category": category, "pList": pList
            prodcution,
        },
    }

}

function ProductionIntroduce({ prodcution }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // let data: ProductionCardData;
    let data: ProductionCardData;
    data = prodcution;
    return (
        <Container maxWidth="xl">
            <Head>
                <title>welecome to kumkum shop, {data.name}</title>
                <meta name="description" content="kumkumshop" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-end">
                <Grid item>
                    <div>{data.id}</div>
                </Grid>
                <Grid item>
                    <div>{data.id}</div>
                </Grid>
                <Grid item>
                    <div>{data.id}</div>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProductionIntroduce;