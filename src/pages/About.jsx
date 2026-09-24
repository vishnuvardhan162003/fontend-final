import SectionHeading from '../components/common/SectionHeading'
import { Target, Handshake, Sparkles } from 'lucide-react'

const VALUES = [
  {
    icon: Target,
    title: 'Outcome-scoped, not topic-scoped',
    description:
      'Every course is built backward from one thing you should be able to do by the end — not a syllabus of loosely related topics.',
  },
  {
    icon: Handshake,
    title: 'Learn with support',
    description:
      'Get guidance, feedback, and practical support throughout your learning journey.',
  },
  {
    icon: Sparkles,
    title: 'Practical and career-focused',
    description:
      'Learn relevant skills through practical projects and real-world applications.',
  },
]

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="About Eduzyra"
                title="Learn skills that help you move forward"
                description="Eduzyra is a practical learning platform designed to help students and professionals build useful skills through focused courses and hands-on learning."
              />

              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
                We believe learning should be simple, practical, and connected
                to real-world outcomes. Our courses are designed to help learners
                understand concepts, practice them, and build confidence.
              </p>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1758270705290-62b6294dd044?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Students collaborating on a laptop while learning"
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Values"
            title="What makes Eduzyra different"
            description="Everything we build is focused on creating a better learning experience."
          />

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
            {VALUES.map((value) => {
              const Icon = value.icon

              return (
                <div
                  key={value.title}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {value.title}
                  </h3>

                  <p className="leading-7 text-gray-600">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gray-50 p-8 text-center md:p-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Mission
            </h2>

            <p className="text-lg leading-8 text-gray-600">
              Our mission is to make quality, practical learning accessible to
              everyone and help learners turn knowledge into real skills.
            </p>
          </div>
        </div>
      </section>

      {/* Althexus Section */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container-page text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Eduzyra by Althexus
          </h2>

          <p className="mx-auto mb-6 max-w-2xl leading-7 text-gray-300">
            Eduzyra is developed by Althexus with a focus on practical
            technology education and better learning experiences.
          </p>

          <a
            href="https://althexus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-200"
          >
            Visit Althexus
          </a>
        </div>
      </section>
    </div>
  )
}

export default About