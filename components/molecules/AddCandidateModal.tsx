"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createCandidate } from "@/app/lib/actions"; // We will create this action next
import { Modal } from "./Modal"; // Using existing Modal generic

export function AddCandidateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    // @ts-ignore
    const [state, formAction] = useFormState(createCandidate, null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Candidato">
            <form action={formAction} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input
                        name="name"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Ex: João da Silva"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="joao@exemplo.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Será usado para o login do candidato.</p>
                </div>

                <div className="pt-2">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Redes Sociais (Opcional)</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                Instagram
                            </span>
                            <input
                                type="text"
                                name="instagram"
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="@usuario"
                            />
                        </div>

                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                Facebook
                            </span>
                            <input
                                type="text"
                                name="facebook"
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="URL ou Usuário"
                            />
                        </div>

                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                TikTok
                            </span>
                            <input
                                type="text"
                                name="tiktok"
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="@usuario"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Notas / Observações</label>
                    <textarea
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    >
                        Salvar Candidato
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>

                {/* @ts-ignore */}
                {state?.message && (
                    // @ts-ignore
                    <p className="text-red-600 text-sm text-center mt-2">{state.message}</p>
                )}
            </form>
        </Modal>
    );
}
