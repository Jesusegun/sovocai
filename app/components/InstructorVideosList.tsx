import { Clock, Tag, Video } from 'lucide-react'
import { getDifficultyLabel } from '@/utils/learning-constants'

export type InstructorVideoEntry = {
  id: string
  title: string
  youtube_url: string
  skill_category: string
  difficulty_level: number
  tags: string[] | null
  recommended_order: number
  created_at: string
}

type InstructorVideosListProps = {
  videos: InstructorVideoEntry[]
  loading: boolean
  emptyHint: string
  iconTone: 'blue' | 'slate'
}

/**
 * Reusable "My Videos" section for instructor-facing pages.
 */
export function InstructorVideosList({
  videos,
  loading,
  emptyHint,
  iconTone,
}: InstructorVideosListProps) {
  const iconWrapperClass =
    iconTone === 'blue'
      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-500'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'

  return (
    <section className="animate-fade-in-up stagger-2">
      <div className="flex items-center gap-2 mb-4">
        <Video className="w-5 h-5 text-slate-400" />
        <h2 className="text-xl font-bold">My Videos</h2>
        <span className="ml-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
          {videos.length}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl">
          <Video className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No videos uploaded yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{emptyHint}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconWrapperClass}`}>
                <Video className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{video.title}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span>{video.skill_category}</span>
                  <span>•</span>
                  <span>{getDifficultyLabel(video.difficulty_level)}</span>
                  {video.tags && video.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {video.tags.slice(0, 3).join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {new Date(video.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
