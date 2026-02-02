'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    useEffect(() => {
        if (errorMessage === 'SUCCESS') {
            // Force hard reload to ensure session cookies are picked up
            window.location.href = '/dashboard';
        }
    }, [errorMessage]);

    // Success State - Show loading screen while redirecting
    if (errorMessage === 'SUCCESS') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
                <div className="p-8 bg-white rounded-lg shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Login Realizado!</h2>
                    <p className="text-gray-600">Redirecionando para o painel...</p>
                    <div className="mt-4 w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-900">PolitiRank Login</h1>
                    <p className="text-sm text-gray-500">Acesse sua conta para continuar</p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">Lembrar de mim</label>
                        </div>
                        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Esqueceu a senha?</a>
                    </div>

                    <LoginButton />

                    <div className="flex flex-col space-y-2 mt-4">
                        {/* Always show feedback, even if just to say 'Pending' */}
                        {errorMessage && errorMessage !== 'SUCCESS' && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                                <strong>Erro:</strong> {errorMessage}
                            </div>
                        )}
                        {/* Debug Info - Remove in final prod */}
                        {/* <p className="text-xs text-gray-400 text-center">Status: {errorMessage || 'Aguardando ação...'}</p> */}
                    </div>
                </form>
            </div>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            aria-disabled={pending}
        >
            {pending ? 'Entrando...' : 'Entrar'}
        </button>
    );
}
