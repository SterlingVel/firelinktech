import { useContext } from 'react'
import Head from 'next/head'
import { LayoutContext } from '../components/Layout'

export default function Products() {
  const { scrollToContact } = useContext(LayoutContext)

  const products = [
    {
      id: 2,
      image: '/products/p1.jpeg',
      title: 'Fire Alarm Panel iO64',
      description: 'Addressable fire alarm panel supporting up to 64 devices for small to mid-sized systems.'
    },
    {
      id: 3,
      image: '/products/p2.jpeg',
      title: 'The Edge Series',
      description: 'Reliable, user-friendly fire alarm system designed for mid-sized buildings and easy upgrades.'
    },
    {
      id: 4,
      image: '/products/p3.jpeg',
      title: 'EST3X',
      description: 'Advanced life safety panel with high-capacity networking, intuitive controls, and Voltage Boost™ technology.'
    },
    {
      id: 5,
      image: '/products/p4.jpeg',
      title: 'EST4',
      description: 'Advanced network life safety platform with modular design, cyber security, and backward compatibility.'
    },
    {
      id: 6,
      image: '/products/p5.jpeg',
      title: 'ModuLaser',
      description: 'The most flexible design and tech-forward innovation available for early smoke and fire detection.'
    },
    {
      id: 7,
      image: '/products/p6.jpeg',
      title: 'Fireworks OneView',
      description: 'Graphical annunciator providing fast, detailed fire event info for first responders.'
    },
    {
      id: 8,
      image: '/products/p7.jpeg',
      title: 'Fireworks Platform',
      description: 'Incident management platform integrating fire alarm and building systems for effective response.'
    }
  ]

  return (
    <div className="app">
      <Head>
        <title>Products - FireLink Tech Inc.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section className="products-hero">
          <div className="products-hero-content">
            <h1>Our Products</h1>
            <p className="products-subtitle">
              Explore our selection of professional-grade fire safety and security products.
              These products are currently available through inquiry only and cannot be purchased directly online.
            </p>
            <button className="btn primary products-inquiry-btn" onClick={scrollToContact}>
              <span className="cta-title">Make An Inquiry</span>
              <span className="cta-sub">Contact us about products</span>
            </button>
          </div>
        </section>

        <section className="products-grid-section">
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                  <button className="product-inquire-btn" onClick={scrollToContact}>
                    Inquire →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}