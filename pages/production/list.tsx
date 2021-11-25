import { Container, createTheme, Grid, Pagination, responsiveFontSizes, ThemeProvider, Typography } from "@mui/material";
import styleProductionList from "@styles/page/ProductionList.module.css";
import { getCurrentUrl, getDomain, substring } from "@utils/base_fucntion";
import HeaderTitle from "component/HeaderTitle";
import ProductionCard from "component/ProductionCard";
import SearchBar from "component/SearchBar";
import SelectBox from "component/SelectBox";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from 'next/router';
import { getCarouselList, getCategoryList, getProductionList } from "pages/api/productionApi";
import React, { useEffect, useRef, useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

interface CarouselData {
    id: number,
    name: string,
    image: string,
    url: string,
    weight: number,
}

interface PageData {
    count: number,
    page: number,
    pageLimit: number,
    sort: string,
    sortColumn: string,
    search: string,
    searchCategory: string
}

interface ProductionCardData {
    id: number,
    name: string,
    categories?: string,
    options?: string,
    description?: string,
    image?: string,
    price?: number,
    priceMin?: number,
    url?: string,
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    var currentUrl = getCurrentUrl(context);
    var domain = getDomain(context);

    var category: string[] = [];
    var pList: ProductionCardData[] = [];
    var carousel: CarouselData[] = [];
    var pageData: PageData = {
        count: 0,
        page: 1,
        pageLimit: 15,
        sort: "",
        sortColumn: "",
        search: "",
        searchCategory: ""
    };
    await getCategoryList(null)?.then(res => {
        // console.log("get categories list");
        // console.log(res);
        category = res.data.category;
    }).catch(error => {
        console.log("getCategoryList 錯誤");
    })

    await getCarouselList(null)?.then(res => {
        // console.log("get carousel list");
        // console.log(res);
        carousel = res.data.carousels;
    }).catch(error => {
        console.log("getCarouselList 錯誤");
    })

    await getProductionList(context.query)?.then(res => {
        // console.log("get production list");
        // console.log(res);
        pList = res.data.productionList;
        pageData = res.data.pageData;
    }).catch(error => {
        console.log("getProductionList 錯誤");
    })

    return {
        props: {
            // "category": category, "pList": pList
            carousel, category, pList, pageData, currentUrl, domain
        },
    }
}

export default function ProductionPage({ carousel, category, pList, pageData, currentUrl, domain }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const pageCount: number = Math.ceil(pageData.count / pageData.pageLimit);
    const firstUpdate = useRef(true);
    const router = useRouter();
    const [searchCheck, setSearchCheck] = useState<number>(0);
    const [page, setPage] = useState<number>(pageData.page);
    const [searchMsg, setSearchMsg] = useState<string>(pageData.search);
    const [selectCategory, setSelectCategory] = useState<string>(pageData.searchCategory);
    const [selectCount, setSelectCount] = useState<number>(Number(pageData.pageLimit ?? process.env.PAGE_SIZE_DEFAULT));

    const url = (
        page: number
        , pageLimit: number
        , sort: string
        , sortColumn: string
        , search: string
        , searchCategory: string) => {
        let parameter: string = "?";
        parameter = parameter + `page=${page}&pageLimit=${pageLimit}&sort=${sort}&sortColumn=${sortColumn}&search=${search}&searchCategory=${searchCategory}`
        return router.pathname + parameter;
    };

    useEffect(() => { //需要換參數
        // console.log(firstUpdate.current);
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        else {
            router.push(url(1, selectCount, 'asc',
                'PId', searchMsg, selectCategory));
            // console.log("page:" + page);
            // console.log("searchMsg:" + searchMsg);
            // console.log("selectCategory:" + selectCategory);
            // console.log("selectCount:" + selectCount);
        }
    }, [searchCheck, selectCount])

    const pageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        router.push(url(value, selectCount, 'asc',
            'PId', searchMsg, selectCategory));
    };

    const searchChange = (value: string) => {
        setSearchMsg(value);
    };

    const searchCheckChange = () => {
        // console.log(searchCheck + 1)
        setSearchCheck(searchCheck + 1);
    };

    const selectCategoryChange = (value: string) => {
        setSelectCategory(value);
    };

    const selectCountChange = (value: string) => {
        setSelectCount(Number(value));
    };

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    return (
        <Container maxWidth="xl">
            <HeaderTitle
                image={(carousel != null) ? carousel[0]?.image : ''}
                url={currentUrl}
                json={JSON.stringify(pList)}
            />

            <Grid container spacing={2} marginTop={1} direction="column" justifyContent="center" className={styleProductionList.gridBody}>
                {carousel &&
                    <Grid item justifyContent="center">
                        <Carousel showThumbs={false} infiniteLoop={true} showStatus={false} autoPlay={true} interval={4000}>
                            {
                                carousel?.map((c: CarouselData) => {
                                    return (
                                        <a href={c.url} target="_blank" key={"Carousel" + c.id.toString()}>
                                            <div >
                                                <img src={c.image} alt={c.name} />
                                                {/* <p className="legend">Legend 1</p> */}
                                            </div>
                                        </a>
                                    )
                                })
                            }
                        </Carousel>
                    </Grid>
                }
                <Grid container spacing={2} marginTop={2} direction="row" justifyContent="center" className={styleProductionList.gridBody}>
                    <ThemeProvider theme={theme}>
                        <Grid item >
                            <SearchBar searchSet={searchChange} searchCheckSet={searchCheckChange} DefaultValue={searchMsg}
                                className={styleProductionList.poductionSearch}/>
                        </Grid>
                        <Grid item >
                            <SelectBox className={styleProductionList.poductionSelectOption}
                                selectName={'分類'}
                                optionValue={category}
                                defaultValue={selectCategory}
                                selectSet={selectCategoryChange}
                                optionAll={true}
                            />
                        </Grid>
                        <Grid item >
                            <SelectBox className={styleProductionList.poductionSelectPageOption}
                                selectName={'筆數'}
                                optionValue={process.env.PAGE_SIZE?.split(',') as string[]}
                                defaultValue={selectCount.toString()}
                                selectSet={selectCountChange}
                                optionAll={false}
                            />
                        </Grid>
                        <Grid item  justifyContent="center" alignItems="center">
                            <Pagination count={pageCount} page={page} onChange={pageChange} showFirstButton showLastButton siblingCount={0} boundaryCount={0} />
                        </Grid>
                    </ThemeProvider>
                </Grid>
            </Grid>

            <Grid container item direction="row" justifyContent="center" alignItems="baseline" width="100%" >
                {pList == null && <Typography variant="h2" color="text.secondary">此條件搜尋不到商品</Typography>}
                {
                    pList?.map((p: ProductionCardData) => {
                        return (
                            <Grid item margin="10px" key={p.name + (p.url)}>

                                <ProductionCard
                                    url={domain + process.env.DEFAULT_PRODUCTION_INTRODUCE_URL + p.id}
                                    productionName={substring(p.name, 26)}
                                    productionCategory={substring(p.categories, 18)}
                                    productionIMG={p.image}
                                    productionDescript={substring(p.description, 75)}
                                    productionPrice={p.price}
                                    productionPriceMin={p.priceMin}
                                    shopeeUrl={p.url}
                                    urlName={process.env.DEFAULT_BUY_SHOPEE_NAME}
                                    alt={substring(p.name, 26)}
                                />
                            </Grid>
                        )
                    })
                }
            </Grid>

            <Grid container item direction="row" justifyContent="center" alignItems="baseline" width="100%" >
                <Pagination count={pageCount} page={page} onChange={pageChange} showFirstButton showLastButton />
            </Grid>

        </Container>
    )
}

// export default ProductionPage;