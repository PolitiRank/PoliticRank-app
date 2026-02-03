"use client";

import { useState } from "react";
import { AddCandidateModal } from "@/components/molecules/AddCandidateModal";
import { EditCandidateModal } from "@/components/molecules/EditCandidateModal";

// Helper to safely get social handle
const getHandle = (user: any, platform: string) => {
    if (!user.candidateProfile?.socialProfiles) return null;
    return user.candidateProfile.socialProfiles.find((p: any) => p.platform === platform)?.handle;
};

export function CandidateList({ candidates }: { candidates: any[] }) {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<any | null>(null);

    const handleEdit = (candidate: any) => {
        setEditingCandidate(candidate);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Lista de Candidatos</h2>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                >
                    + Adicionar Candidato
                </button>
            </div>

            <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Nome / Email
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Redes Sociais
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Score
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {candidates.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    Nenhum candidato encontrado. Adicione o primeiro!
                                </td>
                            </tr>
                        ) : (
                            candidates.map((person) => (
                                <tr key={person.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="font-medium text-gray-900">{person.name || "Sem Nome"}</div>
                                        <div className="text-gray-500">{person.email}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            {/* Instagram Indicator */}
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getHandle(person, 'INSTAGRAM') ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-400'}`}>
                                                IG
                                            </span>
                                            {/* Facebook Indicator */}
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getHandle(person, 'FACEBOOK') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                                                FB
                                            </span>
                                            {/* TikTok Indicator */}
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getHandle(person, 'TIKTOK') ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                TK
                                            </span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {person.candidateProfile?.politiScore || 0} pts
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button
                                            onClick={() => handleEdit(person)}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
