import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { getProductionById } from "@pages/api/productionIntroduceApi";
import styleProductionPage from "@styles/page/ProductionPage.module.css"; // requires a loader
import { getCurrentUrl } from "@utils/base_fucntion";
import HeaderTitle from "component/HeaderTitle";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

interface OptionData {
    Name?: string,
    Option?: string[],
}

interface Attribute {
    name?: string,
    value?: string,
}

interface ProductionDetail {
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
    attribute?: string,
    likedCount?: Number,
    historicalSold?: Number,
    stock?: Number,
}



export const getServerSideProps: GetServerSideProps = async (context) => {

    var currentUrl = getCurrentUrl(context);
    var paramObj = context.params;
    var prodcution: ProductionDetail | null = null;

    await getProductionById(paramObj)?.then(res => {
        // console.log("get categories list");
        // console.log(res);
        prodcution = res.data.production;
    }).catch(error => {
        console.log("getCategoryList 錯誤");
    })

    if (prodcution == null ) {
        return {
            redirect: {
                permanent: false,
                destination: process.env.DEFAULT_HOME_URL
            },
            props: {}
        }
    }
    return {
        props: {
            // "category": category, "pList": pList
            prodcution, currentUrl
        },
    }
}

export default function ProductionIntroduce({ prodcution, currentUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // let data: ProductionDetail;
    var data: ProductionDetail;
    data = prodcution;

    var images: string[] | null = (data.images) ? data.images.split(",") : null;
    var option: OptionData[] | null = (data.options) ? JSON.parse(data.options) : null;
    var attribute: Attribute[] | null = (data.attribute) ? JSON.parse(data.attribute) : null;

    // const itemJoin = (items: string[]) => {
    //     var item: string = "";
    //     items.map((os) => {
    //         item = item + "、" + os.replace(/(")+/gm, '');
    //     })
    //     return item.replace(/^、/g, '');
    // };

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    return (
        <Container maxWidth="xl">
            <HeaderTitle
                image={data.image}
                url={currentUrl}
                json={JSON.stringify(data)}
            />

            <Grid container marginTop={2} direction="column" justifyContent="center" alignItems="flex-start">

                <Grid container item xs={12} md={12} marginTop={2} direction="row" justifyContent="center" alignItems="center">
                    <ThemeProvider theme={theme}>
                        <Typography variant="h5" color="text.secondary">
                            {data.categories}
                        </Typography>
                    </ThemeProvider>
                </Grid>

                <Grid container marginTop={2} direction="row" justifyContent="center" alignItems="flex-start">

                    <Grid item xs={12} md={8} >
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

                    <Grid item xs={12} md={4}  >
                        <Grid item marginLeft={4} marginRight={4}>
                            <ThemeProvider theme={theme}>
                                <Typography variant="h4" color="text.primary">
                                    {data.name} {/*/商品名稱*/}
                                </Typography>
                                <Grid container item direction="row" justifyContent="space-between" alignItems="center" marginTop={2}>
                                    {(data.historicalSold != undefined && data.historicalSold > 0) &&
                                        <Typography variant="h5" color="text.secondary">
                                            已售出：{data.historicalSold}
                                        </Typography>
                                    }
                                    {(data.stock != undefined && data.stock > 0) &&
                                        <Typography variant="h5" color="text.secondary">
                                            數量：{data.stock}
                                        </Typography>
                                    }
                                    {(data.likedCount != undefined && data.likedCount > 0) &&
                                        <Typography variant="h5" color="text.secondary">
                                            讚：{data.likedCount}
                                        </Typography>
                                    }
                                </Grid >
                                <Grid container item justifyContent="flex-start" alignItems="center">
                                    {
                                        ((data.priceMin ?? 0) < (data.price ?? 0)) ?
                                            <Typography variant="h5" color="text.secondary" marginTop={4} marginBottom={4} marginRight={3}>
                                                <s>${data.price}</s>
                                            </Typography>
                                            : ""
                                    }
                                    <Typography variant="h4" color="warning.main" marginTop={4} marginBottom={4}>
                                        <b>${data.priceMin}</b> {/*/價格*/}
                                    </Typography>
                                </Grid>
                                <Grid item className={styleProductionPage.poductionOption} marginBottom={2} >
                                    {
                                        option?.map((oItem: OptionData) => {
                                            return (
                                                <Grid container key={"option" + oItem.Name + oItem.Option} direction="row"
                                                    justifyContent="flex-start" alignItems="flex-start" marginBottom={2} marginTop={2}>
                                                    <Grid item md={4} xs={4}>
                                                        <Typography variant="h5" color="text.secondary" >
                                                            {oItem.Name}{/*/項目名稱*/}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid container item md={8} xs={8} direction="row" spacing={1}
                                                        justifyContent="flex-start" alignItems="flex-start">
                                                        {
                                                            oItem.Option?.map((item: string) => {
                                                                return (
                                                                    <Grid item key={item}>
                                                                        <Typography component={"div"} variant="h6" color="text.secondary" padding={1}
                                                                            style={{ border: '1px gray solid', borderRadius: '6px' }} >
                                                                            {item.replace(/(")+/gm, '')} {/*/項目內容*/}
                                                                        </Typography>
                                                                    </Grid>
                                                                )
                                                            })
                                                        }
                                                    </Grid>
                                                </Grid>
                                            )
                                        })
                                    }
                                    {
                                        attribute?.map((aItem) => {
                                            return (
                                                <Grid container key={"attribute" + aItem.name} direction="row"
                                                    justifyContent="flex-start" alignItems="flex-start" marginBottom={2} marginTop={2}>
                                                    <Grid item md={4} xs={4}>
                                                        <Typography variant="h5" color="text.secondary" >
                                                            {aItem.name}{/*/產品其他資訊*/}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item md={8} xs={8} >
                                                        <Typography component={"div"} variant="h6" color="text.secondary">
                                                            {aItem.value} {/*/產品其他資訊內容*/}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            )
                                        })

                                    }
                                </Grid >
                            </ThemeProvider>
                            <Grid container item justifyContent="flex-end" alignItems="flex-end" margin={3}>
                                <Button color="warning" size="large" variant="contained" href={data.url}>{process.env.DEFAULT_BUY_SHOPEE_NAME}</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Divider />
                    </Grid>
                    {/* 商品詳情 */}
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                        <Grid item xs={12} md={8}>

                            <ThemeProvider theme={theme}>
                                <Typography variant="h4" color="text.primary" marginTop={4} marginBottom={4}>
                                    商品詳情{/*商品詳情*/}
                                </Typography>
                                {/*描述descript*/}
                                <Typography variant="h5" color="text.primary" component="div" marginTop={4} marginBottom={4} style={{ whiteSpace: 'pre-wrap' }}>
                                    {data.description?.replace(/(<br>)/g, '\n')}
                                </Typography>
                                {
                                    data.images?.split(',').map((url) => {
                                        return (
                                            <div key={"image" + url}>
                                                <img src={url} alt={data.name} width="100%" />
                                            </div>
                                        )
                                    })
                                }
                            </ThemeProvider>
                        </Grid>
                        <Grid item xs={12} md={4}>

                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </Container>
    );
}