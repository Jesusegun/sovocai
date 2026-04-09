import Link from 'next/link';
import { ArrowRight, Wrench, Sun, Zap, Sparkles, BookOpen, TrendingUp, Award, HardHat, Car, Scissors } from 'lucide-react';

/**
 * Landing page with hero, skill cards, "How it works" section, and CTA.
 * Pure server component — no client-side data fetching needed.
 */
export default function Home() {
  const skills = [
    {
      id: 'Plumbing',
      title: 'Plumbing',
      icon: <Wrench className="w-8 h-8" />,
      description: 'Master pipe systems, fixing leaks, and installing new fixtures.',
      gradient: 'from-blue-500 to-cyan-400',
      bgAccent: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-500',
    },
    {
      id: 'Solar Installation',
      title: 'Solar Installation',
      icon: <Sun className="w-8 h-8" />,
      description: 'Learn to mount panels, wire inverters, and set up off-grid batteries.',
      gradient: 'from-amber-500 to-orange-400',
      bgAccent: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-500',
    },
    {
      id: 'Electrical Wiring',
      title: 'Electrical Wiring',
      icon: <Zap className="w-8 h-8" />,
      description: 'Understand voltage, outlet wiring, and panel upgrades safely.',
      gradient: 'from-indigo-500 to-purple-400',
      bgAccent: 'bg-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-500',
    },
    {
      id: 'Construction',
      title: 'Construction',
      icon: <HardHat className="w-8 h-8" />,
      description: 'Learn framing, concrete work, and structural building fundamentals.',
      gradient: 'from-emerald-500 to-teal-400',
      bgAccent: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'Automotive Repair',
      title: 'Automotive Repair',
      icon: <Car className="w-8 h-8" />,
      description: 'Diagnose engine issues, change brakes, and perform routine maintenance.',
      gradient: 'from-red-500 to-rose-400',
      bgAccent: 'bg-red-500/10 border-red-500/20',
      iconColor: 'text-red-500',
    },
    {
      id: 'Tailoring',
      title: 'Tailoring',
      icon: <Scissors className="w-8 h-8" />,
      description: 'Master stitching, pattern cutting, and garment construction techniques.',
      gradient: 'from-pink-500 to-fuchsia-400',
      bgAccent: 'bg-pink-500/10 border-pink-500/20',
      iconColor: 'text-pink-500',
    },
  ];

  const steps = [
    {
      num: '01',
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Choose a Skill',
      desc: 'Pick the trade you want to master from our curated catalogue.',
    },
    {
      num: '02',
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Get Your Learning Path',
      desc: 'Our algorithm structures top resources into a progressive curriculum.',
    },
    {
      num: '03',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Learn & Track Progress',
      desc: 'Watch embedded videos, mark completions, and see your growth.',
    },
    {
      num: '04',
      icon: <Award className="w-6 h-6" />,
      title: 'Apply Your Skills',
      desc: 'Graduate from foundations to practical application with confidence.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ============================================================
          Hero Section
          ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(30,64,175,0.25),_transparent_55%)]" />

        <div className="relative container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Expert-Curated Learning Paths
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight animate-fade-in-up">
            Master any trade with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
              AI-powered pathways
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl animate-fade-in-up stagger-2">
            Select a skill below and start your AI-structured, progressive learning journey from foundations to practical mastery.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-3">
            <Link
              href="#skills"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Explore Skills
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          Skill Cards
          ============================================================ */}
      <section id="skills" className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Choose your path
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Each skill comes with a structured curriculum built from expert-curated video resources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {skills.map((skill, idx) => (
            <Link
              href={`/learn/${encodeURIComponent(skill.id)}`}
              key={skill.id}
              className={`group flex flex-col h-full animate-fade-in-up stagger-${idx + 1}`}
            >
              <div
                className={`flex flex-col h-full p-6 md:p-8 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${skill.bgAccent} group-hover:border-slate-300 dark:group-hover:border-slate-600`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center text-white mb-5`}>
                  {skill.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {skill.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">
                  {skill.description}
                </p>
                <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Start Learning <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          How It Works
          ============================================================ */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              From zero to hands-on expertise in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className={`relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in-up stagger-${idx + 1}`}
              >
                <span className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute top-3 right-4 select-none">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA
          ============================================================ */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="relative max-w-3xl mx-auto text-center p-10 md:p-14 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight relative z-10">
            Ready to build real-world skills?
          </h2>
          <p className="mt-4 text-blue-100 text-lg relative z-10 max-w-lg mx-auto">
            Join Sovocai today and follow a structured path from beginner to practitioner for free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
