import { Outlet } from 'react-router'
import Navigation from './Navigation'
import Footer from './Footer'

export default function Layout() {
  return (
    <main>
      <Navigation />
      <Outlet />
      <Footer />
    </main>
  )
}
