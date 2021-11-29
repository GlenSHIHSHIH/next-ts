import { useRouter } from 'next/router';
import { useEffect } from 'react';


export default function Custom500() {
    const router = useRouter();
    useEffect(() => {
        router.push('/production/list');
     }, [])
    return (<h1>500 - something error</h1>)
}


