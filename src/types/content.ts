export type SocialNetwork =
  | 'vk'
  | 'telegram'
  | 'instagram'
  | 'x'
  | 'facebook'
  | 'custom'

export interface SocialLink {
  label: string
  url: string
  type?: SocialNetwork
}

export interface Video {
  title: string
  description: string
  url: string
  cover: string
}

export interface Artist {
  id: string
  nickname: string
  biography: string
  verticalImage: string
  squareImage: string
  socials: SocialLink[]
  videos: Video[]
  featuredTrack?: Track | null
}

export interface Track {
  id: string
  title: string
  authors: Artist[]
  cover: string
  audio: string
  releaseDate: string
  releaseType: string
  description: string
}

export interface Event {
  id: string
  title: string
  description: string
  image: string
  date: string
  location: string
  links: SocialLink[]
}

export interface Service {
  id: string
  title: string
  description: string
  image: string
}

export interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  featuredArtists: Artist[]
  featuredTracks: Track[]
  featuredEvents: Event[]
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
