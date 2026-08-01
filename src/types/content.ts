export interface SocialLink {
  label: string
  url: string
}

export interface Video {
  title: string
  description: string
  url: string
  cover: string
}

export interface ArtistFeaturedTrack {
  trackId: string
  title: string
  description: string
  releaseDate: string
  releaseType: string
  cover: string
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
  featuredTrack?: ArtistFeaturedTrack | null
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
  featuredArtistIds: string[]
  featuredTrackIds: string[]
  featuredEventIds: string[]
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
