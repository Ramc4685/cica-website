"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Settings, FileText, Users, Trophy, ImageIcon, Lock, InfoIcon, Key } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in production, use proper authentication
    if (password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid password")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <Lock className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <CardTitle className="text-2xl">CICA Admin Portal</CardTitle>
              <p className="text-gray-600">Secure access for content management</p>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Admin Access Instructions</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <p>
                    <strong>Default Password:</strong> <code className="bg-gray-100 px-1 rounded">admin123</code>
                  </p>
                  <p className="text-sm text-amber-600">
                    For security, contact the technical team to set up personal credentials.
                  </p>
                </AlertDescription>
              </Alert>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Admin Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Access Admin Panel
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-700">
                  Contact technical support at <strong>tech@cicainfo.com</strong> for assistance with admin access or
                  content management.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold">CICA Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Authenticated
              </Badge>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="testimonials">Reviews</TabsTrigger>
              <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      News & Announcements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="newsTitle">News Title</Label>
                      <Input id="newsTitle" placeholder="Enter news title" />
                    </div>
                    <div>
                      <Label htmlFor="newsContent">Content</Label>
                      <Textarea id="newsContent" rows={4} placeholder="Enter news content" />
                    </div>
                    <div>
                      <Label htmlFor="newsCategory">Category</Label>
                      <Input id="newsCategory" placeholder="Tournament, Announcement, Community" />
                    </div>
                    <Button className="w-full">Publish News</Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Social Media & Community Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp Group Link</Label>
                      <Input id="whatsapp" placeholder="https://chat.whatsapp.com/..." />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook Page</Label>
                      <Input id="facebook" placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                      <Label htmlFor="youtube">YouTube Channel</Label>
                      <Input id="youtube" placeholder="https://youtube.com/..." />
                    </div>
                    <Button className="w-full">Update Links</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="news">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    News & Updates Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>News Management</AlertTitle>
                    <AlertDescription>
                      Add, edit, or remove news articles and announcements that appear on the homepage.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="newsTitle">News Title</Label>
                      <Input id="newsTitle" placeholder="Enter news title" />
                    </div>
                    <div>
                      <Label htmlFor="newsCategory">Category</Label>
                      <Input id="newsCategory" placeholder="Tournament, Announcement, Community" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newsExcerpt">Excerpt</Label>
                    <Textarea id="newsExcerpt" rows={2} placeholder="Brief summary for homepage display" />
                  </div>
                  <div>
                    <Label htmlFor="newsContent">Full Content</Label>
                    <Textarea id="newsContent" rows={4} placeholder="Complete news article content" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="newsImage">Featured Image</Label>
                      <Input id="newsImage" type="file" accept="image/*" />
                    </div>
                    <div>
                      <Label htmlFor="newsAuthor">Author</Label>
                      <Input id="newsAuthor" placeholder="Author name" />
                    </div>
                  </div>
                  <Button className="w-full">Add/Update News Article</Button>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Current News Articles</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">CICA Indoor Championship Finals...</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">2025 Tournament Schedule Released...</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Testimonials Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Testimonials Management</AlertTitle>
                    <AlertDescription>
                      Manage community testimonials and reviews that appear on the homepage.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="testimonialName">Full Name</Label>
                      <Input id="testimonialName" placeholder="Person's name" />
                    </div>
                    <div>
                      <Label htmlFor="testimonialRole">Role/Title</Label>
                      <Input id="testimonialRole" placeholder="Team Captain, Parent, etc." />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="testimonialContent">Testimonial Content</Label>
                    <Textarea id="testimonialContent" rows={4} placeholder="What they said about CICA..." />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="testimonialRating">Rating (1-5)</Label>
                      <Input id="testimonialRating" type="number" min="1" max="5" placeholder="5" />
                    </div>
                    <div>
                      <Label htmlFor="testimonialImage">Photo</Label>
                      <Input id="testimonialImage" type="file" accept="image/*" />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input type="checkbox" id="featured" className="rounded" />
                      <Label htmlFor="featured" className="text-sm">
                        Featured on homepage
                      </Label>
                    </div>
                  </div>
                  <Button className="w-full">Add/Update Testimonial</Button>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Current Testimonials</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Rajesh Kumar - Team Captain</span>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Featured
                          </Badge>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Sarah Johnson - Parent</span>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Featured
                          </Badge>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tournaments">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Tournament Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="tournamentName">Tournament Name</Label>
                      <Input id="tournamentName" placeholder="e.g., CICA Mains 2025" />
                    </div>
                    <div>
                      <Label htmlFor="tournamentType">Type</Label>
                      <Input id="tournamentType" placeholder="Indoor/Outdoor" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tournamentDesc">Description</Label>
                    <Textarea id="tournamentDesc" rows={3} placeholder="Tournament description" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Input id="status" placeholder="Active/Registration Open/Planning" />
                    </div>
                    <div>
                      <Label htmlFor="teams">Number of Teams</Label>
                      <Input id="teams" type="number" placeholder="8" />
                    </div>
                  </div>
                  <Button className="w-full">Save Tournament</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="board">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Board Member Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="memberName">Full Name</Label>
                      <Input id="memberName" placeholder="Board member name" />
                    </div>
                    <div>
                      <Label htmlFor="memberRole">Role</Label>
                      <Input id="memberRole" placeholder="Director, Volunteer, etc." />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="memberBio">Biography</Label>
                    <Textarea id="memberBio" rows={4} placeholder="Member biography and experience" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="memberExperience">Years with CICA</Label>
                      <Input id="memberExperience" placeholder="e.g., Helping CICA from 2018" />
                    </div>
                    <div>
                      <Label htmlFor="memberPhoto">Photo Upload</Label>
                      <Input id="memberPhoto" type="file" accept="image/*" />
                    </div>
                  </div>
                  <Button className="w-full">Add/Update Board Member</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sponsors">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Sponsor Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="sponsorName">Sponsor Name</Label>
                      <Input id="sponsorName" placeholder="Company name" />
                    </div>
                    <div>
                      <Label htmlFor="sponsorLevel">Sponsorship Level</Label>
                      <Input id="sponsorLevel" placeholder="Gold, Silver, Bronze, etc." />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sponsorDesc">Description</Label>
                    <Textarea id="sponsorDesc" rows={3} placeholder="Sponsor description" />
                  </div>
                  <div>
                    <Label htmlFor="sponsorLogo">Logo Upload</Label>
                    <Input id="sponsorLogo" type="file" accept="image/*" />
                  </div>
                  <Button className="w-full">Add/Update Sponsor</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Media Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="galleryLink">Google Drive Gallery Link</Label>
                    <Input id="galleryLink" placeholder="https://drive.google.com/..." />
                  </div>
                  <div>
                    <Label htmlFor="rulesLink">Rules Documentation Link</Label>
                    <Input
                      id="rulesLink"
                      defaultValue="https://drive.google.com/drive/u/1/folders/16mFxdlNfcbK8_1_z5CNhLpFD5WPh4Asy"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="bylawsUpload">Bylaws Document Link</Label>
                    <Input
                      id="bylawsUpload"
                      defaultValue="https://docs.google.com/document/d/1v6EnSnmrLFJKiB6InjcRulaQI3VA_eFTQvDvKLPTXsg/edit?tab=t.0"
                      placeholder="Google Docs link"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsorPackages">Sponsor Packages Link</Label>
                    <Input
                      id="sponsorPackages"
                      defaultValue="https://docs.google.com/document/d/19m8Gz7XEAijgaEqPyCXCuTGI3-bzrkILvrxwn9RP67s/edit?tab=t.0"
                      placeholder="Google Docs link"
                    />
                  </div>
                  <Button className="w-full">Update Media Links</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
