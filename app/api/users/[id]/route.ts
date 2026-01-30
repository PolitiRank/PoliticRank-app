import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    // @ts-ignore
    const { role: currentUserRole, partyId: currentUserPartyId, slateId: currentUserSlateId } = session.user;

    try {
        const body = await request.json();
        let { email, password, name, role, partyId, slateId } = body;

        // Fetch existing user to validate permissions
        const userToUpdate = await prisma.user.findUnique({ where: { id } });

        if (!userToUpdate) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // --- RBAC Protection ---

        // 1. Target Scope Check: Can I even touch this user?
        if (currentUserRole !== 'SUPER_ADMIN' && currentUserRole !== 'ADMIN') {
            if (currentUserRole === 'DIRIGENTE') {
                if (userToUpdate.partyId !== currentUserPartyId) {
                    return NextResponse.json({ error: 'Forbidden: Can only edit users from your party' }, { status: 403 });
                }
            } else if (currentUserRole === 'LIDER_CHAPA') {
                if (userToUpdate.slateId !== currentUserSlateId) {
                    return NextResponse.json({ error: 'Forbidden: Can only edit users from your slate' }, { status: 403 });
                }
                if (userToUpdate.role === 'LIDER_CHAPA') { // Cannot edit other leaders or self fully? Self edit usually allowed but restricted.
                    // Allow self edit but restricted fields below
                }
            } else if (currentUserRole === 'CANDIDATO') {
                if (userToUpdate.id !== session.user.id) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }
            }
        }

        // 2. Field Modification Check: What can I change?
        if (currentUserRole !== 'SUPER_ADMIN') {
            // Non-Super Admins cannot change Role
            if (role && role !== userToUpdate.role) {
                // Allow Admin to change roles of lower users? Yes.
                if (currentUserRole === 'ADMIN' && ['SUPER_ADMIN'].includes(userToUpdate.role)) {
                    return NextResponse.json({ error: 'Forbidden: Admin cannot change Super Admin role' }, { status: 403 });
                }
                // Dirigente cannot change roles? Or maybe define who is Leader?
                // Let's stick to strict: Dirigente creates/edits Candidates/Leaders.
                // If Dirigente tries to promote to Admin -> Fail.
                if (['SUPER_ADMIN', 'ADMIN'].includes(role)) {
                    return NextResponse.json({ error: 'Forbidden: Cannot promote to Admin' }, { status: 403 });
                }
            }

            // Only Super Admin/Admin/Dirigente can change Party
            if (partyId && partyId !== userToUpdate.partyId) {
                if (currentUserRole !== 'SUPER_ADMIN' && currentUserRole !== 'ADMIN') {
                    return NextResponse.json({ error: 'Forbidden: Cannot maintain party assignment' }, { status: 403 });
                }
            }
        }

        // Data Preparation
        const updateData: any = {
            email,
            name,
            role,
            partyId,
            slateId
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Cleanup undefined
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
