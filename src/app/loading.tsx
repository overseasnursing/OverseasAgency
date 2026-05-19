import { Container } from '@/components/layout/Container'

export default function Loading() {
  return (
    <Container>
      <div className="min-h-[60vh] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-[14px] text-slate-400 font-medium">Loading&hellip;</p>
        </div>
      </div>
    </Container>
  )
}
