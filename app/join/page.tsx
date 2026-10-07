"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, BellRing } from "lucide-react"
import { toast } from "sonner"

// Form validation schema using Zod
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s\-']+$/, { 
      message: "Name can only contain letters, spaces, hyphens, and apostrophes" 
    }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(
      (val) => /^\+?[0-9\s\-\(\)]+$/.test(val), 
      { message: "Phone number can only contain numbers, spaces, and these symbols: + - ( )" }
    ),
});

// Define the form data type
type FormValues = z.infer<typeof formSchema>;

// Form submission handler URL (Google Apps Script Web App URL)
const FORM_SUBMISSION_URL = "https://script.google.com/macros/s/AKfycbxQb0XmO55sW7bJQYz1FKcoewJ-Udh-vCcneMeXs_McXY9QhrigyzMwYbpNJkOCYIJ8/exec"

export default function JoinPage() {
  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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
        toast.success("Thank you for joining! You'll receive updates from CICA.")
        
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
        setSubmissionError("An unexpected error occurred. Please try again later.")
        toast.error("An unexpected error occurred. Please try again later.")
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Join CICA For Updates</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed about upcoming tournaments, cricket news, and community events by joining our mailing list.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                Subscribe for Updates
              </CardTitle>
              <CardDescription>
                Receive news, tournament announcements, and community information directly to your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {submitSuccess ? (
                  <div className="rounded-lg bg-green-50 p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800">Thank you for subscribing!</h3>
                    <p className="mt-2 text-green-700">
                      You're now on our updates list. We'll keep you informed about CICA events and news.
                    </p>
                    <Button
                      type="button"
                      className="mt-4"
                      variant="outline"
                      onClick={() => {
                        setSubmitSuccess(false)
                        reset()
                      }}
                    >
                      Subscribe another
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        {...register("name")}
                        className={errors.name ? "border-red-300" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        {...register("email")}
                        className={errors.email ? "border-red-300" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="(123) 456-7890"
                        {...register("phone")}
                        className={errors.phone ? "border-red-300" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                      )}
                    </div>

                    {submissionError && (
                      <div className="bg-red-50 p-4 rounded-md">
                        <p className="text-red-800">{submissionError}</p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Subscribe Now"
                      )}
                    </Button>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
