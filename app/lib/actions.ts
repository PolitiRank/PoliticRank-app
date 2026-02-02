'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirectTo: '/dashboard',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                default:
                    console.error('AuthError:', error);
                    const cause = error.cause as any;
                    const causeMessage = cause?.message || String(cause || 'Unknown Cause');
                    return `Erro de Login: ${causeMessage}`;
            }
        }
        console.error('Login action failed:', error);
        return 'Erro inesperado ao tentar entrar. Tente novamente.';
    }
}
