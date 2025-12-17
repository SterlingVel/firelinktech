import { useContext } from 'react'
import Head from 'next/head'
import { LayoutContext } from '../components/Layout'

export default function Products() {
  const { scrollToContact } = useContext(LayoutContext)

  const products = [
    {
      id: 2,
      image: '/products/p2.png',
      title: 'The FX-1000 Panel',
      description: 'The FX-1000 provides one Class A or Class B intelligent device loop that supports up to 250 device addresses.'
    },
    {
      id: 3,
      image: '/products/p3.png',
      title: 'RZI16-2',
      description: 'Remote Zone Interface - An addressable device that provides connections for sixteen Class B initiating device circuits (IDCs).'
    },
    {
      id: 4,
      image: '/products/p4.png',
      title: 'VS1-G',
      description: 'Fire Alarm Control Panel - Single Loop - 64 Intelligent Devices Max'
    },
    {
      id: 5,
      image: '/products/p5.png',
      title: 'VM-LOC',
      description: 'Local Operations Console - Remotely control emergency messaging and system operation.'
    },
    {
      id: 6,
      image: '/products/p6.png',
      title: 'ANS50XG',
      description: '50 Watt ANS Expander Panel - Includes an amplifier, tone generator, digital message repeater, and supervisory interface.'
    },
    {
      id: 7,
      image: '/products/p7.png',
      title: 'K-RLCD',
      description: 'Intelligent LCD Annunciator - Provides status indication and common controls for compatible fire alarm control panels.'
    },
    {
      id: 8,
      image: '/products/p8.png',
      title: 'IB4U',
      description: 'Isolator Base - Protects SLC from complete collapse due to a wire to wire short.'
    },
    {
      id: 9,
      image: '/products/p9.png',
      title: 'K-270',
      description: 'Intelligent Manual Station - Single Action - Designed expressly for small buildings.'
    },
    {
      id: 10,
      image: '/products/p10.png',
      title: 'SIGA-CRH',
      description: 'High Power Control Relay Module - Designed for interface applications that require a high voltage, high curent delay.'
    },
    {
      id: 11,
      image: '/products/p11.png',
      title: 'ANS50MDG2',
      description: '50 Watt Audio Notification Panel - High-performance audio notification system that provides voice evacuation capability.'
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