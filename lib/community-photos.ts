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
  /** CSS object-position focal point that keeps faces in frame when the photo is cropped with object-fit: cover. */
  objectPosition: string
}

/** Inline style for a cover-cropped community photo; pair with the `.community-photo` class. */
export const photoFocusStyle = (photo: Pick<CommunityPhoto, "objectPosition">) => ({ objectPosition: photo.objectPosition })

export const communityPhotos: readonly CommunityPhoto[] = [
  {
    "id": "outdoor-award",
    "objectPosition": "50% 35%",
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
    "objectPosition": "50% 72%",
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
    "objectPosition": "50% 72%",
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
    "objectPosition": "45% 40%",
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
    "objectPosition": "45% 62%",
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
    "objectPosition": "50% 40%",
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
    "objectPosition": "50% 55%",
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
    "objectPosition": "45% 40%",
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
    "objectPosition": "50% 52%",
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
    "objectPosition": "50% 58%",
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
export const heroPhotos: readonly Pick<CommunityPhoto, "id" | "src" | "width" | "height" | "alt" | "caption">[] = [
  heroPhoto,
  { id: "outdoor-bat-presentation", src: "/images/community/outdoor-bat-presentation.webp", width: 1200, height: 1600, alt: "Two adults holding a cricket bat together on an outdoor field.", caption: "A shared love of the game." },
  { id: "indoor-trophy-moment", src: "/images/community/indoor-trophy-moment.webp", width: 1200, height: 1594, alt: "Two cricketers holding a trophy with community members beside them indoors.", caption: "Celebrating together, on and off the field." },
  ...communityPhotos.filter(photo => photo.id !== heroPhoto.id),
  {"id":"friends-at-the-ground","src":"/images/community/friends-at-the-ground.webp","width":1024,"height":768,"alt":"Four cricket supporters posing together beside a cricket ground.","caption":"Friends sharing the cricket spirit."},
  {"id":"outdoor-trophy-gathering","src":"/images/community/outdoor-trophy-gathering.webp","width":1200,"height":900,"alt":"Three cricketers standing together with a trophy on an outdoor field.","caption":"Recognition shared on the field."},
  {"id":"indoor-blue-team","src":"/images/community/indoor-blue-team.webp","width":1200,"height":900,"alt":"Cricketers in blue shirts posing with trophies on an indoor sports court.","caption":"A team celebration together."},
  {"id":"indoor-teams-together","src":"/images/community/indoor-teams-together.webp","width":1200,"height":900,"alt":"Cricketers in blue and yellow shirts gathered with trophies indoors.","caption":"Many teams, a shared love of cricket."},
  {"id":"outdoor-team-and-trophies","src":"/images/community/outdoor-team-and-trophies.webp","width":1200,"height":675,"alt":"A cricket team posing with trophies on an outdoor field.","caption":"Team pride beyond the boundary."},
  {"id":"outdoor-team-lineup","src":"/images/community/outdoor-team-lineup.webp","width":1200,"height":675,"alt":"Cricketers standing together behind a row of trophies on grass.","caption":"Together for the game."},
  {"id":"outdoor-red-team","src":"/images/community/outdoor-red-team.webp","width":1200,"height":675,"alt":"Cricketers in red and blue shirts posing together on an outdoor field.","caption":"A shared team moment."},
  {"id":"outdoor-community-teams","src":"/images/community/outdoor-community-teams.webp","width":1200,"height":900,"alt":"Two groups of cricketers posing together on a field under a blue sky.","caption":"Cricket brings people together."},
]
export const aboutPhotoIds = ["family-celebration", "community-on-field"] as const
export const communityFeaturePhotoId = "community-on-field"
