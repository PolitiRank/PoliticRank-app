import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';

export default async function DashboardPage() {
    const session = await auth();
    // @ts-ignore
    const userRole = session?.user?.role;
    // @ts-ignore
    const userId = session?.user?.id;

    // 1. Redirect Rules
    if (userRole === 'DIRIGENTE' || userRole === 'LIDER_CHAPA') {
        redirect('/dashboard/candidates');
    }

    // 2. Candidate Personal View
    if (userRole === 'CANDIDATO') {
        const candidateData = await prisma.user.findUnique({
            where: { id: userId },
            include: { candidateProfile: { include: { socialProfiles: true } } }
        });

        const profile = candidateData?.candidateProfile;

        return (
            <div className="px-4 py-4 sm:px-0">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Olá, {candidateData?.name}</h1>

                <div className="bg-white overflow-hidden shadow rounded-lg mb-6 border-l-4 border-blue-500">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">Seu PolitiScore</h3>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-4xl font-extrabold text-blue-600">
                                {profile?.politiScore || 0}
                            </span>
                            <span className="ml-1 text-xl font-semibold text-gray-500">/ 100</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Baseado em engajamento e dados.</p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Minhas Redes Conectadas</h3>
                    {profile?.socialProfiles && profile.socialProfiles.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {profile.socialProfiles.map((social) => (
                                <li key={social.id} className="py-3 flex justify-between">
                                    <span className="capitalize font-medium text-gray-700">{social.platform.toLowerCase()}</span>
                                    <span className="text-gray-500">{social.handle}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">Nenhuma rede social vinculada ainda.</p>
                    )}
                </div>
            </div>
        );
    }

    // 3. Admin View
    return (
        <div className="px-4 py-4 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Painel Administrativo (Super Admin)</h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Admin Status Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg col-span-1 border-t-4 border-indigo-600">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Sessão Ativa</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{userRole}</dd>
                        <p className="mt-2 text-sm text-gray-500">Acesso total ao sistema.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white overflow-hidden shadow rounded-lg col-span-1 lg:col-span-2">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Atalhos</h3>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <a href="/dashboard/users" className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                                <span className="flex-1 min-w-0">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p className="text-sm font-medium text-gray-900">Gerenciar Usuários</p>
                                    <p className="text-sm text-gray-500">Controle de acessos geral.</p>
                                </span>
                            </a>
                            <a href="/dashboard/candidates" className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                                <span className="flex-1 min-w-0">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p className="text-sm font-medium text-gray-900">Ver Todos Candidatos</p>
                                    <p className="text-sm text-gray-500">Visão global da lista.</p>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
