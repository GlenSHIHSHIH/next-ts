import { Container, Grid, Typography } from "@mui/material";
import { getProductionById } from "@pages/api/productionIntroduceApi";
import getCurrentUrl from "@utils/base_fucntion";
import HeaderTitle from "component/HeaderTitle";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

interface OptionData {
    Name?: string,
    Option?: string[],
}

interface ProductionCardData {
    id?: Number,
    name?: string,
    categories?: string,
    options?: string,
    description?: string,
    image?: string,
    images?: string,
    price?: Number,
    priceMin?: Number,
    url?: string,
}


export const getServerSideProps: GetServerSideProps = async (context) => {

    var currentUrl = getCurrentUrl(context);
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
            prodcution, currentUrl
        },
    }

}

export default function ProductionIntroduce({ prodcution, currentUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // let data: ProductionCardData;
    var data: ProductionCardData;
    data = prodcution;

    var images: string[] | null = (data.images) ? data.images.split(",") : null;
    var option: OptionData[] | null = (data.options) ? JSON.parse(data.options) : null;

    const itemJoin = (items: string[]) => {
        var item: string = "";
        items.map((os) => {
            item = item + "、" + os.replace(/(")+/gm, '');
        })
        return item.replace(/^、/g, '');
    };


    return (
        <Container maxWidth="xl">
            <HeaderTitle
                image={data.image}
                url={currentUrl}
                json={JSON.stringify(data)}
            />

            <Grid container marginTop={2} direction="row" justifyContent="center" alignItems="flex-start">
                <Grid item xs={12} md={6} direction="column" justifyContent="center">
                    {images &&
                        <Grid item >
                            <Carousel infiniteLoop={true} showStatus={false} autoPlay={true} interval={4000}>
                                {
                                    images.map((c) => {
                                        return (
                                            <div key={"Carousel" + c} >
                                                <img src={c} />
                                            </div>
                                        )
                                    })
                                }
                            </Carousel>
                        </Grid>
                    }
                </Grid>
                <Grid xs={12} md={6} item direction="column">
                    <Grid item marginLeft={4} marginRight={4}>
                        <Typography variant="h5" color="text.secondary">
                            {data.name} {/*/商品名稱*/}
                        </Typography>
                        <Typography variant="h4" color="text.secondary" marginTop={3} marginBottom={3}>
                            ${data.price} {/*/價格*/}
                        </Typography>

                        {
                            option?.map((o: OptionData) => {
                                return (
                                    <Grid container item direction="row" justifyContent="flex-start" alignItems="flex-start">
                                        <Typography variant="h6" color="text.secondary" marginTop={2} >
                                            {o.Name}： {/*/項目名稱*/}
                                        </Typography>
                                        {o.Option &&
                                            <Typography variant="h6" color="text.secondary" marginLeft={2} marginTop={2} >
                                                {itemJoin(o.Option)} {/*/項目內容*/}
                                            </Typography>
                                        }
                                    </Grid>
                                )
                            })
                        }

                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
