import type { Artist, Event, Service, Track } from '../types/content'
import artistsJson from '../../content/artists.json'
import tracksJson from '../../content/tracks.json'
import eventsJson from '../../content/events.json'
import servicesJson from '../../content/services.json'

export const artistsData: Artist[] = artistsJson as Artist[]
export const tracksData: Track[] = tracksJson as Track[]
export const eventsData: Event[] = eventsJson as Event[]
export const servicesData: Service[] = servicesJson as Service[]
