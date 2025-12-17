import '../css/main.css'
import '../css/burglarAlarms.css'
import '../css/admin.css'
import '../css/products.css'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const noLayout = router.pathname === '/admin'

  return noLayout ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}