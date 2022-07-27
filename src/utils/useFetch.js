import { useEffect, useState } from "react";
import { get } from './request'

const useFetch = (url, condition = true) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (condition) {
                setLoading(true);
                try {
                    const res = await get(url);
                    console.log(res)
                    if (res.success) {
                        setData(res.data);
                    }
                    else setData(res)
                } catch (err) {
                    setError(err);
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    const reFetch = async () => {
        setLoading(true);
        try {
            const res = await get(url);
            if (res.success) {
                setData(res.data);
            }
            else setData(res)
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return { data, setData, loading, error, reFetch };
};

export default useFetch;
