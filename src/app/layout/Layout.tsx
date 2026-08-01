import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Header } from '../../shared/ui/Header'
import { Footer } from '../../shared/ui/Footer'
import { Player } from '../../shared/ui/Player'
import { BackToTop } from '../../shared/ui/BackToTop'
import styles from '../../shared/ui/Layout.module.css'

export function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
      <Footer />
      <Player />
      <BackToTop />
      <ScrollRestoration />
    </div>
  )
}
