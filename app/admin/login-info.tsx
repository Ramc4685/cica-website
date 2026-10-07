import Link from "next/link"
import { LockKeyhole } from "lucide-react"

export default function AdminUnavailable() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <LockKeyhole aria-hidden="true" className="mx-auto mb-4 h-10 w-10 text-blue-600" />
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Administration is unavailable</h1>
        <p className="text-gray-600">
          Online administration is currently unavailable. To request a website update, please contact the CICA organizers.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:organizers@cicainfo.com"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Email organizers
          </a>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Return to website
          </Link>
        </div>
      </div>
    </section>
  )
}
