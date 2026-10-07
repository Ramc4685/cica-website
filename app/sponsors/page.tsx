"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ExternalLink, Mail, Phone, Building, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Zod schema for sponsor form validation
const sponsorFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  company: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  interest: z.string().min(1, "Sponsorship interest is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SponsorFormValues = z.infer<typeof sponsorFormSchema>;

// TODO:// Google Apps Script URL for form submission
const FORM_SUBMISSION_URL = "https://script.google.com/macros/s/AKfycbzzQZ0zYjbjJRppNKz7YOmeGpSAEGvhv3jCXaOhDo5xGJg5gdPxcZLZcxrosa5rCkqw5w/exec";

export default function SponsorsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema),
  });

  const onSubmit = async (data: SponsorFormValues) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch(FORM_SUBMISSION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Your sponsorship inquiry has been sent!");
        setSubmitSuccess(true);
        reset();
      } else {
        toast.error(result.message || "An error occurred.");
      }
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Our Sponsors</h1>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          CICA is proud to partner with organizations that share our commitment to community building and sports
          excellence. Our sponsors make it possible to organize world-class tournaments and events.
        </p>

        {/* Current Sponsors */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Current Sponsors</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gray-400">1 GPT</span>
                </div>
                <CardTitle>1 GPT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Technology partner supporting CICA's digital initiatives and tournament management systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sponsorship Information */}
        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Sponsorship Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Partner with CICA to reach the vibrant cricket community in Central Illinois. We offer various
                sponsorship packages designed to meet different business objectives and budgets.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Tournament title sponsorship</li>
                <li>• Equipment and facility sponsorship</li>
                <li>• Event and hospitality partnerships</li>
                <li>• Digital marketing opportunities</li>
                <li>• Community outreach programs</li>
              </ul>
              <Button className="w-full" asChild>
                <Link
                  href="https://docs.google.com/document/d/19m8Gz7XEAijgaEqPyCXCuTGI3-bzrkILvrxwn9RP67s/preview"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Sponsorship Packages
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Sponsor CICA?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Community Impact</h4>
                    <p className="text-sm text-gray-600">Connect with a diverse, engaged community</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Brand Visibility</h4>
                    <p className="text-sm text-gray-600">Prominent exposure across all our events</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Networking</h4>
                    <p className="text-sm text-gray-600">Build relationships with local businesses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Become a Sponsor</CardTitle>
          </CardHeader>
          <CardContent>
                        {submitSuccess ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-green-50 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold">Thank You!</h3>
                <p className="text-gray-600">Your sponsorship inquiry has been received. We will get back to you shortly.</p>
              </div>
            ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Your full name" {...register("fullName")} />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company name" {...register("company")} />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" {...register("email")} />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" placeholder="(555) 123-4567" {...register("phone")} />
                </div>
              </div>
                            <div>
                <Label htmlFor="interest">Sponsorship Interest</Label>
                <Input id="interest" placeholder="e.g., Tournament sponsorship, Equipment partnership" {...register("interest")} />
                {errors.interest && <p className="text-red-500 text-sm mt-1">{errors.interest.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                                <Textarea
                  id="message"
                  placeholder="Tell us about your sponsorship goals and how you'd like to partner with CICA"
                  rows={4}
                  {...register("message")}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  "Submit Sponsorship Inquiry"
                )}
              </Button>
            </form>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
