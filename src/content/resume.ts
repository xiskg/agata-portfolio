export type SkillGroup = {
  category: string;
  items: string[];
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
};

export type LanguageEntry = {
  name: string;
  level: string;
};

export type ResumeData = {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  summary: string[];
  summaryShort: string[];
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: string[];
  languages: LanguageEntry[];
};

export const resume: ResumeData = {
  name: "Agata Domingues",
  title: "Backend Software Engineer",
  location: "Brazil",
  email: "agatadominguestech@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/agatadominguesfarias/",
  githubUrl: "https://github.com/htadmg",
  summary: [
    "Backend Software Engineer with 3+ years of experience designing and maintaining scalable, high-availability systems for large-scale marketplace and B2B platforms.",
    "Currently building distributed services in Go and Java at Mercado Libre, Latin America's largest e-commerce and fintech company, integrating REST APIs, message-queue pipelines, and cloud data warehousing to support high-volume B2B operations.",
    "Embeds AI (Claude) across the full development lifecycle, from design and specs to implementation, code review, and CI/CD, to ship faster without compromising quality.",
    "Skilled in microservices architecture, API and SDK design, and relational database optimization, with a proven ability to improve system performance and reliability.",
  ],
  summaryShort: [
    "Backend Software Engineer, 3+ years building scalable, high-availability systems for marketplace and B2B platforms.",
    "Currently at Mercado Libre — Go, Java, distributed systems, and AI-assisted engineering end to end.",
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["Go (Golang)", "Java", "C# / .NET", "Python", "JavaScript", "SQL"],
    },
    {
      category: "Backend & Architecture",
      items: [
        "Microservices",
        "Distributed Systems",
        "RESTful API Design & Integration",
        "SDK Development",
        "Event-Driven Architecture & Message Queues",
        "Authentication & Authorization",
      ],
    },
    {
      category: "AI-Assisted Engineering",
      items: [
        "LLM-integrated development workflows (Claude)",
        "AI-augmented code review & CI/CD",
        "AI-assisted technical writing (RFCs, PRDs, implementation specs)",
      ],
    },
    {
      category: "Cloud & Data",
      items: ["Google BigQuery", "Fury (internal PaaS)", "CI/CD Pipelines", "Docker", "Observability & Monitoring"],
    },
    {
      category: "Databases",
      items: ["MySQL", "SQL Server", "PostgreSQL"],
    },
    {
      category: "Practices & Collaboration",
      items: [
        "Agile / Scrum",
        "Git & GitHub",
        "Code Review",
        "Unit & Integration Testing",
        "Cross-Functional Collaboration",
      ],
    },
  ],
  experience: [
    {
      company: "Mercado Libre",
      role: "Backend Software Developer",
      period: "11/2024 – Present",
      bullets: [
        "Develop and maintain B2B backend services in Go and Java, supporting high-throughput operations across one of Latin America's largest technology ecosystems.",
        "Design and integrate RESTful APIs and SDKs consumed by internal teams and external partners, standardizing contracts and improving developer experience.",
        "Build event-driven data pipelines using message queues and Google BigQuery to process and analyze large-scale transactional data.",
        "Integrate AI (Claude) across the full software development lifecycle, from drafting RFCs, PRDs, and implementation specs to daily development, automated code review, and CI/CD pipelines.",
        "Deploy and operate services on Fury, Mercado Libre's internal microservices platform, ensuring scalability, observability, and reliability.",
        "Optimize MySQL queries and data-access layers, reducing average endpoint response times by ~25%.",
        "Work within an Agile squad, contributing to code reviews, sprint planning, and continuous delivery.",
      ],
    },
    {
      company: "Conecta Marketplaces",
      role: "Systems Analyst & Backend Developer",
      period: "05/2024 – 10/2024",
      bullets: [
        "Built a robust integration with the Mercado Libre API using Python and Flask, covering billing management, order search and tracking, and listing price consultation/updates.",
        "Implemented a secure user login and authentication system, strengthening platform security and usability.",
        "Automated listing maintenance and pricing workflows, contributing to a 10% increase in clients' daily revenue.",
      ],
    },
    {
      company: "Techmillen Consultoria e Projetos",
      role: "Systems Analyst & Developer",
      period: "06/2023 – 05/2024",
      bullets: [
        "Developed a full management application for beauty salons using C# and .NET, with a responsive Bootstrap interface and enhanced interactivity via jQuery.",
        "Delivered features for appointment scheduling, client and employee management, and service catalogs, streamlining day-to-day business operations.",
        "Reduced data-processing time by 15% through improved database management and optimized SQL queries.",
      ],
    },
  ],
  education: [
    {
      degree: "Postgraduate Specialization in Computer Engineering",
      school: "UNINTER",
      period: "04/2026 – 12/2026",
    },
    {
      degree: "Associate Degree (CST) in Systems Analysis and Development",
      school: "UNINTER",
      period: "03/2023 – 10/2025",
    },
  ],
  certifications: [
    "Mercado Libre API Integration",
    "C#: Object-Oriented Programming, MVC Development, Windows Forms",
    "Microsoft SQL Server 2022: SQL Fundamentals & CRUD Operations",
    "HTML & CSS: Web Accessibility, Mobile First, Development Environments",
    "Git & GitHub: Repositories, Commits & Version Control",
  ],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Professional Working Proficiency" },
    { name: "Spanish", level: "Intermediate" },
  ],
};
