"use client"
import ProjectCard from "@/components/ui/ProjectCard"
import {Particles} from "@/components/ui/particles"
import Text3DFlip from "@/components/ui/text-3d-flip";
import { TextAnimate } from "@/components/ui/text-animate"
import Navbar from "@/components/ui/Navbar";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { motion } from "framer-motion"
export default function Home() {
  const myProjects = [
   {
      title: "Neo - Local RAG Platform",
      description: "A self-hostable RAG platform built from scratch to chat with local files privately without uploading to the cloud.",
      tags: ["Python", "FastAPI", "React", "Vector DB"],
      githubUrl: "https://github.com/yourusername/neo"
    },
    {
      title: "Autonomous Underwater Vehicle",
      description: "Finalist at the IIT Madras AUV Competition. Developed the core logic and navigation systems.",
      tags: ["C++", "ROS", "Hardware integration"],
      
    },
    {
      title: "Web Aakriti Hub",
      description: "Event platform developed for the Jabagadadash international inter-university fest.",
      tags: ["Next.js", "Tailwind", "TypeScript"],
      githubUrl: "https://github.com/yourusername/webaakriti"
    }
  ];
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
                pauseDelay={50000}
                loop
                className="text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed"
              >
                A Software Engineer building high-performance backends, AI architectures, and interactive web experiences.
              </TypingAnimation>
            </div>

            
            <div className="flex items-center justify-center">
              
              <motion.div
                animate={{ y: [-14, 14, -14] }} 
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                className="relative w-full max-w-md aspect-square"
              >
                
                <img 
                  src="/ascii_output_my_image.png" 
                  alt="3D floating element" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>

          </div>

        </div>
      </section>


      <section id="about" className="relative z-10 py-24 bg-zinc-950/50">
        <div>
          <h2 className="text-4xl font-bold mb-12 text-white border-b border-zinc-800 pb-4 inline-block">
            About me
          </h2>
          <TextAnimate animation="blurInUp" by="character" delay={1} duration={5} >
            Hi my name's Jenson. U can call me Jess. This is a porfolio website that I made from scratch
          </TextAnimate>
        </div>  
      </section>

      <section id="projects" className="relative z-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project, index)=>(
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
        
      </section> 
      <footer className="relative z-10 py-8 border-t border-zinc-900 text-center text-zinc-500 text-sm">
        <p>© 2026 Jenson T Rajan. All rights reserved.</p>
      </footer>
      
        
        
      
    </main>

  );
}
