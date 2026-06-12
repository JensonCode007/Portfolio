import Image from "next/image";
import ProjectCard from "@/components/ui/ProjectCard"
import { Key } from "lucide-react";
import { profileEnd } from "console";
import { projectEntrypoints, projectOnExit } from "next/dist/build/swc/generated-native";





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
      // Notice there is no githubUrl here? The card will handle it gracefully 
      // and hide the button because we made it optional with the '?' earlier.
    },
    {
      title: "Web Aakriti Hub",
      description: "Event platform developed for the Jabagadadash international inter-university fest.",
      tags: ["Next.js", "Tailwind", "TypeScript"],
      githubUrl: "https://github.com/yourusername/webaakriti"
    }
  ];
  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          My Portfolio
        </h1>
        <p className="text-zinc-400 mb-12 max-w-2xl">
          Hi my name's Jenson. U can call me Jess. This is a porfolio website that I made from scratch
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project, index)=>(
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              tags={project.tags}
              githubUrl={project.githubUrl}
            />
          ))}

        </div>
      </div>
    </main>

  );
}
