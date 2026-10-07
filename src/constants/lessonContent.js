// Generates lesson titles + summaries for each module of any course.
// Lesson COUNT comes from courses.js (syllabus[].lessons).
// To write custom content for one course later, add it to CUSTOM_LESSONS.

const POOLS = {
  'Foundations & Setup': [
    ['Welcome & course overview', (t) => `An introduction to ${t}: what you will learn, how the path is structured, and how mentor checkpoints work.`],
    ['Tools and environment setup', (t) => `Set up every tool and account you need for ${t} so you can follow along with the hands-on sessions.`],
    ['Key terms and core ideas', (t) => `Learn the essential vocabulary and big-picture ideas behind ${t}, explained in simple language.`],
    ['How the industry uses it', (t) => `See where ${t} is used in real companies and which job roles rely on these skills.`],
    ['Your first guided exercise', (t) => `Complete a small, step-by-step exercise in ${t} to build confidence and get an early win.`],
    ['Workflow and best practices', (t) => `Understand the everyday workflow and habits that professionals follow when working in ${t}.`],
    ['Planning your learning schedule', (t) => `Build a realistic weekly plan for finishing ${t} and preparing for your mentor reviews.`],
    ['Foundations practice quiz', (t) => `Check your understanding of the ${t} basics with a short quiz and review the answers together.`],
    ['Foundations checkpoint review', (t) => `Review your progress with your mentor and fix any gaps before moving on in ${t}.`],
  ],
  'Core Concepts & Hands-on Practice': [
    ['Core concept deep dive', (t) => `A detailed walkthrough of the most important concepts in ${t} with worked examples.`],
    ['Guided practice session 1', (t) => `Hands-on practice applying the core ideas of ${t} with live guidance from your instructor.`],
    ['Common patterns and techniques', (t) => `Learn the standard techniques that solve most everyday problems in ${t}.`],
    ['Guided practice session 2', (t) => `A second practice session that increases difficulty and builds speed in ${t}.`],
    ['Avoiding common mistakes', (t) => `Spot the typical beginner mistakes in ${t} and learn how to debug and correct them.`],
    ['Mini challenge', (t) => `Solve a timed mini challenge in ${t} on your own, then compare solutions with the group.`],
    ['Concepts recap and Q&A', (t) => `Recap the main ideas of ${t} and get your questions answered in a live session.`],
    ['Core concepts checkpoint review', (t) => `Mentor review of your practice work in ${t}, with feedback and next-step advice.`],
  ],
  'Applied Projects': [
    ['Project brief and planning', (t) => `Understand the project goals for ${t}, break the work into steps, and plan your approach.`],
    ['Building the first milestone', (t) => `Start your ${t} project and complete the first working milestone.`],
    ['Adding key features', (t) => `Extend your ${t} project with the main features that make it useful and realistic.`],
    ['Working with real data and inputs', (t) => `Apply your ${t} skills to realistic data and scenarios instead of toy examples.`],
    ['Testing and improving quality', (t) => `Check your ${t} project for errors and improve its quality and reliability.`],
    ['Finishing and documenting', (t) => `Polish the project and write clear documentation so others can understand your ${t} work.`],
    ['Presenting your project', (t) => `Practice explaining your ${t} project clearly, as you would in an interview or client meeting.`],
    ['Project checkpoint review', (t) => `Get mentor feedback on your ${t} project and plan improvements.`],
  ],
  'Real-World Case Studies': [
    ['Case study introduction', (t) => `How to read and analyse a real business case in ${t}, and what to look for.`],
    ['Case study 1: a small business', (t) => `Walk through how a small business used ${t} to solve a practical problem.`],
    ['Case study 2: a growing company', (t) => `Study how a growing company applied ${t} at scale, including trade-offs they faced.`],
    ['Case study 3: a large organisation', (t) => `Explore how large organisations approach ${t}, with their processes and constraints.`],
    ['What went wrong: learning from failures', (t) => `Review real failures in ${t} projects and learn how to prevent the same issues.`],
    ['Applying lessons to your own work', (t) => `Take the ideas from the case studies and apply them to your own ${t} project.`],
    ['Group discussion', (t) => `Discuss the case studies with your cohort and share different approaches to ${t}.`],
    ['Case studies checkpoint review', (t) => `Mentor review of your case study analysis in ${t}.`],
  ],
  'Capstone Project & Career Prep': [
    ['Capstone brief and requirements', (t) => `Understand the requirements of your final ${t} capstone and how it will be assessed.`],
    ['Capstone build session 1', (t) => `Begin building your capstone, bringing together everything you learned in ${t}.`],
    ['Capstone build session 2', (t) => `Continue your capstone with mentor support and complete the main deliverables for ${t}.`],
    ['Final review and polish', (t) => `Refine your capstone so it is portfolio-ready and demonstrates your ${t} skills well.`],
    ['Building your portfolio and resume', (t) => `Add your ${t} work to your portfolio and update your resume to highlight it.`],
    ['Interview preparation', (t) => `Practice common interview questions for roles that use ${t}, with mock interviews.`],
    ['Capstone presentation', (t) => `Present your capstone to your mentor and cohort and receive final feedback on your ${t} work.`],
    ['Certification and next steps', (t) => `Complete your certification for ${t} and plan your next learning and career steps.`],
  ],
}

// Optional: override content for one specific course.
// Key = course id, value = { 'Module title': [{ title, summary }, ...] }
export const CUSTOM_LESSONS = {}

export function getModuleLessons({ courseId, courseTitle, moduleTitle, count }) {
  const custom = CUSTOM_LESSONS[courseId]?.[moduleTitle]
  if (custom) return custom

  const pool = POOLS[moduleTitle] || []
  const topic = courseTitle || 'this course'

  return Array.from({ length: Number(count) || 0 }, (_, i) => {
    const entry = pool[i]
    if (!entry) {
      return { title: `Lesson ${i + 1}`, summary: `Continue your learning in ${topic}.` }
    }
    return { title: entry[0], summary: entry[1](topic) }
  })
}
