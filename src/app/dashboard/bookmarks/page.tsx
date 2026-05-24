import type { Metadata }  from 'next'
import Link               from 'next/link'
import { redirect }       from 'next/navigation'
import { createClient }   from '@/lib/supabase/server'
import { getUserBookmarks, type BookmarkedQuestion } from '@/app/actions/bookmarks'
import { BookmarkCheck, BookOpen, ChevronRight, GraduationCap } from 'lucide-react'
import { BookmarksClient } from './_components/BookmarksClient'

export const metadata: Metadata = {
  title: 'Saved Questions — OverseasNursing',
  description: 'Review your bookmarked mock test questions.',
}

export const dynamic = 'force-dynamic'

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/dashboard/bookmarks')

  const bookmarks = await getUserBookmarks()

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 flex items-center gap-2">
            <BookmarkCheck size={20} className="text-amber-500" /> Saved Questions
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            {bookmarks.length} question{bookmarks.length !== 1 ? 's' : ''} bookmarked
          </p>
        </div>
        <Link href="/mock-tests"
          className="flex items-center gap-2 h-9 px-4 bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold rounded-xl transition-colors">
          <BookOpen size={13} /> Browse Tests
        </Link>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <GraduationCap size={36} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-[16px] font-semibold text-slate-600 mb-2">No saved questions yet</h2>
          <p className="text-[13px] text-slate-400 mb-5">
            While studying or reviewing results, tap the bookmark icon to save questions here.
          </p>
          <Link href="/mock-tests"
            className="inline-flex items-center gap-2 h-9 px-5 bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold rounded-xl transition-colors">
            Start Studying <ChevronRight size={13} />
          </Link>
        </div>
      ) : (
        <BookmarksClient bookmarks={bookmarks} />
      )}
    </div>
  )
}
