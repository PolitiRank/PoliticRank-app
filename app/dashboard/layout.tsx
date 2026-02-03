import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuGroup } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

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
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{userRole?.toLowerCase() || 'Usuário'}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gray-100 p-0 hover:bg-gray-200">
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold border border-blue-200">
                                                {session.user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground text-gray-500">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Perfil do Administrador</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <form
                                                action={async () => {
                                                    'use server';
                                                    await signOut();
                                                }}
                                                className="w-full cursor-pointer"
                                            >
                                                <button className="flex w-full items-center text-red-600 cursor-pointer">
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    <span>Sair</span>
                                                </button>
                                            </form>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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
