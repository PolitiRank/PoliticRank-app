import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          PolitiRank Dev
        </h1>

        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl max-w-md w-full">
          <h2 className="text-xl mb-4 font-semibold text-center">Integração Meta</h2>
          <p className="text-gray-400 text-center mb-8">
            Clique abaixo para conectar a conta do Facebook/Instagram e gerar o Token de Acesso.
          </p>

          <Link
            href="/api/auth/facebook"
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
            Conectar com Facebook
          </Link>
        </div>

        <div className="text-xs text-gray-500 mt-8">
          <p>Verifique o console do VS Code após o login para ver o Token.</p>
        </div>
      </div>
    </main>
  );
}
