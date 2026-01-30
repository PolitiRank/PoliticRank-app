import React from 'react';
import { UserRow } from '../molecules/UserRow';
import { UserWithRelations } from '@/services/userService';

// interface UserWithRelations removed

interface UserTableProps {
    users: UserWithRelations[];
    isLoading?: boolean;
    onEdit: (user: UserWithRelations) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, isLoading, onEdit }) => {
    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Carregando usuários...</div>;
    }

    if (!users || users.length === 0) {
        return <div className="p-4 text-center text-gray-500">Nenhum usuário encontrado.</div>;
    }

    return (
        <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Email
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Cargo
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Partido/Chapa
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Editar</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.map((user) => (
                                    <UserRow key={user.id} user={user} onEdit={onEdit} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
