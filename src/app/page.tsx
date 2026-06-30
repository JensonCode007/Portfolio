"use client"
import { useEffect, useRef, useState, useCallback } from 'react';
import ProjectCard from "@/components/ui/ProjectCard"
import {Particles} from "@/components/ui/particles"
import Text3DFlip from "@/components/ui/text-3d-flip";
import { TextAnimate } from "@/components/ui/text-animate"
import Navbar from "@/components/ui/Navbar";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { motion } from "framer-motion"
import projectData from "@/data/projects.json"
import ProfileCard from "@/components/ui/ProfileCard";
import BorderGlow from '@/components/BorderGlow';


export default function Home() {
  function Reveal({children,delay=0,style={}}:{children:React.ReactNode;delay?:number;style?:React.CSSProperties}){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current!;
    const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');ob.disconnect();}},{threshold:0.1});
    ob.observe(el);return()=>ob.disconnect();
  },[]);
  return <div ref={ref} className="reveal" style={{transitionDelay:`${delay}ms`,...style}}>{children}</div>;
}
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar/>
      
      <Particles
        className="absolute inset-0"
        quantity={50} 
        ease={80} 
        color="#bfa5a5" 
        refresh 

      />
      <section id="home" className="relative z-10 pt-40 pb-24 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start justify-center">
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
            </div>

            
            <Reveal delay={60}>
                {/* ProfileCard — replaces TiltedCard, uses ASCII photo */}
                <div style={{display:'flex',justifyContent:'center',marginBottom:32}}>
                  <ProfileCard
                    name="Jenson T Rajan"
                    title="Software Engineer"
                    handle="jensoncode007"
                    status="Open to work"
                    contactText="Say hello"
                    avatarUrl="/ascii_output_my_image.png"
                    miniAvatarUrl="/ascii_output_my_image.png"
                    showUserInfo
                    enableTilt
                    enableMobileTilt={false}
                    behindGlowEnabled
                    behindGlowColor="rgba(124,58,237,0.55)"
                    innerGradient="linear-gradient(145deg,rgba(30, 26, 37, 0.18) 0%,rgba(99, 131, 129, 0.12) 100%)"
                    onContactClick={()=>window.location.href='mailto:jensonrajan321@gmail.com'}
                    className=""
                  />
                </div>
              </Reveal>

          </div>

        </div>
      </section>


      <section id="about" className="relative z-10 py-1 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <TypingAnimation
                blinkCursor={true}
                pauseDelay={2000}
                loop
                startOnView
                className="text-4xl font-bold mb-12 text-white border-b border-zinc-800 pb-4 inline-block "
          >
            /about
          </TypingAnimation>
          <div className="min-h-[150px]">
            <TypingAnimation
              blinkCursor={true}
              pauseDelay={2000}
              typeSpeed={50}
              deleteSpeed={2}
              loop
              className="text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed"
          >
            Hey there, my name's Jenson. I'm a final year student pursuing a computer science degree. I love programmnig and build cool projects. I also love reasearch and reading.
          </TypingAnimation>

          </div>
          
        </div>  
      </section>

      <section id="projects" className="relative z-10 py-1 mx-10">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <TypingAnimation
                blinkCursor={true}
                pauseDelay={2000}
                loop
                startOnView
                className="text-4xl font-bold mb-12 text-white border-b border-zinc-800 pb-4 inline-block "
        >
          /projects
        </TypingAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectData.map((project, index)=>(
            
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                tags={project.tags}
                githubUrl={project.githubUrl}
                index={index}
              />
            
            
          ))}

        </div>
        

        </div>
        
        
      </section> 
      <footer className="relative z-10 py-8 border-t border-zinc-900 text-center text-zinc-500 text-sm">
        <p>© 2026 Jenson T Rajan. All rights reserved.</p>
      </footer>
      
        
        
      
    </main>

  );
}