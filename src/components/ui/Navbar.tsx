import { Mail } from "lucide-react"; 
import { FaGithub, FaLinkedin, FaMedium } from "react-icons/fa6";


export default function Navbar(){
    return(
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">


            <div className="flex items-center gap-8">
                <a href="#home" className="font-bold text-xl text-white tracking-tighter">Jenson T Rajan</a>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                    <a href="#home" className="hover:text-white transition-colors">Home</a>
                    <a href="#about" className="hover:text-white transition-colors">About</a>
                    <a href="#projects" className="hover:text-white transition-colors">Projects</a>
                </div>        
            </div>
          

            <div className="flex items-center gap-4 text-zinc-400">
                  
                <a href="mailto:jensonrajan321@gmail.com" className="hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                </a>
                <a href="https://github.com/JensonCode007" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <FaGithub className="w-5 h-5" />
                </a>
                
                <a href="https://www.linkedin.com/in/jenson-t-rajan/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <FaLinkedin className="w-5 h-5" />
                </a>
                <a href="https://medium.com/@jensonrajan321" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <FaMedium className="w-5 h-5" />
                </a>
                
            </div>
        </div>    
    </nav>)

}