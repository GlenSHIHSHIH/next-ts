// import Pagination from '@mui/material/Pagination';
// import type { NextPage } from 'next';
// import Head from 'next/head';
// import React from 'react';
// import ProductionCard from '../../component/ProductionCard';
// import SearchBar from '../../component/SearchBar';
// import SelectBox from '../../component/SelectBox';
// import styles from '../styles/Home.module.css';
// import cardScss from '../styles/ProductionCard.module.scss';


// // export const getStaticProps: GetStaticProps = async (context) => {
// //     return {
// //         props: { startCnt: parseInt(context.params.slug) || 0 },
// //     }
// // }

// // export const getStaticPaths: GetStaticPaths = async () => {
// //     return {
// //         paths: [
// //             { params: { n: '1' }, }
// //         ],
// //         fallback: 'blocking',
// //     }

// // }

// interface CardData {
//     productionName?: string;
//     productionCategory?: string;
//     productionIMG?: string;
//     productionDescript?: string;
//     productionPrice?: Number;
//     shopeeUrl?: string;
//     urlName?: string;
// }

// const Home: NextPage = () => {
//     let cards: CardData[] = [
//         {
//             productionName: "桃桃",
//             productionCategory: "幼兒",
//             productionIMG: "/vercel.svg",
//             productionDescript: "快來買唷",
//             productionPrice: 150,
//             urlName: "直接購買(shopee)",
//         }, {
//             productionName: "桃桃1",
//             productionCategory: "包屁衣",
//             productionIMG: "/vercel.svg",
//             productionDescript: "快來買唷1",
//             productionPrice: 150,
//             urlName: "直接購買(shopee)",
//         }
//     ]

//     return (
//         <div className={styles.container}>
//             <Head>
//                 <title>Create Next App</title>
//                 <meta name="description" content="kumkumshop" />
//                 <link rel="icon" href="/favicon.ico" />
//             </Head>

//             <main className={styles.main}>

//                 <SearchBar />

//                 <SelectBox
//                     SelectName={'分類'}
//                     OptionValue={process.env.PAGE_SIZE?.split(',').map(
//                         function (item) {
//                             return parseInt(item, 10);
//                         }) as number[]}
//                     DefaultValue={10}
//                 />

//                 <SelectBox
//                     SelectName={'筆數'}
//                     OptionValue={process.env.PAGE_SIZE?.split(',').map(
//                         function (item) {
//                             return parseInt(item, 10);
//                         }) as number[]}
//                     DefaultValue={10}
//                 />

//                 <div className={cardScss.card}>
//                     {
//                         cards.map((card) => {
//                             return (
//                                 <div>
//                                     <ProductionCard
//                                         productionName={card.productionName}
//                                         productionCategory={card.productionCategory}
//                                         productionIMG={card.productionIMG}
//                                         productionDescript={card.productionDescript}
//                                         productionPrice={card.productionPrice}
//                                         shopeeUrl={card.shopeeUrl}
//                                         urlName={card.urlName}
//                                     />
//                                 </div>)
//                         })
//                     }
//                 </div>
//                 <div className={styles.title}>

//                     <Pagination count={10} showFirstButton showLastButton />
//                     <Pagination count={10} showFirstButton showLastButton siblingCount={0} boundaryCount={1} />
//                 </div>

//             </main>
//         </div>
//     )
// }

// export default Home
