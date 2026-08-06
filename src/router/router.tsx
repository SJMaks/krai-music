import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../app/layout/Layout'
import HomePage from '../pages/HomePage'
import ArtistsPage from '../pages/ArtistsPage'
import ArtistDetailPage from '../pages/ArtistDetailPage'
import EventsPage from '../pages/EventsPage'
import ServicesPage from '../pages/ServicesPage'
import RadioPage from '../pages/RadioPage'
import ContactPage from '../pages/ContactPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/krai-music/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'artists', element: <ArtistsPage /> },
      { path: 'artists/:slug', element: <ArtistDetailPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'radio', element: <RadioPage /> },
      { path: 'contacts', element: <ContactPage /> },
      { path: '404', element: <NotFoundPage /> },
    ],
  },
])
