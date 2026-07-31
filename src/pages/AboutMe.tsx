import { Link } from "react-router-dom";
import ModernHeader from "@/components/modern/Header";
import ProfessionalFooter from "@/components/professional/Footer";
import { cvData } from "@/data/cv";
import { getOptimizedUrl } from "@/utils/cloudinary";
import { Briefcase, GraduationCap, Award, CheckCircle2, UserCircle2 } from "lucide-react";

export default function AboutMe() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 flex flex-col">
            <ModernHeader />
            
            <main className="flex-1 pt-32 pb-24 px-6 sm:px-8">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 pb-12 border-b border-zinc-200 dark:border-zinc-800">
                        {cvData.personal.image ? (
                            <img 
                                src={getOptimizedUrl(cvData.personal.image, { width: 256, crop: "fill", quality: "auto", format: "auto" })} 
                                alt={cvData.personal.name} 
                                loading="lazy"
                                decoding="async"
                                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-zinc-900"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-zinc-900">
                                <UserCircle2 className="w-16 h-16 opacity-80" />
                            </div>
                        )}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-3">
                                {cvData.personal.name}
                            </h1>
                            <h2 className="text-xl sm:text-2xl font-medium text-violet-600 dark:text-violet-400 mb-6">
                                {cvData.personal.title}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed max-w-2xl">
                                {cvData.personal.about}
                            </p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-[1fr_300px] gap-12 items-start">
                        
                        {/* Main Column: Experience */}
                        <div className="space-y-16">
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-violet-100 dark:bg-violet-900/30 p-2.5 rounded-xl">
                                        <Briefcase className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Professional Experience</h3>
                                </div>
                                <div className="space-y-10">
                                    {cvData.experience.map((exp, idx) => (
                                        <div key={idx} className="relative pl-8 sm:pl-0">
                                            {/* Mobile timeline dot */}
                                            <div className="sm:hidden absolute left-0 top-1.5 h-3 w-3 rounded-full bg-violet-500 border-2 border-white dark:border-zinc-950" />
                                            
                                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-1 sm:gap-4">
                                                <h4 className="text-xl font-semibold text-zinc-900 dark:text-white">{exp.title}</h4>
                                                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 shrink-0">{exp.period}</span>
                                            </div>
                                            <div className="text-violet-600 dark:text-violet-400 font-medium mb-4">{exp.company}</div>
                                            <p className="text-zinc-600 dark:text-zinc-300 text-[15px] mb-4 leading-relaxed">
                                                {exp.description}
                                            </p>
                                            <ul className="space-y-2.5">
                                                {exp.responsibilities.map((resp, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                        <span className="text-violet-500 mt-1 shrink-0 text-[10px]">■</span>
                                                        <span className="leading-relaxed">{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2.5 rounded-xl">
                                        <GraduationCap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Education</h3>
                                </div>
                                <div className="space-y-6">
                                    {cvData.education.map((edu, idx) => (
                                        <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                            <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">{edu.degree}</h4>
                                            <div className="text-zinc-600 dark:text-zinc-400">{edu.institution}</div>
                                            <div className="text-sm text-zinc-500 mt-2 font-medium">{edu.period}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar: Skills & Certifications */}
                        <div className="space-y-12">
                            <section>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">Core Expertise</h3>
                                <div className="space-y-8">
                                    {cvData.skills.map((skillGroup, idx) => (
                                        <div key={idx}>
                                            <h4 className="text-[15px] font-semibold text-zinc-900 dark:text-white mb-4">{skillGroup.category}</h4>
                                            <div className="flex flex-col gap-2.5">
                                                {skillGroup.items.map((skill, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                        <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                                                        <span>{skill}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                                    <Award className="w-5 h-5 text-amber-500" />
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Certifications</h3>
                                </div>
                                <div className="space-y-5">
                                    {cvData.certifications.map((cert, idx) => (
                                        <div key={idx}>
                                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug mb-1">{cert.name}</h4>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-violet-600 dark:text-violet-400 font-medium">{cert.issuer}</span>
                                                <span className="text-zinc-500">{cert.year}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                    </div>
                </div>
            </main>

            <ProfessionalFooter />
        </div>
    );
}
