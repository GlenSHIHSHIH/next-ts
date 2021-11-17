import { Container, Grid, Pagination } from "@mui/material";
import ProductionCard from "component/ProductionCard";
import SearchBar from "component/SearchBar";
import SelectBox from "component/SelectBox";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from 'next/router';
import { getCategoriesListList, getProductionList } from "pages/api/productionApi";
import React, { useEffect, useRef, useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

interface PageData {
    count: Number,
    page: Number,
    pageLimit: Number,
    sort: string,
    sortColumn: string,
    search: string,
    searchCategory: string
}


interface ProductionList {
    productionList?: ProductionCardData[],
}

interface ProductionCardData {
    name: string;
    categories?: string;
    options?: string;
    description?: string;
    image?: string;
    price?: Number;
    priceMin?: Number;
    url?: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    var category: string[] = [];
    var pList: ProductionList = {};
    var pageData: PageData = {
        count: 0,
        page: 1,
        pageLimit: 15,
        sort: "",
        sortColumn: "",
        search: "",
        searchCategory: ""
    };
    await getCategoriesListList(null)?.then(res => {
        // console.log("get categories list");
        // console.log(res);
        category = res.data.category;
    }).catch(error => {
        console.log("錯誤");
    })

    await getProductionList(context.query)?.then(res => {
        // console.log("get production list");
        // console.log(res);
        pList.productionList = res.data.productionList;
        pageData = res.data.pageData;
    }).catch(error => {
        console.log("錯誤");
    })

    return {
        props: {
            // "category": category, "pList": pList
            category, pList, pageData
        },
    }

}

function ProductionPage({ category, pList, pageData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    console.log(pageData);
    // console.log(pList);
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
        console.log(searchCheck + 1)
        setSearchCheck(searchCheck + 1);
    };

    const selectCategoryChange = (value: string) => {
        setSelectCategory(value);
    };

    const selectCountChange = (value: string) => {
        setSelectCount(Number(value));
    };

    const substring = (value: string | undefined, count: number) => {
        let str = "";
        if (value != undefined && value.length <= count) {
            str = value;
        } else {
            str = value?.substring(0, count - 1) + "...";
        }
        return str;
    }

    const image: string[] = [
        "https://cf.shopee.tw/file/f7883d9860f030c83b2f41d862bc25b0",
        "https://cf.shopee.tw/file/890b5a720f54ee5c531fe38c5373c868"];

    return (
        <Container maxWidth="xl">
            <Head>
                <title>welecome to kumkum shop</title>
                <meta name="description" content="kumkumshop" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <Grid container item spacing={2} direction="row" justifyContent="center" alignItems="flex-end">
                <Grid container item spacing={1} margin={1} justifyContent="center">
                    <Carousel showThumbs={false} infiniteLoop={true} showStatus={false} autoPlay={true} interval={4000}>
                        {
                            image.map((imageUrl) => {
                                return (
                                    <div>
                                        <img src={imageUrl} />
                                        {/* <p className="legend">Legend 1</p> */}
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                </Grid>
                <SearchBar searchSet={searchChange} searchCheckSet={searchCheckChange} DefaultValue={searchMsg} />
                <SelectBox
                    selectName={'分類'}
                    optionValue={category}
                    defaultValue={selectCategory}
                    selectSet={selectCategoryChange}
                    optionAll={true}
                />
                <SelectBox
                    selectName={'筆數'}
                    optionValue={process.env.PAGE_SIZE?.split(',') as string[]}
                    defaultValue={selectCount.toString()}
                    selectSet={selectCountChange}
                    optionAll={false}
                />
                <Pagination count={pageCount} page={page} onChange={pageChange} showFirstButton showLastButton siblingCount={0} boundaryCount={0} />
            </Grid>

            <Grid container item direction="row" justifyContent="center" alignItems="baseline" width="100%" >
                {
                    pList?.productionList?.map((p: ProductionCardData) => {
                        return (
                            <Grid item margin="10px" key={p.name + (p.url)}>

                                <ProductionCard
                                    productionName={substring(p.name, 26)}
                                    productionCategory={substring(p.categories, 18)}
                                    productionIMG={p.image}
                                    productionDescript={substring(p.description, 75)}
                                    productionPrice={p.price}
                                    shopeeUrl={p.url}
                                    urlName={"Shopee 購買"}
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

export default ProductionPage;