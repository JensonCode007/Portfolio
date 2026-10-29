"use client"
import ProjectCard from "@/components/ui/ProjectCard"
import {Particles} from "@/components/ui/particles"
import Text3DFlip from "@/components/ui/text-3d-flip";
import Navbar from "@/components/ui/Navbar";
import { TypingAnimation } from "@/components/ui/typing-animation";
import projectData from "@/data/projects.json"
import ProfileCard from "@/components/ui/ProfileCard";
import AnimatedContent from "@/components/ui/AnimatedContent";
import RippleDistortion from "@/components/ui/RippleDistortion";
import Beams from "@/components/ui/Beams";
import ExperienceTimeline from "@/components/ui/ExperienceTimeline";


export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white selection:bg-white/20">
      <Navbar/>
      
      <Particles
        className="absolute inset-0"
        quantity={110}
        ease={80}
        color="#d4d4d8"
        vy={0.1}
        size={0.55}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[34rem] bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.06),transparent_32%),radial-gradient(circle_at_15%_8%,rgba(255,255,255,0.035),transparent_25%)]" />
      <section id="home" className="relative z-10 flex min-h-screen items-center pb-24 pt-32 sm:pt-40">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <AnimatedContent className="flex flex-col items-start justify-center" trigger="mount" distance={28} duration={0.7}>
              <h2 className="text-2xl text-zinc-400 mb-2 font-medium tracking-wide">
                Hey there, I am
              </h2>
              <Text3DFlip
                className="mb-6"
                textClassName="text-6xl md:text-8xl font-bold text-white tracking-tighter"
                flipTextClassName="text-6xl md:text-8xl font-bold text-zinc-500 tracking-tighter"
                rotateDirection="top"
              >
                Jenson.
              </Text3DFlip>
              
              <TypingAnimation
                blinkCursor={true}
                pauseDelay={2000}
                loop
                typeSpeed={50}
                deleteSpeed={200}
                className="text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed"
              >
                A Software Engineer building high-performance backends, AI architectures, and interactive web experiences.
              </TypingAnimation>
            </AnimatedContent>

            
            <AnimatedContent className="relative mx-auto w-full max-w-[19rem] sm:max-w-[22rem]" trigger="mount" distance={28} delay={0.08} duration={0.8}>
                <div className="relative flex justify-center pb-2">
                  <div className="absolute inset-4 top-8 overflow-hidden rounded-[2rem] border border-white/10 opacity-60 shadow-2xl shadow-black/60">
                    <RippleDistortion
                      src="/ascii_output_my_image.png"
                      brushSize={130}
                      strength={0.16}
                      swirl={0.75}
                      rings={3}
                      spread={4}
                      fade={2.5}
                      spacing={24}
                    tint="#ffffff"
                      tintAmount={0.12}
                      grayscale
                      quality="low"
                      trigger="both"
                      className="opacity-70"
                    />
                  </div>
                  <ProfileCard
                    name="Jenson T Rajan"
                    title="Software Engineer"
                    handle="jensoncode007"
                    status="Open to work"
                    contactText="Say hello"
                    contactHref="mailto:jensonrajan321@gmail.com?subject=Hello%20Jenson"
                    avatarUrl="/ascii_output_my_image.png"
                    miniAvatarUrl="/ascii_output_my_image.png"
                    showUserInfo
                    enableTilt
                    enableMobileTilt={false}
                    behindGlowEnabled
                    behindGlowColor="rgba(255,255,255,0.22)"
                    innerGradient="linear-gradient(145deg,rgba(30, 30, 34, 0.28) 0%,rgba(72, 72, 78, 0.14) 100%)"
                    className=""
                  />
                </div>
              </AnimatedContent>

          </div>

        </div>
      </section>


      <section id="about" className="relative z-10 overflow-hidden border-y border-white/[0.06] bg-white/[0.02] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <Beams
            color="#ffffff"
            beamWidth={140}
            rotation={30}
            speed={0.65}
            waveLength={233}
            depth={1}
            sharpness={0.6}
            glow={0.85}
            brightness={1.6}
            grain={0.16}
            quality={0.6}
            dpr={1}
            mouseInteraction={false}
            intro
            opacity={0.9}
            className="h-full w-full"
          />
        </div>
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <AnimatedContent className="relative flex flex-col gap-6" stagger={0.06} distance={22} duration={0.65}>
            <TypingAnimation
                  as="h2"
                  blinkCursor={true}
                  pauseDelay={2000}
                  loop
                  startOnView
                  className="mb-8 inline-block border-b border-zinc-800 pb-4 text-4xl font-bold text-white"
            >
              /about
            </TypingAnimation>
            <div className="h-44 max-w-lg overflow-hidden sm:h-32">
              <TypingAnimation
                as="p"
                blinkCursor={true}
                pauseDelay={2000}
                typeSpeed={50}
                deleteSpeed={2}
                loop
                className="text-lg leading-relaxed text-zinc-400 md:text-xl"
              >
                Hey there, my name&apos;s Jenson. I&apos;m a final year student pursuing a computer science degree. I love programmnig and build cool projects. I also love reasearch and reading.
              </TypingAnimation>
            </div>
            </AnimatedContent>
        </div>
      </section>

      <section id="experience" className="relative z-10 border-y border-white/[0.06] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <AnimatedContent trigger="scroll" distance={22} duration={0.65}>
            <TypingAnimation
              as="h2"
              blinkCursor={true}
              pauseDelay={2000}
              loop
              startOnView
              className="mb-12 inline-block border-b border-zinc-800 pb-4 text-4xl font-bold text-white"
            >
              /experience
            </TypingAnimation>
          </AnimatedContent>
          <ExperienceTimeline />
        </div>
      </section>

      <section id="projects" className="relative z-10 mx-0 py-20 sm:mx-10 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <AnimatedContent trigger="scroll" distance={22} duration={0.65}>
            <TypingAnimation
                  as="h2"
                  blinkCursor={true}
                  pauseDelay={2000}
                  loop
                  startOnView
                  className="mb-12 inline-block border-b border-zinc-800 pb-4 text-4xl font-bold text-white"
            >
              /projects
            </TypingAnimation>
          </AnimatedContent>
        
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projectData.map((project)=>(
            
              <ProjectCard
                key={project.id}
                title={project.title}
                sub={project.sub}
                description={project.description}
                tags={project.tags}
                githubUrl={project.githubUrl}
                showFlux={['sentinel', 'eye-guardian', 'docuvault', 'trocr'].includes(project.id)}
                upcoming={['uotf', 'titan'].includes(project.id)}
              />
            
            
          ))}

        </div>
        

        </div>
        
        
      </section> 
      <footer className="relative z-10 border-t border-zinc-900 py-8 text-center text-sm text-zinc-500">
        <p>© 2026 Jenson T Rajan. All rights reserved.</p>
      </footer>
      
        
        
      
    </main>

  );
}
