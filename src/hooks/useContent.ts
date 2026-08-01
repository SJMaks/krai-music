import { useMemo } from 'react'
import { artistsData } from '../cms/data'
import type { Artist, ContactContent, HomepageContent, RadioPlaylist, Track } from '../types/content'

export function useContent() {
  const artists = artistsData as Artist[]
  const tracks = useMemo(() => (artistsData[0] ? [] : []) as Track[], [])
  const homepage = useMemo<HomepageContent>(() => ({
    heroTitle: '— Добро пожаловать! —',
    heroSubtitle: ' — музыкальный лейбл, который открывает новые имена и задаёт тренды.',
    heroImage: '/images/hero.webp',
  }), [])
  const contact = useMemo<ContactContent>(() => ({
    email: 'vovabreshko@mail.ru',
    phone: '+79620751111',
    address: 'Красноярск, ул. Курчатова, 11А',
    socials: [
      { label: 'Группа ВК', url: 'https://vk.ru/kraymusic24' },
    ],
  }), [])
  const footer = useMemo(() => ({ labelName: 'Kray Music', copyrightText: '© 2026 КРАЙ MUSIC. ALL RIGHTS RESERVED.' }), [])
  const links = useMemo(() => ([
    { to: '/', label: 'Главная' },
    { to: '/artists', label: 'Артисты' },
    { to: '/events', label: 'Мероприятия' },
    { to: '/services', label: 'Услуги' },
    { to: '/radio', label: 'Радио' },
    { to: '/contacts', label: 'Контакты' },
  ]), [])
  const radio = useMemo<RadioPlaylist>(() => ({ orderedTracks: [], artistFilters: [] }), [])

  return { artists, tracks, homepage, contact, footer, radio, links }
}
