import React, { useRef, useState, createContext, useEffect } from 'react'
import Link from 'next/link'
import { submitContactForm } from '../tools/smtp';

export const LayoutContext = createContext({ scrollToContact: () => { }, servicesOpen: false, setServicesOpen: () => { } });

export default function Layout({ children }) {
    const contactRef = useRef(null)
    const highlightActive = useRef(false)
    const highlightTimeout = useRef(null)
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('')
    const [servicesOpen, setServicesOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [contactLoading, setContactLoading] = useState(false);
    const [contactSent, setContactSent] = useState(false);

    function waitForScrollStop(timeout = 1500, idle = 200) {
        return new Promise(resolve => {
            let timer = null
            let total = 0
            function done() {
                window.removeEventListener('scroll', onScroll)
                resolve()
            }
            function onScroll() {
                clearTimeout(timer)
                timer = setTimeout(done, idle)
            }
            window.addEventListener('scroll', onScroll)
            timer = setTimeout(done, timeout)
            setTimeout(() => {
                if (total === 0) done()
            }, idle)
        })
    }

    const scrollToContact = async () => {
        if (!contactRef.current) return
        if (highlightActive.current) return

        contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        await waitForScrollStop()
        highlightActive.current = true
        contactRef.current.classList.add('highlight-contact')
        highlightTimeout.current = setTimeout(() => {
            contactRef.current.classList.remove('highlight-contact')
            highlightActive.current = false
        }, 700)
    }

    const toggleActive = (e) => {
        e && e.stopPropagation();
        setServicesOpen(s => !s)
    }

    const toggleMobileMenu = (e) => {
        e && e.stopPropagation();
        setMobileMenuOpen(m => !m)
    }

    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
    }

    const handleMobileContactClick = () => {
        closeMobileMenu()
        scrollToContact()
    }

    useEffect(() => {
        if (!servicesOpen) return;
        const handleClick = (e) => {
            setServicesOpen(false);
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [servicesOpen]);

    useEffect(() => {
        if (!servicesOpen) return;
        const handleServicesResize = () => {
            if (window.innerWidth > 760 && servicesOpen) {
                setServicesOpen(false);
            }
        };

        window.addEventListener('resize', handleServicesResize);
    }, [servicesOpen]);

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const handleClick = (e) => {
            // Check if click is outside the mobile menu
            const mobileMenu = document.querySelector('.mobile-menu');
            const hamburger = document.querySelector('.hamburger-btn');
            if (mobileMenu && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const handleScroll = () => {
            setMobileMenuOpen(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mobileMenuOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 760 && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileMenuOpen]);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactLoading(true);
        setContactSent(false);
        await submitContactForm(e, {
            name: contactName,
            email: contactEmail,
            message: contactMessage,
        });
        await new Promise(resolve => setTimeout(resolve, 600));
        setContactLoading(false);
        setContactSent(true);
        setContactMessage('');
    };

    return (
        <LayoutContext.Provider value={{ scrollToContact, servicesOpen, setServicesOpen, toggleActive }}>
            <div className="app">
                <header className="nav">
                    <div className="nav-inner">
                        <div className="logo">
                            <Link href="/" passHref>
                                <img src="/customLogo.png" alt="FireLink Tech Logo" style={{ cursor: "pointer" }} />
                            </Link>
                        </div>

                        <nav className="nav-links desktop-nav">
                            <div id="servicesDrop" className={`dropdown ${servicesOpen ? 'active' : ''}`} onClick={toggleActive}>
                                <button className="drop-btn">SERVICES <span className="chev">▾</span></button>
                                <div className="dropdown-content">
                                    <Link href="/FireAlarms">Fire Alarms</Link>
                                    <div className="dropdown-divider" />
                                    <Link href="/MassSystems">Mass Notifications</Link>
                                    <div className="dropdown-divider" />
                                    <Link href="/SecuritySystems">Security Systems</Link>
                                </div>
                            </div>
                            <Link href="/Products" className="nav-btn">PRODUCTS</Link>
                            <button className="nav-cta" onClick={scrollToContact}>CONTACT US</button>
                        </nav>

                        <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
                            <img src="/menu.png" alt="Menu" />
                        </button>
                    </div>

                    <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                        <div className="mobile-menu-content">
                            <div className="mobile-menu-section">
                                <div className="mobile-menu-label">SERVICES</div>
                                <Link href="/FireAlarms" className="mobile-menu-subitem" onClick={closeMobileMenu}>
                                    Fire Alarms
                                </Link>
                                <Link href="/MassSystems" className="mobile-menu-subitem" onClick={closeMobileMenu}>
                                    Mass Notifications
                                </Link>
                                <Link href="/SecuritySystems" className="mobile-menu-subitem" onClick={closeMobileMenu}>
                                    Security Systems
                                </Link>
                            </div>

                            <Link href="/Products" className="mobile-menu-item" onClick={closeMobileMenu}>
                                PRODUCTS
                            </Link>

                            <button className="mobile-menu-item" onClick={handleMobileContactClick}>
                                CONTACT US
                            </button>
                        </div>
                    </div>
                </header>

                <main>{children}</main>

                <section id="contact" className="contact" ref={contactRef}>
                    <div className="contact-inner">
                        <div className="contact-info">
                            <h3>Contact Us</h3>
                            <p className="muted">For sales or support, reach out — we're here to help.</p>
                            <p className="contact-line">
                                <span className="contact-icon" aria-hidden="true">
                                    <img src="/icons/phone.svg" alt="" width={24} height={20} />
                                </span>
                                <a href="tel:17864494354" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    (786) 449-4354
                                </a>
                            </p>
                            <p className="contact-line">
                                <span className="contact-icon" aria-hidden="true">
                                    <img src="/icons/mail.svg" alt="" width={20} height={20} />
                                </span>
                                <a href="mailto:eperez@firelinktech.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    eperez@firelinktech.com
                                </a>
                            </p>
                            <p className="contact-line">
                                <span className="contact-icon" aria-hidden="true">
                                    <img src="/icons/location.svg" alt="" width={20} height={24} />
                                </span>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=5200+SW+163rd+Ave,+Southwest+Ranches,+FL+33331"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                    5200 SW 163rd Ave, Southwest Ranches, FL 33331
                                </a>
                            </p>
                            <p className="contact-line">
                                <span className="contact-icon" aria-hidden="true">
                                    <img src="/icons/license.svg" alt="" width={20} height={20} />
                                </span>
                                EF20001178
                            </p>
                        </div>
                        <div className="contact-form-section">
                            <h3>Make An Inquiry</h3>
                            <div className="contact-form-stack">
                                <form
                                    className={`contact-form${(contactLoading || contactSent) ? ' fade-out' : ''}`}
                                    action="#"
                                    method="post"
                                    onSubmit={handleContactSubmit}
                                >
                                    <label>
                                        <span>Name</span>
                                        <input type="text" placeholder="Your full name" onChange={e => setContactName(e.target.value)} required />
                                    </label>
                                    <label>
                                        <span>Email</span>
                                        <input type="email" placeholder="you@example.com" onChange={e => setContactEmail(e.target.value)} required />
                                    </label>
                                    <label>
                                        <span>
                                            Message
                                            {contactMessage.length >= 5000 && (
                                                <span style={{ color: '#dc2836', fontSize: '13px', marginLeft: '8px' }}>
                                                    (5000 character limit)
                                                </span>
                                            )}
                                        </span>
                                        <textarea
                                            placeholder="How can we help?"
                                            maxLength={5000}
                                            value={contactMessage}
                                            onChange={e => setContactMessage(e.target.value)}
                                            required
                                        ></textarea>
                                    </label>
                                    <button className="btn primary" type="submit">Send Message</button>
                                </form>
                                {contactLoading && (
                                    <div className="contact-form-loading overlay">
                                        <div className="loader" />
                                        <div style={{ marginTop: 18, color: 'var(--muted-teal)', fontWeight: 500 }}>Sending your message...</div>
                                    </div>
                                )}
                                {contactSent && (
                                    <div className="contact-form-sent overlay">
                                        <div style={{ fontSize: 18, color: 'var(--muted-teal)', fontWeight: 700, marginBottom: 10 }}>
                                            Message sent!
                                        </div>
                                        <div style={{ color: 'var(--white)', fontSize: 15 }}>
                                            Thank you for reaching out. You will receive a confirmation email shortly.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="site-footer">
                    <div className="footer-inner">
                        <img src="/customLogo.png" alt="logo" className="footer-logo" />
                        <p className='footer-text'>© {new Date().getFullYear()} FIRE-LINK Technologies Inc.</p>
                    </div>
                </footer>
            </div>
        </LayoutContext.Provider>
    )
}