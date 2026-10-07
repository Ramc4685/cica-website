"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageCircle, MapPin, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { nameField, emailField, phoneField, messageField, submitForm, UNCERTAIN_SUBMISSION } from "@/lib/form-submission"

// Limits mirror public/forms/submit.php so the server accepts anything the form allows.
const formSchema = z.object({
  website: z.string().max(200),
  firstName: nameField("First name", 50),
  lastName: nameField("Last name", 50),
  email: emailField,
  phone: phoneField,
  subject: nameField("Subject", 200),
  message: messageField,
});

// Define the form data type
type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setSubmissionError(null)
    try {
      await submitForm("contact", data)
      setSubmitSuccess(true)
      reset()
      toast.success("Your message has been sent successfully! We'll be in touch soon.")

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch {
      setSubmissionError(UNCERTAIN_SUBMISSION)
      toast.error(UNCERTAIN_SUBMISSION)
    }
  }
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Get in touch with CICA for tournament information, sponsorship opportunities, or general inquiries. We're here
          to help you become part of our cricket community.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Honeypot: people never see this field; submit.php rejects requests that fill it. */}
                <div hidden aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName" className="flex items-center justify-between">
                      First Name
                      {errors.firstName && (
                        <span className="text-red-500 text-xs">{errors.firstName.message}</span>
                      )}
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="flex items-center justify-between">
                      Last Name
                      {errors.lastName && (
                        <span className="text-red-500 text-xs">{errors.lastName.message}</span>
                      )}
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center justify-between">
                    Email
                    {errors.email && (
                      <span className="text-red-500 text-xs">{errors.email.message}</span>
                    )}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center justify-between">
                    Phone (Optional)
                    {errors.phone && (
                      <span className="text-red-500 text-xs">{errors.phone.message}</span>
                    )}
                  </Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="flex items-center justify-between">
                    Subject
                    {errors.subject && (
                      <span className="text-red-500 text-xs">{errors.subject.message}</span>
                    )}
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Tournament inquiry, sponsorship, etc."
                    {...register("subject")}
                    className={errors.subject ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="flex items-center justify-between">
                    Message
                    {errors.message && (
                      <span className="text-red-500 text-xs">{errors.message.message}</span>
                    )}
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    {...register("message")}
                    className={errors.message ? "border-red-500" : ""}
                  />
                </div>

                {submitSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <p className="text-green-700 text-sm">Your message has been sent successfully! We'll be in touch soon.</p>
                  </div>
                ) : submissionError ? (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                      <div className="h-5 w-5 text-red-500 mr-2 flex-shrink-0">⚠️</div>
                      <p className="text-red-700 text-sm">{submissionError}</p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Try Again"
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">General Inquiries</p>
                  <a className="text-blue-600 break-all hover:underline" href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a>
                </div>
                <div>
                  <p className="font-medium">Tournament Registration</p>
                  <a className="text-blue-600 break-all hover:underline" href="mailto:organizers@cicainfo.com?subject=Tournament%20registration">organizers@cicainfo.com</a>
                </div>
                <div>
                  <p className="font-medium">Sponsorship Opportunities</p>
                  <a className="text-blue-600 break-all hover:underline" href="mailto:organizers@cicainfo.com?subject=Sponsorship%20inquiry">organizers@cicainfo.com</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Stay Connected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Stay connected with CICA through our mailing list and WhatsApp group for real-time updates on
                  tournaments, events, and community announcements.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/join">
                      <Mail className="h-4 w-4 mr-2" />
                      Join CICA Updates
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <a href="https://chat.whatsapp.com/Ij7GEOEkGJK9DCY2LDPFj8" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp Group
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>Serving:</strong>
                  <br />
                  Bloomington/Normal, Illinois
                  <br />
                  and surrounding Central Illinois communities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start"><a href="https://cricclubs.com/CICA" target="_blank" rel="noopener noreferrer">Live Scores on CricClubs</a></Button>
                <Button asChild variant="outline" className="w-full justify-start"><a href="mailto:organizers@cicainfo.com?subject=Tournament%20registration">Tournament Registration</a></Button>
                <Button asChild variant="outline" className="w-full justify-start"><Link href="/rules">Rules & Documentation</Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
