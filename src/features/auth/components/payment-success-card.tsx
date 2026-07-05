import { Banknote, Calendar, Check, Download, FileText, LayoutDashboard, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentSuccessCardProps {
  orderNumber: string
  amount: string
  nextBillingDate: string
  receiptEmail: string
  onViewReceipt: () => void
  onGoToDashboard: () => void
  onDownloadInvoice: () => void
}

export function PaymentSuccessCard({
  orderNumber,
  amount,
  nextBillingDate,
  receiptEmail,
  onViewReceipt,
  onGoToDashboard,
  onDownloadInvoice,
}: PaymentSuccessCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-[380px] rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-[0_0_0_10px_rgba(34,197,94,0.15)]">
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>

        <h2 className="mt-5 font-manrope text-2xl font-bold text-[#1c1b1b]">Payment Successful!</h2>
        <p className="mt-1 font-inter text-sm text-[#424656]">Your subscription has been upgraded.</p>

        <div className="mt-6 space-y-3 border-t border-[#e5e7eb] pt-5 text-left">
          <SummaryRow icon={<FileText className="h-4 w-4" />} label="Order Number" value={orderNumber} />
          <SummaryRow icon={<Banknote className="h-4 w-4" />} label="Amount" value={amount} />
          <SummaryRow icon={<Calendar className="h-4 w-4" />} label="Next billing date" value={nextBillingDate} />
          <SummaryRow icon={<Mail className="h-4 w-4" />} label="Receipt will be sent to" value={receiptEmail} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#e5e7eb] pt-6">
          <button
            type="button"
            onClick={onViewReceipt}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#0050cb] bg-white font-inter text-sm font-semibold text-[#0050cb] hover:bg-[#f0f4ff]"
          >
            <FileText className="h-4 w-4" />
            View Receipt
          </button>
          <button
            type="button"
            onClick={onGoToDashboard}
            className={cn(
              'flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0050cb] font-inter text-sm font-semibold text-white',
              'transition-opacity hover:opacity-90',
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </button>
        </div>

        <button
          type="button"
          onClick={onDownloadInvoice}
          className="mx-auto mt-4 flex items-center gap-1.5 font-inter text-sm font-semibold text-[#0050cb] hover:underline"
        >
          <Download className="h-4 w-4" />
          Download Invoice
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between font-inter text-sm">
      <span className="flex items-center gap-2 text-[#9ca3af]">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-[#1c1b1b]">{value}</span>
    </div>
  )
}
