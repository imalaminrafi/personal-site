export interface AboutTimelineItem {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface AboutEducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface AboutCertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface AboutSkillCategory {
  category: string;
  items: string[];
}

export interface AboutValueItem {
  title: string;
  description: string;
}

export interface AboutToolItem {
  name: string;
}

export interface AboutSectionVisibility {
  hero: boolean;
  summary: boolean;
  focus: boolean;
  experience: boolean;
  skills: boolean;
  education: boolean;
  certifications: boolean;
  tools: boolean;
  values: boolean;
  cta: boolean;
}

export interface AboutData {
  hero: {
    name: string;
    title: string;
    image: string;
    paragraphs: string[];
    socialLinks: { platform: string; url: string }[];
  };
  summary: {
    heading: string;
    paragraphs: string[];
  };
  focus: {
    heading: string;
    subheading: string;
    items: { title: string; description: string }[];
  };
  experience: {
    heading: string;
    items: AboutTimelineItem[];
  };
  skills: {
    heading: string;
    categories: AboutSkillCategory[];
  };
  education: {
    heading: string;
    items: AboutEducationItem[];
  };
  certifications: {
    heading: string;
    items: AboutCertificationItem[];
  };
  tools: {
    heading: string;
    items: AboutToolItem[];
  };
  values: {
    heading: string;
    subheading: string;
    items: AboutValueItem[];
  };
  cta: {
    heading: string;
    subheading: string;
    buttonText: string;
    buttonLink: string;
  };
  visibility: AboutSectionVisibility;
}

const ABOUT_KEY = "ar_about_data";

const defaultAboutData: AboutData = {
  hero: {
    name: "Alamin Rafi",
    title: "Digital Specialist & Web Project Manager",
    image: "/Profile.png",
    paragraphs: [
      "I'm a Digital Specialist and Web Project Manager passionate about building modern, high-quality web solutions that help businesses grow. I lead cross-functional teams to deliver responsive, performance-optimized websites that make a real impact.",
      "My work bridges the gap between business goals and technical execution. With strong project management skills and a deep understanding of web systems, UI/UX design, and client communication, I ensure every project is delivered on time, within scope, and aligned with client expectations.",
      "Whether it's a complete website overhaul, an SEO-driven content strategy, or a digital marketing campaign, I bring a strategic, detail-oriented approach to every project I take on."
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/imalaminrafi/" },
      { platform: "GitHub", url: "https://github.com/imalaminrafi" },
      { platform: "Facebook", url: "https://www.facebook.com/alamin.rafiofficial" },
      { platform: "Twitter", url: "https://x.com/imalaminrafi" },
      { platform: "Behance", url: "https://www.behance.net/imalaminrafi" },
    ],
  },
  summary: {
    heading: "Professional Journey",
    paragraphs: [
      "My career spans digital marketing, SEO, WordPress development, graphic design, website management, content management, social media, IT support, and digital operations. I've worked across media, healthcare, and independent client projects, building a versatile skill set that allows me to tackle challenges from multiple angles.",
      "At RangTVBD.com, I led content and SEO strategy, driving significant organic traffic growth. At Medi-Aid Hospital, I managed digital operations and marketing campaigns. I've also delivered SEO strategies for financial news platforms and managed end-to-end web projects for international clients. Every role has sharpened my ability to deliver results that matter."
    ],
  },
  focus: {
    heading: "Current Focus",
    subheading: "Today I help businesses grow through professional website development, SEO, digital marketing, content strategy, graphic design, and growth-focused digital solutions.",
    items: [
      { title: "Professional Website Development", description: "Building modern, responsive, and high-performance websites tailored to your business needs." },
      { title: "SEO & Content Strategy", description: "Driving organic growth through data-driven SEO strategies and strategic content planning." },
      { title: "Digital Marketing", description: "Creating and executing digital marketing campaigns that generate real results and ROI." },
      { title: "Graphic Design", description: "Designing visual assets that strengthen your brand identity and communicate your message." },
      { title: "Business Growth Solutions", description: "Providing end-to-end digital solutions that help businesses scale and succeed online." },
    ],
  },
  experience: {
    heading: "Professional Experience",
    items: [
      { title: "Content & SEO Manager", company: "RangTVBD.com", period: "Jul 2025 – Dec 2025", description: "Led web content management and SEO strategy for a growing digital media platform. Managed SEO strategy and WordPress content optimization, improving organic search rankings and website traffic. Led editorial calendar planning and oversaw content production workflow." },
      { title: "Digital Operations Officer", company: "Medi-Aid Hospital", period: "June 2023 – December 2023", description: "Managed the hospital's digital presence and digital marketing strategies. Oversaw WordPress website management and online patient engagement systems. Led digital marketing campaigns to increase patient acquisition." },
      { title: "SEO Specialist (Contract)", company: "Orthosongbad.com", period: "March 2023 – May 2023", description: "Delivered a comprehensive SEO strategy for a financial news portal. Conducted SEO audits and implemented technical optimization strategies. Performed keyword research and competitive analysis to guide content planning." },
      { title: "Web Project Manager & UI/UX Consultant", company: "Independent Client Projects", period: "2020 – 2023", description: "Managed end-to-end web projects for international and local clients. Oversaw UI/UX design phases, translating client requirements into actionable design systems. Delivered projects within scope, budget, and timeline." },
    ],
  },
  skills: {
    heading: "Skills & Expertise",
    categories: [
      { category: "Website Development", items: ["Front-End Development", "WordPress Development", "Responsive Design", "Performance Optimization", "Website Maintenance"] },
      { category: "SEO & Marketing", items: ["Technical SEO", "Content Strategy", "Digital Marketing", "Keyword Research", "Analytics & Reporting"] },
      { category: "Design", items: ["Graphic Design", "UI/UX Design", "Wireframing", "Prototyping", "Brand Identity"] },
      { category: "Management", items: ["Project Management", "Client Communication", "Team Coordination", "Timeline Planning", "Quality Assurance"] },
      { category: "Tools & Systems", items: ["Microsoft Office", "Google Workspace", "Adobe Creative Cloud", "VS Code", "GitHub"] },
      { category: "Soft Skills", items: ["Problem Solving", "Attention to Detail", "Adaptability", "Continuous Learning", "Professional Ethics"] },
    ],
  },
  education: {
    heading: "Education",
    items: [
      { degree: "Bachelor of Business Administration (BBA)", institution: "National University", period: "2018 – 2022" },
    ],
  },
  certifications: {
    heading: "Training & Certifications",
    items: [
      { name: "Fundamentals of Digital Marketing", issuer: "Google Digital Garage", year: "2021" },
      { name: "SEO Fundamentals", issuer: "Semrush", year: "2022" },
    ],
  },
  tools: {
    heading: "Software & Tools",
    items: [
      { name: "Photoshop" }, { name: "Illustrator" }, { name: "WordPress" }, { name: "Microsoft Office" },
      { name: "Google Workspace" }, { name: "VS Code" }, { name: "GitHub" }, { name: "Canva" },
      { name: "Adobe Creative Cloud" }, { name: "Figma" }, { name: "Semrush" }, { name: "Google Analytics" },
      { name: "Google Search Console" }, { name: "Trello" }, { name: "Slack" },
    ],
  },
  values: {
    heading: "How I Work",
    subheading: "My professional values shape every project and client relationship.",
    items: [
      { title: "Continuous Learning", description: "I stay updated with the latest technologies, tools, and best practices to deliver the best results." },
      { title: "Attention to Detail", description: "Every pixel, every line of code, every word matters. I don't cut corners." },
      { title: "Client Communication", description: "Clear, honest, and proactive communication is at the heart of every successful project." },
      { title: "Problem Solving", description: "I see challenges as opportunities to find creative, effective solutions." },
      { title: "Reliable Delivery", description: "I take deadlines seriously and deliver what I promise, on time and within scope." },
      { title: "Professional Ethics", description: "Integrity, transparency, and respect guide every decision I make." },
      { title: "Team Collaboration", description: "Great results come from great teamwork. I value collaboration and shared success." },
      { title: "Adaptability", description: "Every project is unique. I adapt my approach to fit the specific needs and goals." },
    ],
  },
  cta: {
    heading: "Let's Build Something Great Together",
    subheading: "Have a project in mind? Let's talk about how I can help bring your vision to life.",
    buttonText: "Start Your Project",
    buttonLink: "/contact",
  },
  visibility: {
    hero: true,
    summary: true,
    focus: true,
    experience: true,
    skills: true,
    education: true,
    certifications: true,
    tools: true,
    values: true,
    cta: true,
  },
};

export function loadAboutData(): AboutData {
  try {
    const raw = localStorage.getItem(ABOUT_KEY);
    return raw ? { ...defaultAboutData, ...JSON.parse(raw) } : defaultAboutData;
  } catch {
    return defaultAboutData;
  }
}

export function saveAboutData(data: AboutData) {
  localStorage.setItem(ABOUT_KEY, JSON.stringify(data));
}
