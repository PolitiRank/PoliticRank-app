'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });
        return 'SUCCESS';
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciais inválidas.';
                default:
                    return 'Erro ao tentar entrar. Tente novamente.';
            }
        }
        // CRITICAL FIX: Rethrow non-AuthErrors (like NEXT_REDIRECT)
        // throw error; // No longer needed as we use redirect: false
        return 'Erro inesperado. Tente novamente mais tarde.';
    }
}
