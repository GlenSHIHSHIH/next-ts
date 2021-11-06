import Pagination from '@mui/material/Pagination';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ProductionCard from '../component/ProductionCard';
import SearchBar from '../component/SearchBar';
import SelectBox from '../component/SelectBox';
import styles from '../styles/Home.module.css';
import cardScss from '../styles/ProductionCard.module.scss';


interface CardData {
    productionName: string;
    productionCategory?: string;
    productionIMG?: string;
    productionDescript?: string;
    productionPrice?: Number;
    shopeeUrl?: string;
    urlName?: string;
}

const Home: NextPage = () => {
    let cards: CardData[] = [
        {
            productionName: "桃桃",
            productionCategory: "幼兒",
            productionIMG: "/vercel.svg",
            productionDescript: "快來買唷",
            productionPrice: 150,
            urlName: "直接購買(shopee)",
            shopeeUrl: "https://shopee.tw/aba"
        }, {
            productionName: "桃桃1",
            productionCategory: "包屁衣",
            productionIMG: "/vercel.svg",
            productionDescript: "快來買唷1",
            productionPrice: 150,
            urlName: "直接購買(shopee)",
            shopeeUrl: "https://shopee.tw/ava"
        }
    ]

    const [searchMsg, setSearchMsg] = useState<string>("");
    const [selectCategory, setSelectCategory] = useState<string>("");
    const [selectCount, setSelectCount] = useState<number>(Number(process.env.PAGE_SIZE_DEFAULT ?? 20));

    useEffect(() => {
        if (searchMsg != "") {
            console.log("searchMsg:" + searchMsg);
            console.log("selectCategory:" + selectCategory);
            console.log("selectCount:" + selectCount);
        }
    }, [searchMsg, selectCategory, selectCount])

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
                    OptionValue={["衣服", "飾品", "食品"]}
                    DefaultValue={"飾品"}
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
                        cards.map((card) => {
                            return (
                                <div key={card.productionName + (card.shopeeUrl ?? +2)}>
                                    <ProductionCard
                                        productionName={card.productionName}
                                        productionCategory={card.productionCategory}
                                        productionIMG={card.productionIMG}
                                        productionDescript={card.productionDescript}
                                        productionPrice={card.productionPrice}
                                        shopeeUrl={card.shopeeUrl}
                                        urlName={card.urlName}
                                    />
                                </div>)
                        })
                    }
                </div>
                <div className={styles.title}>

                    <Pagination count={10} showFirstButton showLastButton />
                    <Pagination count={10} showFirstButton showLastButton siblingCount={0} boundaryCount={1} />
                </div>

            </main>
        </div>
    )
}

export default Home
