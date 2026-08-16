import type { Album, Artist, Event, HomepageContent, RadioContent, Service, Track, ContactContent } from '../types/content'
import homepageJson from '../../content/homepage.json'
import contactsJson from '../../content/contacts.json'
import radioJson from '../../content/radio.json'

const artistModules = import.meta.glob('../../content/artists/*.json', { eager: true, import: 'default' })
const trackModules = import.meta.glob('../../content/tracks/*.json', { eager: true, import: 'default' })
const albumModules = import.meta.glob('../../content/albums/*.json', { eager: true, import: 'default' })
const eventModules = import.meta.glob('../../content/events/*.json', { eager: true, import: 'default' })
const serviceModules = import.meta.glob('../../content/services/*.json', { eager: true, import: 'default' })

/**
 * Raw shape of content/homepage.json as authored in the CMS:
 * featured* fields hold string ids that are resolved to entities below.
 */
interface HomepageJson {
  heroTitle?: string
  heroSubtitle?: string
  featuredArtists?: string[]
  featuredAlbums?: string[]
  featuredTracks?: string[]
  featuredEvents?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawArtists = Object.values(artistModules) as any[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawTracks = Object.values(trackModules) as any[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawAlbums = Object.values(albumModules) as any[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawEvents = Object.values(eventModules) as any[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawServices = Object.values(serviceModules) as any[]

const artistsMap = new Map<string, Omit<Artist, 'featuredTrack'>>()
const tracksMap = new Map<string, Track>()

rawArtists.forEach(artist => {
  artistsMap.set(artist.id, {
    ...artist,
    featuredTrack: null,
  })
})

rawTracks.forEach(track => {
  const authors = (track.authors || []).map((id: string) => {
    const artist = artistsMap.get(id)
    if (!artist) {
      throw new Error(`Artist with id "${id}" not found for track "${track.id}"`)
    }
    return artist as Artist
  })
  const fullTrack: Track = { ...track, authors }
  tracksMap.set(track.id, fullTrack)
})

const albumsMap = new Map<string, Album>()
rawAlbums.forEach(album => {
  const authors = (album.authors || []).map((id: string) => {
    const artist = artistsMap.get(id)
    if (!artist) {
      throw new Error(`Artist with id "${id}" not found for album "${album.id}"`)
    }
    return artist as Artist
  })
  const tracks = (album.tracks || []).map((id: string) => {
    const track = tracksMap.get(id)
    if (!track) {
      throw new Error(`Track with id "${id}" not found for album "${album.id}"`)
    }
    return track as Track
  })
  const fullAlbum: Album = { ...album, authors, tracks }
  albumsMap.set(album.id, fullAlbum)
})

const artistsWithFeatured: Artist[] = rawArtists.map(artist => {
  const base = artistsMap.get(artist.id)!
  const featuredTrackId = artist.featuredTrack as string | undefined | null
  const featuredTrack = featuredTrackId ? tracksMap.get(featuredTrackId) || null : null
  return {
    ...base,
    featuredTrack,
  }
}) as Artist[]

const artistsMapFinal = new Map<string, Artist>()
artistsWithFeatured.forEach(a => artistsMapFinal.set(a.id, a))

const events: Event[] = rawEvents as Event[]
const services: Service[] = rawServices as Service[]

const homepageData = homepageJson as HomepageJson

const featuredArtistIds = Array.isArray(homepageData.featuredArtists) ? homepageData.featuredArtists : []
const featuredAlbumIds = Array.isArray(homepageData.featuredAlbums) ? homepageData.featuredAlbums : []
const featuredTrackIds = Array.isArray(homepageData.featuredTracks) ? homepageData.featuredTracks : []
const featuredEventIds = Array.isArray(homepageData.featuredEvents) ? homepageData.featuredEvents : []

const homepageContent: HomepageContent = {
  heroTitle: homepageData.heroTitle ?? '— Добро пожаловать! —',
  heroSubtitle: homepageData.heroSubtitle ?? ' — музыкальный лейбл, который открывает новые имена и задаёт тренды.',
  featuredArtists: featuredArtistIds.map(id => {
    const artist = artistsMapFinal.get(id)
    if (!artist) throw new Error(`Artist with id "${id}" not found`)
    return artist
  }),
  featuredAlbums: featuredAlbumIds.map(id => {
    const album = albumsMap.get(id)
    if (!album) throw new Error(`Album with id "${id}" not found`)
    return album
  }),
  featuredTracks: featuredTrackIds.map(id => {
    const track = tracksMap.get(id)
    if (!track) throw new Error(`Track with id "${id}" not found`)
    return track
  }),
  featuredEvents: featuredEventIds.map(id => {
    const event = events.find(e => e.id === id)
    if (!event) throw new Error(`Event with id "${id}" not found`)
    return event
  }),
}

const contacts: ContactContent = {
  email: contactsJson.email ?? 'vovabreshko@mail.ru',
  phone: contactsJson.phone ?? '+79620751111',
  address: contactsJson.address ?? 'Красноярск, ул. Курчатова, 11А',
  socials: contactsJson.socials ?? [

  ],
}

const radioAlbumIds = (Array.isArray(radioJson.albums) ? radioJson.albums : []) as unknown as string[]

const radioContent: RadioContent = {
  albums: radioAlbumIds.map(id => {
    const album = albumsMap.get(id)
    if (!album) throw new Error(`Album with id "${id}" not found`)
    return album
  }),
}

export const artistsData = artistsWithFeatured
export const tracksData = Array.from(tracksMap.values())
export const albumsData = Array.from(albumsMap.values())
export const eventsData = events
export const servicesData = services
export const homepageContentData = homepageContent
export const contactData = contacts
export const radioContentData = radioContent