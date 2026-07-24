import { resume } from "@/content/resume";

export function ResumeFallback() {
  return (
    <section id="resume" aria-label="Full résumé (text)" className="mx-auto max-w-2xl px-6 py-16 text-[#d4d4dc]">
      <h2 className="text-2xl font-semibold text-white">{resume.name}</h2>
      <p className="text-[#a0a0a8]">
        {resume.title} · {resume.location}
      </p>

      <h3 className="mt-8 text-lg font-semibold text-white">Summary</h3>
      {resume.summary.map((paragraph, index) => (
        <p key={index} className="mt-2">
          {paragraph}
        </p>
      ))}

      <h3 className="mt-8 text-lg font-semibold text-white">Skills</h3>
      <ul className="mt-2 space-y-1">
        {resume.skills.map((group) => (
          <li key={group.category}>
            <strong>{group.category}:</strong> {group.items.join(", ")}
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold text-white">Experience</h3>
      {resume.experience.map((job) => (
        <div key={job.company} className="mt-4">
          <p className="font-medium text-white">
            {job.role} — {job.company}
          </p>
          <p className="text-sm text-[#a0a0a8]">{job.period}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {job.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}

      <h3 className="mt-8 text-lg font-semibold text-white">Education</h3>
      <ul className="mt-2 space-y-1">
        {resume.education.map((entry) => (
          <li key={entry.degree}>
            {entry.degree}, {entry.school} ({entry.period})
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold text-white">Certifications</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {resume.certifications.map((cert) => (
          <li key={cert}>{cert}</li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold text-white">Languages</h3>
      <ul className="mt-2 space-y-1">
        {resume.languages.map((lang) => (
          <li key={lang.name}>
            {lang.name}: {lang.level}
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold text-white">Contact</h3>
      <p className="mt-2">
        <a href={`mailto:${resume.email}`} className="underline">
          {resume.email}
        </a>
        {" · "}
        <a href={resume.linkedinUrl} target="_blank" rel="noopener noreferrer" className="underline">
          LinkedIn
        </a>
        {" · "}
        <a href={resume.githubUrl} target="_blank" rel="noopener noreferrer" className="underline">
          GitHub
        </a>
      </p>
    </section>
  );
}
