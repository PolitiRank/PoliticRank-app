import api from './api';
import { User } from '@prisma/client';

export interface CreateUserDTO {
    name: string;
    email: string;
    password?: string;
    role: string;
    partyId?: string;
    slateId?: string;
}

export const userService = {
    getAll: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },
    create: async (data: CreateUserDTO) => {
        const response = await api.post<User>('/users', data);
        return response.data;
    },
    update: async (id: string, data: Partial<CreateUserDTO>) => {
        const response = await api.put<User>(`/users/${id}`, data); // Need to implement PUT route later
        return response.data;
    }
};
