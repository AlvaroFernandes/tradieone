import { useAuthStore } from '@/store/auth.store'

export default function TokenPage() {
  const token = useAuthStore((s) => s.token)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcf9f8] px-6">
      <div className="w-full max-w-xl rounded-2xl border border-[rgba(194,198,216,0.3)] bg-white/70 px-10 py-12 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-sm">
        <h1 className="mb-2 font-manrope text-2xl font-bold text-[#1c1b1b]">
          Conta criada com sucesso!
        </h1>
        <p className="mb-8 font-inter text-sm text-[#424656]">
          Seu token de acesso foi gerado pelo servidor.
        </p>

        <div className="rounded-xl border border-[#c2c6d8] bg-[#f4f6fb] px-5 py-4">
          <p className="mb-2 font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]">
            Token
          </p>
          <p className="break-all font-mono text-sm text-[#1c1b1b]">{token}</p>
        </div>
      </div>
    </div>
  )
}
