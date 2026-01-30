'use client';

import { useUsers } from '@/hooks/useUsers';
import { UserTable } from '@/components/organisms/UserTable';
import { Button } from '@/components/atoms/Button';

export default function UsersPage() {
    const { users, isLoading, isError } = useUsers();

    if (isError) return <div className="p-4 text-red-500">Erro ao carregar usuários.</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Usuários</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Lista de todos os usuários do sistema (Via API/Axios).
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Button>Adicionar Usuário</Button>
                </div>
            </div>

            <UserTable users={users} isLoading={isLoading} />
        </div>
    );
}
