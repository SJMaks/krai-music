export interface SocialLink {
  label: string
  url: string
}

export interface Video {
  title: string
  url: string
  thumbnail: string
}

export interface Artist {
  id: string
  nickname: string
  slug: string
  avatar: string
  biography: string
  socials: SocialLink[]
  videos: Video[]
  featuredImage: string
}

export interface Track {
  id: string
  title: string
  artist: string
  artistSlug: string
  cover: string
  audio: string
  releaseDate: string
  duration: string
}

export interface Event {
  id: string
  title: string
  image: string
  description: string
  date: string
  location: string
  externalLinks: SocialLink[]
}

export interface Service {
  id: string
  title: string
  image: string
  description: string
  ctaLabel: string
}

export interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
}

export interface ContactContent {
  email: string
  phone: string
  address: string
  socials: SocialLink[]
}

export interface RadioPlaylist {
  orderedTracks: string[]
  artistFilters: string[]
}
