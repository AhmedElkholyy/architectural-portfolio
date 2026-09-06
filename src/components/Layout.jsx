import { Outlet, useLocation } from 'react-router'
import Navigation from './Navigation'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()

  return (
    <main>
      <Navigation />
      <div className="page-fade" key={location.pathname}>
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}
