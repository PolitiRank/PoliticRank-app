import { auth } from '@/auth';

export default async function DashboardPage() {
    const session = await auth();
    // @ts-ignore
    const userRole = session?.user?.role;
    // @ts-ignore
    const partyId = session?.user?.partyId;

    return (
        <div className="px-4 py-4 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Bem-vindo(a)!</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg col-span-1 border-t-4 border-blue-500">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Seu Acesso</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{userRole}</dd>
                        <p className="mt-2 text-sm text-gray-500">Você está logado e ativo no sistema.</p>
                    </div>
                </div>

                {/* Quick Actions based on Role */}
                {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
                    <div className="bg-white overflow-hidden shadow rounded-lg col-span-1 lg:col-span-2">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Ações Rápidas (Admin)</h3>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <a href="/dashboard/users" className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                                    <div className="flex-1 min-w-0">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        <p className="text-sm font-medium text-gray-900">Gerenciar Usuários</p>
                                        <p className="text-sm text-gray-500">Criar, editar ou convidar novos usuários.</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
