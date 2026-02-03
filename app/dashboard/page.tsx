import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { Heart, Share2, MessageCircle, Users, Eye, TrendingUp, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

        // Mock Data for UI (Replace with real logic later)
        const metrics = {
            likes: 45,
            mentions: 23,
            comments: 128,
            whatsapp: 67,
            polls: 8,
            engagement: 87
        };

        const MetricCard = ({ icon: Icon, label, value, colorClass }: any) => (
            <Card className="flex flex-row items-center space-x-4 p-6 shadow-sm border-gray-100">
                <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
                    {/* @ts-ignore */}
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </Card>
        );

        return (
            <div className="px-6 py-8 sm:px-10 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="flex items-center space-x-4">
                        {candidateData?.image ? (
                            <img src={candidateData.image} alt="" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                <span className="text-2xl font-bold">{candidateData?.name?.[0]}</span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{candidateData?.name}</h1>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                Candidato • {candidateData?.email}
                            </p>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Settings className="w-4 h-4" />
                        <span>Atualizar Dados</span>
                    </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <MetricCard icon={Heart} label="Curtidas" value={metrics.likes} colorClass="bg-red-500" />
                    <MetricCard icon={Share2} label="Menções" value={metrics.mentions} colorClass="bg-blue-500" />
                    <MetricCard icon={MessageCircle} label="Comentários" value={metrics.comments} colorClass="bg-green-500" />
                    <MetricCard icon={Users} label="Mensagens de WhatsApp" value={metrics.whatsapp} colorClass="bg-purple-500" />
                    <MetricCard icon={Eye} label="Enquetes" value={metrics.polls} colorClass="bg-orange-500" />
                    <MetricCard icon={TrendingUp} label="Engajamento" value={`${metrics.engagement}%`} colorClass="bg-yellow-500" />
                </div>

                {/* Tabs / Bottom Section Navigation */}
                <div className="flex justify-center">
                    <div className="bg-white rounded-full p-1 border border-gray-200 inline-flex shadow-sm">
                        <button className="px-6 py-2 rounded-full bg-gray-900 text-white text-sm font-medium transition-all shadow-md">Painel</button>
                        <button className="px-6 py-2 rounded-full text-gray-500 text-sm font-medium hover:text-gray-900 hover:bg-gray-50 transition-all">Instagram</button>
                        <button className="px-6 py-2 rounded-full text-gray-500 text-sm font-medium hover:text-gray-900 hover:bg-gray-50 transition-all">WhatsApp</button>
                        <button className="px-6 py-2 rounded-full text-gray-500 text-sm font-medium hover:text-gray-900 hover:bg-gray-50 transition-all">Clientes</button>
                    </div>
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
