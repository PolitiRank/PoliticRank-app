import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const { role, partyId, slateId } = session.user;
    const where: Prisma.UserWhereInput = {};

    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
        // No filter
    } else if (role === 'DIRIGENTE') {
        if (!partyId) return NextResponse.json({ error: 'Party ID missing' }, { status: 403 });
        where.partyId = partyId;
    } else if (role === 'LIDER_CHAPA') {
        if (!slateId) return NextResponse.json({ error: 'Slate ID missing' }, { status: 403 });
        where.slateId = slateId;
    } else {
        where.id = session.user.id;
    }

    try {
        const users = await prisma.user.findMany({
            where,
            include: { party: true, slate: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const { role } = session.user;
    // TODO: Add stricter permission checks for creation

    try {
        const body = await request.json();
        const { email, password, name, role: newRole, partyId, slateId } = body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: newRole || 'CANDIDATO',
                partyId,
                slateId,
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
