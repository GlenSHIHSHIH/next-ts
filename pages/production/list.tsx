// import { GetServerSideProps } from 'next'

import styles from 'styles/Home.module.css';
import cardScss from 'styles/ProductionCard.module.scss';
import { Pagination } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import ProductionCard from "component/ProductionCard";
import SearchBar from "component/SearchBar";
import SelectBox from "component/SelectBox";
import { getCategoriesListList, getProductionList } from "pages/api/productionApi";

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
            category, pList
        },
    }

}



function ProductionPage({ category, pList }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const pageCount: number = Math.ceil(pList.count / pList.pageLimit);
    const [page, setPage] = useState(1);
    const [searchMsg, setSearchMsg] = useState<string>("");
    const [selectCategory, setSelectCategory] = useState<string>("");
    const [selectCount, setSelectCount] = useState<number>(Number(process.env.PAGE_SIZE_DEFAULT ?? 20));

    useEffect(() => {
        console.log("page:" + page);
        console.log("searchMsg:" + searchMsg);
        console.log("selectCategory:" + selectCategory);
        console.log("selectCount:" + selectCount);
    }, [page, searchMsg, selectCategory, selectCount])

    useEffect(() => { //需要換參數
        console.log("page:" + page);
        console.log("searchMsg:" + searchMsg);
        console.log("selectCategory:" + selectCategory);
        console.log("selectCount:" + selectCount);
    }, [page, selectCount])

    const pageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const searchChange = (value: string) => {
        setSearchMsg(value);
    };

    const selectCategoryChange = (value: string) => {
        setSelectCategory(value);
    };

    const selectCountChange = (value: string) => {
        setSelectCount(Number(value));
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="kumkumshop" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>

                <SearchBar searchSet={searchChange} />

                <SelectBox
                    SelectName={'分類'}
                    OptionValue={category}
                    DefaultValue={""}
                    SelectSet={selectCategoryChange}
                />

                <SelectBox
                    SelectName={'筆數'}
                    OptionValue={process.env.PAGE_SIZE?.split(',') as string[]}
                    DefaultValue={(process.env.PAGE_SIZE_DEFAULT ?? "20")}
                    SelectSet={selectCountChange}
                />

                <div className={cardScss.card}>
                    {
                        pList?.productionList?.map((p: ProductionCardData) => {
                            return (
                                <div key={p.name + (p.url)}>
                                    <ProductionCard
                                        productionName={(p.name?.length < 15) ? p.name : p.name?.substring(0, 15) + "..."}
                                        productionCategory={p.categories}
                                        productionIMG={p.image}
                                        productionDescript={((p.description) != undefined && (p.description.length < 20)) ? p.description : p.description?.substring(0, 20) + "..."}
                                        productionPrice={p.price}
                                        shopeeUrl={p.url}
                                        urlName={"Shopee 直接購買"}
                                    />
                                </div>)
                        })
                    }
                </div>
                <div className={styles.title}>

                    <Pagination count={pageCount} page={page} onChange={pageChange} showFirstButton showLastButton />
                    <Pagination count={pageCount} page={page} onChange={pageChange} showFirstButton showLastButton siblingCount={0} boundaryCount={1} />
                </div>

            </main>
        </div>
    )
}

export default ProductionPage;