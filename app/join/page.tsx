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
import { nameField, emailField, phoneField, submitForm, UNCERTAIN_SUBMISSION } from "@/lib/form-submission"

// Limits mirror public/forms/submit.php so the server accepts anything the form allows.
const formSchema = z.object({
  website: z.string().max(200),
  name: nameField("Name"),
  email: emailField,
  phone: phoneField.refine((val) => val.trim() !== "", "Phone number is required"),
});

// Define the form data type
type FormValues = z.infer<typeof formSchema>;

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
      website: "",
      name: "",
      email: "",
      phone: "",
    },
  })

  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setSubmissionError(null)
    try {
      await submitForm("updates", data)
      setSubmitSuccess(true)
      reset()
      toast.success("Thank you for joining! You'll receive updates from CICA.")

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
                {/* Honeypot: people never see this field; submit.php rejects requests that fill it. */}
                <div hidden aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
                </div>
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
