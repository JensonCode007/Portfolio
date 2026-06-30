"use client"
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"


import { motion } from "framer-motion"
import { Pointer } from "lucide-react";

interface ProjectCard{
    title:string;
    description:string;
    tags:string[];
    githubUrl?:string;
    index: number;
}

export default function ProjectCard({title, description, tags, githubUrl, index}:ProjectCard){
    return(
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 2, y: 0 }} viewport={{ once: true, margin: "-50px" }}
        transition={{ 
        duration: 0.5, 
        delay: 0.1,
        ease: "easeOut",
        }} whileHover={{ y: -5, scale: 1, cursor: "pointer" }}
        >
        <Card className="
            relative
            overflow-hidden
            rounded-[36px]

            bg-white/[0.07]
            backdrop-blur-[40px]
            backdrop-saturate-[180%]

            border border-white/15

            shadow-[0_12px_50px_rgba(0,0,0,0.22)]
            rounded-4xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-600">{title}</CardTitle>
                <CardDescription className="text-zinc-400">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag)=>(
                        <span key={tag} className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>
                {githubUrl && (
                    <Button asChild variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer">View Code</a>
                    </Button>
                )}
            </CardContent>
            
        </Card>
        </motion.div>
    )
}