import type { Artist, Event, HomepageContent, Service, Track, ContactContent } from '../types/content'
import homepageJson from '../../content/homepage.json'
import contactsJson from '../../content/contacts.json'

const artistModules = import.meta.glob('../../content/artists/*.json', { eager: true, import: 'default' })
const trackModules  = import.meta.glob('../../content/tracks/*.json',  { eager: true, import: 'default' })
const eventModules  = import.meta.glob('../../content/events/*.json',  { eager: true, import: 'default' })
const serviceModules = import.meta.glob('../../content/services/*.json', { eager: true, import: 'default' })

const rawArtists = Object.values(artistModules) as any[]
const rawTracks  = Object.values(trackModules)  as any[]
const rawEvents  = Object.values(eventModules)  as any[]
const rawServices = Object.values(serviceModules) as any[]

const artistsMap = new Map<string, Omit<Artist, 'featuredTrack'>>()
const tracksMap  = new Map<string, Track>()

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

const homepageData = homepageJson as Partial<HomepageContent> & Record<string, unknown>

const featuredArtistIds = (Array.isArray(homepageData.featuredArtists) ? homepageData.featuredArtists : []) as unknown as string[]
const featuredTrackIds  = (Array.isArray(homepageData.featuredTracks)  ? homepageData.featuredTracks  : []) as unknown as string[]
const featuredEventIds  = (Array.isArray(homepageData.featuredEvents)  ? homepageData.featuredEvents  : []) as unknown as string[]

const homepageContent: HomepageContent = {
  heroTitle: homepageData.heroTitle ?? '— Добро пожаловать! —',
  heroSubtitle: homepageData.heroSubtitle ?? ' — музыкальный лейбл, который открывает новые имена и задаёт тренды.',
  featuredArtists: featuredArtistIds.map(id => {
    const artist = artistsMapFinal.get(id)
    if (!artist) throw new Error(`Artist with id "${id}" not found`)
    return artist
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

export const artistsData = artistsWithFeatured
export const tracksData   = Array.from(tracksMap.values())
export const eventsData   = events
export const servicesData = services
export const homepageContentData = homepageContent
export const contactData = contacts