import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Camera } from "lucide-react"

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
        <p className="text-gray-600 mb-12">
          Relive the excitement of CICA tournaments and events through our photo collection. From thrilling matches to
          community celebrations, these images capture the spirit of cricket in Central Illinois.
        </p>

        <Card className="mb-8">
          <CardContent className="p-8">
            <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-4">Event Photos & Highlights</h2>
            <p className="text-gray-600 mb-6">
              Our complete photo collection is hosted on Google Drive, featuring high-quality images from tournaments,
              award ceremonies, and community events. Browse through albums organized by tournament and year.
            </p>
            <Button size="lg">
              <ExternalLink className="h-5 w-5 mr-2" />
              View Full Gallery on Google Drive
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Tournament Action</h3>
              <p className="text-gray-600 text-sm mb-4">
                Capture the intensity and skill of our competitive matches across all tournament formats.
              </p>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Award Ceremonies</h3>
              <p className="text-gray-600 text-sm mb-4">
                Celebrating our champions and recognizing outstanding performances and sportsmanship.
              </p>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Community Events</h3>
              <p className="text-gray-600 text-sm mb-4">
                Special events, player orientations, and community gatherings that bring us together.
              </p>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Behind the Scenes</h3>
              <p className="text-gray-600 text-sm mb-4">
                Glimpses of tournament preparation, volunteer efforts, and the dedication that makes CICA special.
              </p>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
