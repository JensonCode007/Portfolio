"use client";

import AnimatedContent from "@/components/ui/AnimatedContent";

const experiences = [
  {
    company: "Popkon Creatives",
    role: "Website Design & Development Intern",
    period: "Jul 2026 - Sep 2026",
    location: "Ernakulam, Kerala",
    description:
      "Designed and maintained client websites, improving front-end polish, responsiveness, page speed, and SEO while resolving post-launch issues.",
    tags: ["Web Development", "Responsive Design", "SEO"],
  },
  {
    company: "Cochin University of Science and Technology",
    role: "Student Researcher",
    period: "May 2025 - Jun 2025",
    location: "Ernakulam, Kerala",
    description:
      "Researched historical OCR and built datasets and character mappings for CNN and Transformer models focused on Old Malayalam manuscript transliteration.",
    tags: ["Deep Learning", "OCR", "Research"],
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="relative mt-2">
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-[0.7rem] top-5 w-px bg-gradient-to-b from-white/60 via-white/25 to-white/10 sm:left-[1.05rem]"
      />

      <div className="space-y-8 sm:space-y-10">
        {experiences.map((experience, index) => (
          <AnimatedContent
            key={experience.company}
            trigger="scroll"
            delay={index * 0.08}
            distance={18}
            duration={0.6}
            className="relative grid grid-cols-[2rem_1fr] gap-4 sm:grid-cols-[2.5rem_1fr] sm:gap-7"
          >
            <div className="relative z-10 flex justify-center">
              <span
                aria-hidden="true"
                className="mt-5 h-4 w-4 rounded-full border border-white/90 bg-[#07070a] shadow-[0_0_0_4px_rgba(255,255,255,0.06),0_0_20px_rgba(255,255,255,0.2)]"
              />
            </div>

            <article className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.2)] transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.045] sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {experience.company}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-zinc-300 sm:text-base">
                    {experience.role}
                  </p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {experience.period}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">{experience.location}</p>
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                {experience.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {experience.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}
