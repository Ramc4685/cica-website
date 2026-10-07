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

// Form validation schema using Zod
const formSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s\-']+$/, { message: "First name can only contain letters, spaces, hyphens, and apostrophes" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .regex(/^[a-zA-Z\s\-']+$/, { message: "Last name can only contain letters, spaces, hyphens, and apostrophes" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[0-9\s\-\(\)]+$/.test(val),
      { message: "Phone number can only contain numbers, spaces, and these symbols: + - ( )" }
    ),
  subject: z
    .string()
    .min(1, { message: "Subject is required" })
    .max(100, { message: "Subject must be less than 100 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

// Define the form data type
type FormValues = z.infer<typeof formSchema>;

// Form submission handler URL (Google Apps Script Web App URL)
const FORM_SUBMISSION_URL = "https://script.google.com/macros/s/AKfycbwZ3MauXuEadegmbESfcl4ZOZzMohBOzXPEv1HwGfTHeE51ADV5cxAl5u0x1gqzjI3d/exec"

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
    try {
      setSubmissionError(null)

      // Send form data to Google Apps Script
      const response = await fetch(FORM_SUBMISSION_URL, {
        method: "POST",
        headers: {
          // Apps Script does not serve CORS preflight; send JSON as a simple request.
          "Content-Type": "text/plain;charset=UTF-8",
        },
        body: JSON.stringify(data),
        // Timeout after 8 seconds
        signal: AbortSignal.timeout(8000)
      })

      const result = await response.json()

      if (result.success) {
        setSubmitSuccess(true)
        reset()
        toast.success("Your message has been sent successfully! We'll be in touch soon.")

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      } else {
        setSubmissionError(result.message || "Something went wrong with your submission. Please try again.")
        toast.error(result.message || "Something went wrong with your submission. Please try again.")
      }
    } catch (error: any) {
      console.error("Form submission error:", error)

      // Handle timeout separately
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        setSubmissionError("Request timed out. Please check your internet connection and try again.")
        toast.error("Request timed out. Please check your internet connection and try again.")
      } else {
        setSubmissionError("Failed to send message. Please try again later.")
        toast.error("Failed to send message. Please try again later.")
      }
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
