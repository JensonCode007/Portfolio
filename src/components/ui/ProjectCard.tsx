"use client"
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedContent from "@/components/ui/AnimatedContent";
import FluxLines from "@/components/ui/FluxLines";

interface ProjectCardProps{
    title:string;
    sub?:string;
    description:string;
    tags:string[];
    githubUrl?:string;
    showFlux?: boolean;
}

export default function ProjectCard({title, sub, description, tags, githubUrl, showFlux = false}:ProjectCardProps){
    return(
        <AnimatedContent distance={24} duration={0.65} threshold={0.08} className="h-fit self-start" style={{ willChange: 'transform, opacity' }}>
        <Card className="group relative isolate h-fit overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.07]">
            {showFlux && (
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-100">
                    <FluxLines
                        colors={['#ffffff', '#bdbdbd', '#ffffff']}
                        speed={0.3}
                        scale={2.1}
                        turbulence={0.75}
                        fluidity={0.14}
                        rimWidth={0.3}
                        sharpness={2.2}
                        shimmer={1}
                        glow={2.8}
                        lineWidth={1.2}
                        flowDirection="right"
                        mouseInteraction={false}
                        clickSwirl={false}
                        dpr={1}
                        opacity={0.42}
                    />
                </div>
            )}
            <CardHeader className="relative z-10 pb-3">
                <CardTitle className="text-xl font-bold text-white/95">{title}</CardTitle>
                {sub && <p className="text-sm font-medium text-white/65">{sub}</p>}
                <CardDescription className="leading-6 text-zinc-400">{description}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag)=>(
                        <span key={tag} className="rounded-md border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-zinc-300">
                            {tag}
                        </span>
                    ))}
                </div>
                {githubUrl && (
                    <Button asChild variant="outline" className="border-white/20 bg-white/[0.06] text-white hover:border-white/50 hover:bg-white/10 hover:text-white">
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer">View Code</a>
                    </Button>
                )}
            </CardContent>
            
        </Card>
        </AnimatedContent>
    )
}
