import { redirect } from 'next/navigation'

// /exam with no slug redirects to the guides hub which lists all exams
export default function ExamIndexPage() {
  redirect('/guides')
}
