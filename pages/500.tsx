import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';

export const getStaticProps: GetStaticProps = async (ctx) => {

    // const { res } = ctx.defaultLocale;
    // if (process.env.NODE_ENV != 'development') {
    //     return {
    //         redirect: {
    //             destination: '/production/list',
    //             permanent: true,
    //         },
    //     };
    // }


    // res.setHeader("location", "/login");
    // res.statusCode = 302;
    // res.end();
    return {
        props: {
            data: true,
        }
    };
};

export default function Custom500({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    console.log(router);
}


