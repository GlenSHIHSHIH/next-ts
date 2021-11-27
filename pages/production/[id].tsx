import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { getConfig } from "@pages/api/baseConfig";
import { getProductionById, getProductionRank } from "@pages/api/productionDetailApi";
import styleProductionPage from "@styles/page/ProductionPage.module.css";
import { getCurrentUrl, getDomain, substring } from "@utils/base_fucntion";
import HeaderTitle from "component/HeaderTitle";
import PageTitle from "component/PageTitle";
import ProductionCard from "component/ProductionCard";
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
    id?: number,
    name?: string,
    categories?: string,
    options?: string,
    description?: string,
    image?: string,
    images?: string,
    price?: number,
    priceMin?: number,
    url?: string,
    attribute?: string,
    likedCount?: number,
    historicalSold?: number,
    stock?: number,
}

interface ProductionRankList {
    id: number,
    name: string,
    categories?: string,
    options?: string,
    description?: string,
    image?: string,
    price?: number,
    priceMin?: number,
    url?: string,
    weight?: number,
    amount?: number,
    likedCount?: number,
    historicalSold?: number,
    stock?: number,
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    var currentUrl = getCurrentUrl(context);
    var domain = getDomain(context);

    var paramObj = context.params;
    var prodcution: ProductionDetail | null = null;
    var productionRankList: ProductionRankList[] | null = null;

    var baseConfig = JSON.parse(await getConfig() ?? "");

    await getProductionById(paramObj)?.then(res => {
        // console.log("get categories list");
        // console.log(res);
        prodcution = res.data.production;
    }).catch(error => {
        console.log("getProductionById 錯誤");
    })

    await getProductionRank({ count: process.env.DEFAULT_RANK_COUNT })?.then(res => {
        // console.log("get categories list");
        productionRankList = res.data.productionList;
        // console.log(productionRankList);
    }).catch(error => {
        // console.log(error);
        console.log("getProductionRank 錯誤");
    })

    if (prodcution == null) {
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
            baseConfig, productionRankList, prodcution, currentUrl, domain
        },
    }
}

export default function ProductionIntroduce({ baseConfig, productionRankList, prodcution, currentUrl, domain }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // let data: ProductionDetail;
    var data: ProductionDetail = prodcution;
    var rankList: ProductionRankList[] = productionRankList;

    var images: string[] | null = (data.images) ? data.images.split(",") : null;
    var option: OptionData[] | null = (data.options) ? JSON.parse(data.options) : null;
    var attribute: Attribute[] | null = (data.attribute) ? JSON.parse(data.attribute) : null;

    let theme = createTheme();
    theme = responsiveFontSizes(theme);


    return (
        <Container maxWidth="xl">
            <HeaderTitle
                image={data.image}
                url={currentUrl}
                json={JSON.stringify(data)}
            />

            <PageTitle
                theme={theme}
                className={styleProductionPage.pageTitle}
                url={domain + process.env.DEFAULT_HOME_URL}
            />

            <Grid container direction="column" justifyContent="center" alignItems="flex-start">

                <Grid container item xs={12} md={12} marginTop={1} direction="row" justifyContent="center" alignItems="center">
                    <ThemeProvider theme={theme}>
                        <Typography variant="h6" color="text.secondary">
                            {data.categories}
                        </Typography>
                    </ThemeProvider>
                </Grid>

                <Grid container marginTop={2} direction="row" justifyContent="center" alignItems="flex-start">
                    {/* 產品圖片 */}
                    <Grid item xs={12} md={8} paddingLeft={3} paddingRight={3}>
                        {images &&
                            <Grid item >
                                <Carousel infiniteLoop={true} showStatus={false} autoPlay={true} interval={4000}>
                                    {
                                        images.map((c) => {
                                            return (
                                                <div key={"Carousel" + c} >
                                                    <img src={baseConfig.imgUrl + c} />
                                                </div>
                                            )
                                        })
                                    }
                                </Carousel>
                            </Grid>
                        }
                    </Grid>
                    {/* 產品圖片 */}

                    {/* 產品簡易說明 */}
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
                    {/* 產品簡易說明 */}

                    {/* 分隔線 */}
                    <Grid item xs={12} md={12}>
                        <Divider />
                    </Grid>
                    {/* 分隔線 */}

                    {/* 商品詳情 */}
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                        <Grid item xs={12} md={8}>

                            <ThemeProvider theme={theme}>
                                <Typography variant="h5" color="text.primary" marginTop={4} marginBottom={4}>
                                    <b>商品詳情</b>{/*商品詳情*/}
                                </Typography>
                                {/*描述descript*/}
                                <Typography variant="h6" color="text.primary" component="div" marginTop={4} marginBottom={4} style={{ whiteSpace: 'pre-wrap' }}>
                                    {data.description?.replace(/(<br>)/g, '\n')}
                                </Typography>
                                {
                                    data.images?.split(',').map((url) => {
                                        return (
                                            <div key={"image" + url}>
                                                <img src={baseConfig.imgUrl + url} alt={data.name} width="100%" />
                                            </div>
                                        )
                                    })
                                }
                            </ThemeProvider>
                        </Grid>
                        <Grid container item xs={12} md={4} direction="column" justifyContent="center" alignItems="center">
                            <ThemeProvider theme={theme}>
                                <Grid item className={styleProductionPage.poductionRankTitle} component="div" >
                                    <Typography variant="h5" color="text.primary" marginTop={4} marginBottom={4}>
                                        <b>推薦商品</b>{/*推薦商品*/}
                                    </Typography>
                                </Grid >
                                <Grid item justifyContent="center" alignItems="center" className={styleProductionPage.poductionRank}>
                                    {
                                        rankList?.map((r: ProductionRankList) => {
                                            return (
                                                <Grid item margin="10px" key={r.name + (r.url)}>

                                                    <ProductionCard
                                                        url={domain + process.env.DEFAULT_PRODUCTION_INTRODUCE_URL + r.id}
                                                        productionName={substring(r.name, 26)}
                                                        productionCategory={substring(r.categories, 18)}
                                                        productionIMG={baseConfig.imgUrl + r.image}
                                                        productionDescript={substring(r.description, 75)}
                                                        productionPrice={r.price}
                                                        productionPriceMin={r.priceMin}
                                                        shopeeUrl={r.url}
                                                        urlName={process.env.DEFAULT_BUY_SHOPEE_NAME}
                                                        alt={substring(r.name, 26)}
                                                    />
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid >
                            </ThemeProvider>
                        </Grid>
                    </Grid>
                    {/* 商品詳情 */}

                </Grid>
            </Grid>
        </Container>
    );
}

