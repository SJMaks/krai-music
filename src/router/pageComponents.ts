import { lazy } from 'react'

export const HomePage = lazy(async () => import('../pages/HomePage'))
export const ArtistsPage = lazy(async () => import('../pages/ArtistsPage'))
export const ArtistDetailPage = lazy(async () => import('../pages/ArtistDetailPage'))
export const EventsPage = lazy(async () => import('../pages/EventsPage'))
export const EventDetailPage = lazy(async () => import('../pages/EventDetailPage'))
export const ServicesPage = lazy(async () => import('../pages/ServicesPage'))
export const RadioPage = lazy(async () => import('../pages/RadioPage'))
export const ContactPage = lazy(async () => import('../pages/ContactPage'))
export const NotFoundPage = lazy(async () => import('../pages/NotFoundPage'))
