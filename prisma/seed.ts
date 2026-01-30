import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10)

    // 1. Super Admin
    await prisma.user.upsert({
        where: { email: 'admin@politirank.com' },
        update: { password: hashedPassword, role: Role.SUPER_ADMIN },
        create: {
            email: 'admin@politirank.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
        },
    })
    console.log('👑 Super Admin criado/atualizado.')

    // 2. Admin (Secretária)
    await prisma.user.upsert({
        where: { email: 'secretaria@politirank.com' },
        update: { password: hashedPassword, role: Role.ADMIN },
        create: {
            email: 'secretaria@politirank.com',
            name: 'Secretária Admin',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    })
    console.log('👩‍💼 Admin (Secretária) criado.')

    // 3. Criar Partidos (Party)
    const partidoA = await prisma.party.upsert({
        where: { code: 'PARTIDO_A' },
        update: {},
        create: { name: 'Partido do Progresso', code: 'PARTIDO_A' },
    })

    const partidoB = await prisma.party.upsert({
        where: { code: 'PARTIDO_B' },
        update: {},
        create: { name: 'Partido da Inovação', code: 'PARTIDO_B' },
    })
    console.log('🏛️ Partidos criados.')

    // 4. Criar Chapas (Slate) - Usando findFirst/Create para evitar erro de ObjectID
    let chapa1 = await prisma.slate.findFirst({ where: { name: 'Chapa Renovação', partyId: partidoA.id } })
    if (!chapa1) {
        chapa1 = await prisma.slate.create({
            data: { name: 'Chapa Renovação', partyId: partidoA.id }
        })
    }

    let chapa2 = await prisma.slate.findFirst({ where: { name: 'Chapa Futuro', partyId: partidoA.id } })
    if (!chapa2) {
        chapa2 = await prisma.slate.create({
            data: { name: 'Chapa Futuro', partyId: partidoA.id }
        })
    }
    console.log('📜 Chapas criadas.')

    // 5. Dirigente Partidário
    await prisma.user.upsert({
        where: { email: 'dirigente@partidoa.com' },
        update: {
            password: hashedPassword,
            role: Role.DIRIGENTE,
            partyId: partidoA.id,
        },
        create: {
            email: 'dirigente@partidoa.com',
            name: 'Dirigente Partido A',
            password: hashedPassword,
            role: Role.DIRIGENTE,
            partyId: partidoA.id,
        },
    })
    console.log('👔 Dirigente criado.')

    // 6. Líder de Chapa
    await prisma.user.upsert({
        where: { email: 'lider@chapa1.com' },
        update: {
            password: hashedPassword,
            role: Role.LIDER_CHAPA,
            partyId: partidoA.id,
            slateId: chapa1.id,
        },
        create: {
            email: 'lider@chapa1.com',
            name: 'Líder Chapa Renovação',
            password: hashedPassword,
            role: Role.LIDER_CHAPA,
            partyId: partidoA.id,
            slateId: chapa1.id,
        },
    })
    console.log('🗣️ Líder de Chapa criado.')

    // 7. Candidatos
    await prisma.user.upsert({
        where: { email: 'candidato1@chapa1.com' },
        update: {
            password: hashedPassword,
            role: Role.CANDIDATO,
            partyId: partidoA.id,
            slateId: chapa1.id,
        },
        create: {
            email: 'candidato1@chapa1.com',
            name: 'Candidato Um',
            password: hashedPassword,
            role: Role.CANDIDATO,
            partyId: partidoA.id,
            slateId: chapa1.id,
        },
    })

    await prisma.user.upsert({
        where: { email: 'candidato2@chapa2.com' },
        update: {
            password: hashedPassword,
            role: Role.CANDIDATO,
            partyId: partidoA.id,
            slateId: chapa2.id,
        },
        create: {
            email: 'candidato2@chapa2.com',
            name: 'Candidato Dois',
            password: hashedPassword,
            role: Role.CANDIDATO,
            partyId: partidoA.id,
            slateId: chapa2.id,
        },
    })
    console.log('🗳️ Candidatos criados.')
    console.log('✅ Senhas atualizadas para 123456')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
