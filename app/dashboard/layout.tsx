import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    // @ts-ignore
    const userRole = session.user.role;

    const navigation = [
        { name: 'Visão Geral', href: '/dashboard', roles: ['ALL'] },
        { name: 'Usuários', href: '/dashboard/users', roles: ['SUPER_ADMIN', 'ADMIN', 'DIRIGENTE'] },
        // { name: 'Candidatos', href: '/dashboard/candidates', roles: ['SUPER_ADMIN', 'ADMIN', 'DIRIGENTE', 'LIDER_CHAPA'] },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                                    PolitiRank
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => {
                                    if (item.roles.includes('ALL') || item.roles.includes(userRole)) {
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            >
                                                {item.name}
                                            </Link>
                                        )
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">{session.user.name}</span>
                                <span className="ml-2 text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">{userRole}</span>
                            </div>
                            <form
                                action={async () => {
                                    'use server';
                                    await signOut();
                                }}
                            >
                                <button className="text-sm text-red-600 hover:text-red-800">Sair</button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
