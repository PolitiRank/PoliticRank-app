import useSWR from 'swr';
import api from '@/services/api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useUsers() {
    const { data, error, isLoading, mutate } = useSWR('/users', fetcher);

    return {
        users: data,
        isLoading,
        isError: error,
        mutate,
    };
}
