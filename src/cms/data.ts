import type { Artist, Event, HomepageContent, Service, Track } from '../types/content'
import artistsJson from '../../content/artists.json'
import tracksJson from '../../content/tracks.json'
import eventsJson from '../../content/events.json'
import servicesJson from '../../content/services.json'
import homepageJson from '../../content/homepage.json'

function asCollection<T>(value: unknown, key?: string): T[] {
  if (Array.isArray(value)) {
    return value as T[]
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const nested = key ? record[key] : undefined
    if (Array.isArray(nested)) {
      return nested as T[]
    }
  }

  return []
}

export const artistsData: Artist[] = asCollection<Artist>(artistsJson, 'artists')
export const tracksData: Track[] = asCollection<Track>(tracksJson, 'tracks')
export const eventsData: Event[] = asCollection<Event>(eventsJson, 'events')
export const servicesData: Service[] = asCollection<Service>(servicesJson, 'services')

const homepageData = homepageJson as Partial<HomepageContent> & Record<string, unknown>
export const homepageContentData: HomepageContent = {
  heroTitle: homepageData.heroTitle ?? '— Добро пожаловать! —',
  heroSubtitle: homepageData.heroSubtitle ?? ' — музыкальный лейбл, который открывает новые имена и задаёт тренды.',
  featuredArtistIds: Array.isArray(homepageData.featuredArtistIds) ? homepageData.featuredArtistIds as string[] : [],
  featuredTrackIds: Array.isArray(homepageData.featuredTrackIds) ? homepageData.featuredTrackIds as string[] : [],
  featuredEventIds: Array.isArray(homepageData.featuredEventIds) ? homepageData.featuredEventIds as string[] : [],
}
