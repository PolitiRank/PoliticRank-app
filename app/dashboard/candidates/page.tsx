import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchCandidates } from "@/app/lib/data";
import { CandidateList } from "@/components/organisms/CandidateList";

export default async function CandidateSelectionPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // @ts-ignore
    const userRole = session.user.role;
    // @ts-ignore
    const partyId = session.user.partyId;
    // @ts-ignore
    const slateId = session.user.slateId;

    const candidates = await fetchCandidates(userRole, partyId, slateId);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Seleção de Candidatos</h1>
                    <p className="text-gray-500 mt-2">Gerencie os candidatos da sua chapa e acompanhe o desempenho.</p>
                </div>
                {/* Button moved to inside CandidateList for better layout control or redundant here */}
            </div>

            <CandidateList candidates={candidates} />
        </div>
    );
}
