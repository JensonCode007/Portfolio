"use client";

import { useState } from "react";
import { Mail, Menu, X } from "lucide-react"; 
import { FaGithub, FaLinkedin, FaMedium } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion"; 

export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">

        
        <div className="flex items-center gap-8">
          <a href="#home" className="font-bold text-xl text-white tracking-tighter">
            Jenson T Rajan
          </a>
          
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          </div>        
        </div>
      
        
        <div className="hidden md:flex items-center gap-4 text-zinc-400">
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

        
        <button 
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
         
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>    

      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}   
            exit={{ opacity: 0, y: -20 }}    
            className="md:hidden absolute top-16 left-0 w-full bg-black/95 border-b border-zinc-800 flex flex-col py-6 px-8 gap-6 shadow-2xl"
          >
           
            <div className="flex flex-col gap-4 text-sm font-medium text-zinc-400">
              <a href="#home" onClick={() => setIsOpen(false)} className="hover:text-white">Home</a>
              <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-white">About</a>
              <a href="#projects" onClick={() => setIsOpen(false)} className="hover:text-white">Projects</a>
            </div>

           
            <div className="flex items-center gap-6 text-zinc-400 pt-6 border-t border-zinc-800">
              <a href="mailto:jensonrajan321@gmail.com" className="hover:text-white">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://github.com/JensonCode007" target="_blank" rel="noreferrer" className="hover:text-white">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/jenson-t-rajan/" target="_blank" rel="noreferrer" className="hover:text-white">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="https://medium.com/@jensonrajan321" target="_blank" rel="noreferrer" className="hover:text-white">
                <FaMedium className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}