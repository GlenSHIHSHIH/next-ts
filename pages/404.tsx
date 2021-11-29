import { useRouter } from 'next/router';
import { useEffect } from 'react';

// export const getStaticProps: GetStaticProps = async () => {
//     return {
//         redirect: {
//             destination: '/production/list',
//             permanent: true,
//         },
//     };
// };

export default function Custom404() {
    const router = useRouter();
    useEffect(() => {
        router.push('/production/list');
     }, [])
    return (<h1>404 - Page Not Found</h1>)
}
