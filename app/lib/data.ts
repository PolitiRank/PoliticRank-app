'use server';

import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma'; // Need to ensure single instance
import { Prisma } from '@prisma/client';

export async function fetchUsers() {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    // @ts-ignore
    const { role, partyId, slateId } = session.user;

    const where: Prisma.UserWhereInput = {};

    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
        // No filter, see all
    } else if (role === 'DIRIGENTE') {
        if (!partyId) throw new Error('Party ID missing for Dirigente');
        where.partyId = partyId;
    } else if (role === 'LIDER_CHAPA') {
        if (!slateId) throw new Error('Slate ID missing for Lider');
        where.slateId = slateId;
    } else {
        // Candidates or others can only see themselves (or nothing on this list)
        where.id = session.user.id;
    }

    const users = await prisma.user.findMany({
        where,
        include: {
            party: true,
            slate: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return users;
}
