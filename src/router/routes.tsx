import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Suspense } from 'react'
import { Layout } from '../app/layout/Layout'
import {
  ArtistDetailPage,
  ArtistsPage,
  EventDetailPage,
  EventsPage,
  HomePage,
  NotFoundPage,
  RadioPage,
  ServicesPage,
} from './pageComponents'
import { PageSkeleton } from './PageSkeleton'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Suspense fallback={<PageSkeleton />}><HomePage /></Suspense> },
      { path: 'artists', element: <Suspense fallback={<PageSkeleton />}><ArtistsPage /></Suspense> },
      { path: 'artists/:slug', element: <Suspense fallback={<PageSkeleton />}><ArtistDetailPage /></Suspense> },
      { path: 'events', element: <Suspense fallback={<PageSkeleton />}><EventsPage /></Suspense> },
      { path: 'events/:slug', element: <Suspense fallback={<PageSkeleton />}><EventDetailPage /></Suspense> },
      { path: 'services', element: <Suspense fallback={<PageSkeleton />}><ServicesPage /></Suspense> },
      { path: 'radio', element: <Suspense fallback={<PageSkeleton />}><RadioPage /></Suspense> },
      { path: '404', element: <Suspense fallback={<PageSkeleton />}><NotFoundPage /></Suspense> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
],
{
  basename: '/krai-music',
})
