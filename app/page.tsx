import Link from 'next/link';
import { ArrowRight, Wrench, Sun, Zap } from 'lucide-react';

export default function Home() {
  const skills = [
    {
      id: 'Plumbing',
      title: 'Plumbing',
      icon: <Wrench className="w-8 h-8 text-blue-500" />,
      description: 'Master pipe systems, fixing leaks, and installing new fixtures.',
      color: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'Solar Installation',
      title: 'Solar Installation',
      icon: <Sun className="w-8 h-8 text-amber-500" />,
      description: 'Learn to mount panels, wire inverters, and set up off-grid batteries.',
      color: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'Electrical Wiring',
      title: 'Electrical Wiring',
      icon: <Zap className="w-8 h-8 text-indigo-500" />,
      description: 'Understand voltage, outlet wiring, and panel upgrades safely.',
      color: 'bg-indigo-500/10 border-indigo-500/20'
    }
  ];

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto py-12">
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Master any skill with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">AI-Curated Pathways</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Select a trade below. Our deterministic engine instantly orchestrates YouTube videos into a structured, progressive learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {skills.map((skill) => (
          <Link href={`/learn/${encodeURIComponent(skill.id)}`} key={skill.id} className="group flex flex-col h-full">
            <div className={`flex flex-col h-full p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${skill.color} group-hover:border-slate-300 dark:group-hover:border-slate-600`}>
              <div className="mb-4">
                {skill.icon}
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {skill.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">
                {skill.description}
              </p>
              <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                Start Learning <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
