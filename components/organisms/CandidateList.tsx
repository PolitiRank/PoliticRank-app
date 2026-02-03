"use client";

import { useState } from "react";
import { AddCandidateModal } from "@/components/molecules/AddCandidateModal";
import { EditCandidateModal } from "@/components/molecules/EditCandidateModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Ticket, PenSquare, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Helper to safely get social handle
const getHandle = (user: any, platform: string) => {
    if (!user.candidateProfile?.socialProfiles) return null;
    return user.candidateProfile.socialProfiles.find((p: any) => p.platform === platform)?.handle;
};

export function CandidateList({ candidates }: { candidates: any[] }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleEdit = (candidate: any) => {
        setEditingCandidate(candidate);
    };

    const filteredCandidates = candidates.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Lista de Candidatos</h2>
                    <p className="text-sm text-gray-500 mt-1">{candidates.length} candidatos monitorados</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Buscar nome..."
                            className="pl-9 bg-white border-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/80">
                        <TableRow className="hover:bg-transparent border-b border-gray-200">
                            <TableHead className="w-[80px] font-semibold text-gray-700">#</TableHead>
                            <TableHead className="w-[300px] font-semibold text-gray-700">Nome</TableHead>
                            <TableHead className="font-semibold text-gray-700">Redes Sociais</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Score</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCandidates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                    Nenhum candidato encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCandidates.map((person, index) => (
                                <TableRow key={person.id} className="hover:bg-gray-50/60 transition-colors border-gray-100">
                                    <TableCell className="font-medium text-gray-500">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{person.name || "Sem Nome"}</span>
                                            <span className="text-xs text-gray-500">{person.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            {/* Instagram Row */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Instagram className={`w-4 h-4 ${getHandle(person, 'INSTAGRAM') ? 'text-pink-600' : 'text-gray-400'}`} />
                                                <span className={`${getHandle(person, 'INSTAGRAM') ? 'text-gray-700 font-medium' : 'text-gray-400 italic'}`}>
                                                    {getHandle(person, 'INSTAGRAM') || "Não conectado"}
                                                </span>
                                            </div>
                                            {/* Facebook Row */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Facebook className={`w-4 h-4 ${getHandle(person, 'FACEBOOK') ? 'text-blue-600' : 'text-gray-400'}`} />
                                                <span className={`${getHandle(person, 'FACEBOOK') ? 'text-gray-700 font-medium' : 'text-gray-400 italic'}`}>
                                                    {getHandle(person, 'FACEBOOK') || "Não conectado"}
                                                </span>
                                            </div>
                                            {/* TikTok Row */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Ticket className={`w-4 h-4 ${getHandle(person, 'TIKTOK') ? 'text-black' : 'text-gray-400'}`} />
                                                <span className={`${getHandle(person, 'TIKTOK') ? 'text-gray-700 font-medium' : 'text-gray-400 italic'}`}>
                                                    {getHandle(person, 'TIKTOK') || "Não conectado"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${(person.candidateProfile?.politiScore || 0) > 80 ? 'bg-green-100 text-green-700' :
                                                (person.candidateProfile?.politiScore || 0) > 50 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-500'
                                            }`}>
                                            {person.candidateProfile?.politiScore || 0}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(person)}
                                                        className="h-8 w-8 p-0 hover:bg-blue-50 text-blue-600 cursor-pointer"
                                                    >
                                                        <PenSquare className="h-4 w-4" />
                                                        <span className="sr-only">Editar</span>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Editar Candidato</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AddCandidateModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
            {/* Edit Modal */}
            {editingCandidate && (
                <EditCandidateModal
                    isOpen={!!editingCandidate}
                    onClose={() => setEditingCandidate(null)}
                    candidate={editingCandidate}
                />
            )}
        </div>
    );
}
