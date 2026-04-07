import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LearnSkillClientPage from './LearnSkillClientPage'

type LearnSkillPageProps = {
  params: Promise<{ skill: string }>
}

export default async function LearnSkillPage({ params }: LearnSkillPageProps) {
  const { skill } = await params
  const decodedSkill = decodeURIComponent(skill)
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/learn/${skill}`)}`)
  }

  return <LearnSkillClientPage skill={decodedSkill} />
}
