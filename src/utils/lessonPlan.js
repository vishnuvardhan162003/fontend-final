// Generates a lesson list from a course's syllabus so the LMS player has
// something concrete to render without needing a full per-lesson dataset.
// Replace this with real lesson content coming from the backend once the
// content management system is in place — LessonSidebar/CoursePlayer only
// depend on the { id, title, type, moduleTitle } shape below.
export function buildLessonPlan(course) {
  const lessons = []
  let counter = 0

  course.syllabus.forEach((module, moduleIndex) => {
    for (let i = 0; i < module.lessons; i += 1) {
      counter += 1
      const isLastOfModule = i === module.lessons - 1
      const isLastModule = moduleIndex === course.syllabus.length - 1

      let type = 'video'
      if (isLastOfModule && isLastModule) type = 'assignment'
      else if (isLastOfModule) type = 'quiz'

      lessons.push({
        id: `lesson-${counter}`,
        moduleTitle: module.title,
        moduleIndex,
        title: `${module.title} — Part ${i + 1}`,
        type,
        durationMinutes: type === 'video' ? 8 + ((counter * 3) % 10) : null,
      })
    }
  })

  return lessons
}
