// import { GetServerSideProps } from 'next'

import { Grid, Pagination } from "@mui/material";
import ProductionCard from "component/ProductionCard";
import SearchBar from "component/SearchBar";
import SelectBox from "component/SelectBox";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from 'next/router';
import { getCategoriesListList, getProductionList } from "pages/api/productionApi";
import React, { useEffect, useRef, useState } from "react";
import productionListStyle from 'styles/productionList.module.css';

interface ProductionList {
    count?: Number,
    page?: Number,
    pageLimit?: Number,
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
        pList = res.data;
    }).catch(error => {
        console.log("錯誤");
    })

    return {
        props: {
            // "category": category, "pList": pList
            category, pList, "queryString": context.query
        },
    }

}

function ProductionPage({ category, pList, queryString }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // console.log(queryString);
    // console.log(pList);
    const pageCount: number = Math.ceil(pList.count / pList.pageLimit);
    const firstUpdate = useRef(true);
    const router = useRouter();
    const [searchCheck, setSearchCheck] = useState<number>(0);
    const [page, setPage] = useState<number>(pList.page ?? 1);
    const [searchMsg, setSearchMsg] = useState<string>(queryString.search ?? "");
    const [selectCategory, setSelectCategory] = useState<string>(queryString.searchCategory ?? "");
    const [selectCount, setSelectCount] = useState<number>(Number(pList.pageLimit ?? process.env.PAGE_SIZE_DEFAULT));

    const url = (page: number
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

    return (
        <div className={productionListStyle.container}>
            <Head>
                <title>welecome to kumkum shop</title>
                <meta name="description" content="kumkumshop" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <main className={productionListStyle.main}> */}
            <Grid container direction="column" justifyContent="flex-start" alignItems="baseline">
                <Grid container item spacing={1} direction="row" justifyContent="center" alignItems="flex-end">
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

                <Grid container item direction="row" justifyContent="center" alignItems="baseline" width="80%" >
                    {
                        pList?.productionList?.map((p: ProductionCardData) => {
                            return (
                                <Grid item direction="row" justifyContent="flex-start" alignItems="baseline" margin="10px" key={p.name + (p.url)}>

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

                <div className={productionListStyle.title}>
                    <Pagination count={pageCount} page={page} onChange={pageChange} showFirstButton showLastButton />
                </div>

                {/* </main> */}
            </Grid>
        </div >
    )
}

export default ProductionPage;