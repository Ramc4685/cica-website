export interface CommunityPhoto {
  id: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
  gallerySrc: string
  galleryWidth: number
  galleryHeight: number
}

export const communityPhotos: readonly CommunityPhoto[] = [
  {
    "id": "outdoor-award",
    "src": "/images/community/outdoor-award.webp",
    "width": 1200,
    "height": 1600,
    "alt": "Two cricketers holding a trophy together on an outdoor cricket field.",
    "caption": "A moment of recognition on the field.",
    "gallerySrc": "/images/community/outdoor-award-gallery.webp",
    "galleryWidth": 480,
    "galleryHeight": 640
  },
  {
    "id": "outdoor-teams",
    "src": "/images/community/outdoor-teams.webp",
    "width": 1024,
    "height": 768,
    "alt": "Cricket teams standing together on an outdoor field beneath a blue sky.",
    "caption": "Teams together on the outdoor field.",
    "gallerySrc": "/images/community/outdoor-teams-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 480
  },
  {
    "id": "indoor-community",
    "src": "/images/community/indoor-community.webp",
    "width": 1200,
    "height": 904,
    "alt": "A large group gathered around a trophy table inside an indoor cricket facility.",
    "caption": "A community gathering around the trophy table.",
    "gallerySrc": "/images/community/indoor-community-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 482
  },
  {
    "id": "family-celebration",
    "src": "/images/community/family-celebration.webp",
    "width": 1200,
    "height": 904,
    "alt": "Adults and children gathered beside a table of cricket trophies indoors.",
    "caption": "Sharing a celebration together.",
    "gallerySrc": "/images/community/family-celebration-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 482
  },
  {
    "id": "team-gathering",
    "src": "/images/community/team-gathering.webp",
    "width": 1200,
    "height": 675,
    "alt": "Cricketers posing together on grass with trees behind them.",
    "caption": "Together beyond the boundary.",
    "gallerySrc": "/images/community/team-gathering-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 360
  },
  {
    "id": "indoor-team-celebration",
    "src": "/images/community/indoor-team-celebration.webp",
    "width": 1200,
    "height": 900,
    "alt": "Cricketers in yellow shirts posing with trophies inside a sports facility.",
    "caption": "A team celebration indoors.",
    "gallerySrc": "/images/community/indoor-team-celebration-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 480
  },
  {
    "id": "community-on-field",
    "src": "/images/community/community-on-field.webp",
    "width": 1200,
    "height": 507,
    "alt": "A large group of players and community members gathered on an outdoor cricket field.",
    "caption": "The community together on the field.",
    "gallerySrc": "/images/community/community-on-field-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 270
  },
  {
    "id": "trophy-presentation",
    "src": "/images/community/trophy-presentation.webp",
    "width": 1200,
    "height": 675,
    "alt": "Three adults standing behind a table of trophies at an indoor cricket facility.",
    "caption": "Trophies and familiar faces.",
    "gallerySrc": "/images/community/trophy-presentation-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 360
  },
  {
    "id": "indoor-team-portrait",
    "src": "/images/community/indoor-team-portrait.webp",
    "width": 1200,
    "height": 675,
    "alt": "A cricket team posing with trophies on an indoor playing surface.",
    "caption": "A team moment to remember.",
    "gallerySrc": "/images/community/indoor-team-portrait-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 360
  },
  {
    "id": "indoor-team-gathering",
    "src": "/images/community/indoor-team-gathering.webp",
    "width": 1200,
    "height": 675,
    "alt": "A group of cricketers gathered with trophies on an indoor field.",
    "caption": "Sharing the game and its celebrations.",
    "gallerySrc": "/images/community/indoor-team-gathering-gallery.webp",
    "galleryWidth": 640,
    "galleryHeight": 360
  }
]

export const heroPhoto = communityPhotos.find(photo => photo.id === "outdoor-award")!
export const aboutPhotoIds = ["family-celebration", "community-on-field"] as const
export const communityFeaturePhotoId = "community-on-field"
