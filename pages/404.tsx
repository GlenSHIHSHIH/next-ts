import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
    return {
        redirect: {
            destination: '/production/list',
            permanent: true,
        },
    };
};

export default getStaticProps;

// export default function Custom404() {
//     return <h1>404 - Page Not Found</h1>
// }