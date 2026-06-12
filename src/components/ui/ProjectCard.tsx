import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"


interface ProjectCard{
    title:string;
    description:string;
    tags:string[];
    githubUrl?:string
}

export default function ProjectCard({title, description, tags, githubUrl}:ProjectCard){
    return(
        <Card className="w-full bg-zinc-900 border-zinc-800 title-white">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
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
    )
}