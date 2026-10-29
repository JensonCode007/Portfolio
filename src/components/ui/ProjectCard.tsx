"use client"
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AnimatedContent from "@/components/ui/AnimatedContent";
import FluxLines from "@/components/ui/FluxLines";
import StarBorder from "@/components/ui/StarBorder";

interface ProjectCardProps{
    title:string;
    sub?:string;
    description:string;
    tags:string[];
    githubUrl?:string;
    showFlux?: boolean;
    upcoming?: boolean;
}

export default function ProjectCard({title, sub, description, tags, githubUrl, showFlux = false, upcoming = false}:ProjectCardProps){
    const card = (
        <Card className={`group relative isolate h-fit overflow-hidden rounded-3xl border shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-colors duration-300 ${upcoming ? 'border-transparent bg-[#0a0a0d]' : 'border-white/10 bg-white/[0.045] hover:border-white/30 hover:bg-white/[0.07]'}`}>
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
                {upcoming && (
                    <span className="mb-2 inline-flex w-fit rounded-full border border-white/20 bg-white/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                        Upcoming
                    </span>
                )}
                <CardTitle className="text-xl font-bold text-white/95">{title}</CardTitle>
                {sub && <p className="text-sm font-medium text-white/65">{sub}</p>}
                <CardDescription className="leading-6 text-zinc-400">{description}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="mb-4 flex flex-wrap gap-2">
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
    );

    return(
        <AnimatedContent distance={24} duration={0.65} threshold={0.08} className="h-fit self-start" style={{ willChange: 'transform, opacity' }}>
        {upcoming ? (
            <StarBorder
                as="div"
                color="#ffffff"
                trailColor="#bdbdbd"
                duration={5}
                direction="clockwise"
                stars={1}
                trailLength={0.28}
                thickness={1}
                radius={24}
                glow={0.7}
                hover="brighten"
                clickPulse={false}
                theme="dark"
                backgroundColor="transparent"
                borderColor="rgba(255,255,255,0.12)"
                className="!block !w-full !rounded-3xl !bg-transparent !p-0"
            >
                {card}
            </StarBorder>
        ) : card}
        </AnimatedContent>
    )
}
