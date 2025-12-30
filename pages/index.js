import Head from 'next/head'
import React, { useState, useRef, useContext } from 'react'
import Link from 'next/link'
import "./_app.js"
import { LayoutContext } from '../components/Layout'
import { submitHiringForm } from '../tools/smtp.js'

export default function Home() {
  const [hiring, setHiring] = useState(false)
  const [submissionView, setSubmissionView] = useState(false)
  const resumeRef = useRef(null)
  const heroRef = useRef(null)
  const hiringRef = useRef(null)
  const [hiringSubmitting, setHiringSubmitting] = useState(false);
  const [hiringSubmitted, setHiringSubmitted] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [hiringResumeName, setHiringResumeName] = useState('')
  const [hiringName, setHiringName] = useState('')
  const [hiringEmail, setHiringEmail] = useState('')
  const [hiringPhone, setHiringPhone] = useState('')
  const [hiringResume, setHiringResume] = useState(null)
  const [cover, setCover] = useState('')
  const [resumeError, setResumeError] = useState('')
  const { scrollToContact } = useContext(LayoutContext);

  const openHiring = async (e) => {
    e.preventDefault()
    setHiring(true)

    await new Promise(resolve => setTimeout(resolve, 360))

    if (window.innerWidth < 560) {
      if (hiringRef.current) {
        hiringRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  const closeHiring = (e) => {
    e && e.preventDefault()
    setHiring(false)
    setResumeError('')
  }

  const backToHome = () => {
    setSubmissionView(false)
    setHiring(false)
    setShowCheckmark(false)
    setShowFinalMessage(false)
    setHiringSubmitted(true)
    setHiringSubmitting(false)
    // Reset form
    setHiringName('')
    setHiringEmail('')
    setHiringPhone('')
    setHiringResume(null)
    setHiringResumeName('')
    setCover('')
    if (resumeRef.current) {
      resumeRef.current.value = ''
    }
  }

  const handleResumeChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (f) {
      setHiringResumeName(f.name)
      setHiringResume(f);
      setResumeError('')
    } else {
      setHiringResumeName('')
      setHiringResume(null);
    }
  }

  const clearResume = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (resumeRef.current) {
      resumeRef.current.value = ''
    }
    setHiringResumeName('')
    setResumeError('')
  }

  const submitApplication = async (e) => {
    e.preventDefault()
    const resumeFile = resumeRef.current && resumeRef.current.files && resumeRef.current.files[0]
    if (!resumeFile) {
      setResumeError('Resume file is required.')
      return
    }
    setResumeError('')
    
    setHiringSubmitting(true);
    setSubmissionView(true);
    
    submitHiringForm(e, {
      name: hiringName,
      email: hiringEmail,
      phone: hiringPhone,
      resume: hiringResume,
      message: cover,
    });
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setHiringSubmitting(false);
    setShowCheckmark(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowFinalMessage(true);
  }

  return (
    <div className="app">
      <Head>
        <title>FireLink Tech Inc.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section className="hero">
          <div className={`hero-shell ${hiring ? 'hiring-active' : ''} ${submissionView ? 'submission-active' : ''}`}>
            <div className="hero-panel">
              <div className="hero-inner">
                <div className="hero-copy">
                  <h1>The best customer service is what we always strive for.</h1>
                  <p>FIRE-LINK Technologies Inc. is an independently owned company founded by Enrique Perez in 2013. He assembled a team of engineers, technicians, and installers to deliver high-quality protection systems, monitoring, and services. To this day, customer service is always our number one priority.</p>

                  <div className="hero-ctas">
                    <Link href="/Contact" className="btn primary" onClick={e => { e.preventDefault(); scrollToContact(); }}>
                      <div className="cta-title">Get A Free Quote</div>
                      <div className="cta-sub">Make an inquiry</div>
                    </Link>

                    {hiringSubmitted ? (
                      <div className="btn outline" style={{ cursor: 'default', pointerEvents: 'none', opacity: 1 }}>
                        <div className="cta-title">Application Sent</div>
                        <div className="cta-sub">Thanks for applying!</div>
                      </div>
                    ) : (
                      <a className="btn outline" href="#" onClick={openHiring}>
                        <div className="cta-title">Now Hiring</div>
                        <div className="cta-sub">Click to apply</div>
                      </a>
                    )}
                  </div>
                </div>

                <div className="hero-image">
                  <img src="/products/p1.png" alt="Technician" />
                </div>
              </div>
            </div>

            <div className="hiring-panel" aria-hidden={!hiring}>
              <div className="hiring-inner" ref={hiringRef}>
                <div className="hiring-header">
                  <h2>Join Our Team</h2>
                  <button
                    className="btn back"
                    onClick={closeHiring}
                  >
                    ← Back
                  </button>
                </div>
                <div className="hiring-form-stack">
                  <form className="hiring-form" onSubmit={submitApplication}>
                    <label>
                      <span>Name *</span>
                      <input name="name" type="text" placeholder="Your full name" value={hiringName} onChange={e => setHiringName(e.target.value)} required />
                    </label>

                    <label>
                      <span>Email *</span>
                      <input name="email" type="email" placeholder="you@example.com" value={hiringEmail} onChange={e => setHiringEmail(e.target.value)} required />
                    </label>

                    <label>
                      <span>Phone</span>
                      <input name="phone" type="tel" value={hiringPhone} onChange={e => setHiringPhone(e.target.value)} />
                    </label>

                    <input
                      id="resume"
                      name="resume"
                      ref={resumeRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="visually-hidden-file-input"
                    />

                    <div
                      className="file"
                      role="group"
                      aria-label="Resume upload"
                    >
                      <span>Resume *</span>

                      <div className="file-input-wrapper">
                        <button
                          type="button"
                          className="file-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            resumeRef.current && resumeRef.current.click();
                          }}
                        >
                          Choose file
                        </button>

                        <div className="file-info" aria-live="polite">
                          <span className={`file-name ${hiringResumeName ? 'has-file' : ''}`}>
                            {hiringResumeName || 'Must be pdf or doc(x) format'}
                          </span>
                        </div>
                      </div>
                      {resumeError && (
                        <div style={{ color: '#dc2836', fontSize: '13px', marginTop: '6px' }}>
                          {resumeError}
                        </div>
                      )}
                    </div>

                    <label>
                      <span>
                        Additional comments
                        {cover.length >= 5000 && (
                          <span style={{ color: '#dc2836', fontSize: '13px', marginLeft: '8px' }}>
                            (5000 character limit)
                          </span>
                        )}
                      </span>
                      <textarea
                        name="cover"
                        placeholder="Optional"
                        maxLength={5000}
                        value={cover}
                        onChange={e => setCover(e.target.value)}
                      ></textarea>
                    </label>

                    <div className="hiring-actions">
                      <button
                        type="button"
                        className="btn outline"
                        onClick={closeHiring}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn primary"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="submission-panel" aria-hidden={!submissionView}>
              <div className="submission-inner">
                {hiringSubmitting && (
                  <div className="submission-loading">
                    <div className="loader" />
                    <p className="submission-loading-text">Sending your application...</p>
                  </div>
                )}
                
                {showCheckmark && (
                  <div className={`submission-checkmark-container ${showFinalMessage ? 'shrink' : ''}`}>
                    <svg className="checkmark-icon" viewBox="0 0 52 52">
                      <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                      <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <p className="submission-checkmark-text">Application Submitted</p>
                  </div>
                )}

                {showFinalMessage && (
                  <div className="submission-final-message">
                    <h2>Thanks for applying!</h2>
                    <p>You will receive a confirmation email shortly.</p>
                    <button className="btn primary submission" onClick={backToHome}>
                      Back to Home
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="services-strip" aria-label="Services">
          <div className="services-inner">
            <div className="service-item">
              <span className="service-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <polygon points="12 3 19.794 7.5 19.794 16.5 12 21 4.206 16.5 4.206 7.5" />
                  <path className="check" d="M8.8 12.3 L11.2 14 L15.2 9.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="service-label">Fire Alarm</span>
            </div>

            <div className="service-item">
              <span className="service-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <polygon points="12 3 19.794 7.5 19.794 16.5 12 21 4.206 16.5 4.206 7.5" />
                  <path className="check" d="M8.8 12.3 L11.2 14 L15.2 9.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="service-label">Security Systems</span>
            </div>

            <div className="service-item">
              <span className="service-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <polygon points="12 3 19.794 7.5 19.794 16.5 12 21 4.206 16.5 4.206 7.5" />
                  <path className="check" d="M8.8 12.3 L11.2 14 L15.2 9.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="service-label">Access Control</span>
            </div>

            <div className="service-item">
              <span className="service-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <polygon points="12 3 19.794 7.5 19.794 16.5 12 21 4.206 16.5 4.206 7.5" />
                  <path className="check" d="M8.8 12.3 L11.2 14 L15.2 9.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="service-label">Video Surveillance</span>
            </div>
          </div>
        </section>

        <section className="features">
          <h2>Our Services</h2>
          <div className="cards">
            <div className="card">
              <div className="card-media">
                <img src="/alarms.png" alt="Security Systems" />
              </div>

              <div className="card-content">
                <h3>Security Systems</h3>
                <p>Design, installation and monitoring to keep your property secure.</p>
                <Link href="/SecuritySystems" className="card-link">Learn more →</Link>
              </div>
            </div>

            <div className="card">
              <div className="card-media">
                <img src="/firealarm.png" alt="Fire Alarm" />
              </div>

              <div className="card-content">
                <h3>Fire Alarm Systems</h3>
                <p>Fast detection and reliable notifications to protect lives and property.</p>
                <Link href="/FireAlarms" className="card-link">Learn more →</Link>
              </div>
            </div>

            <div className="card">
              <div className="card-media">
                <img src="/products/p5.png" alt="Mass Notification" />
              </div>

              <div className="card-content">
                <h3>Mass Notification</h3>
                <p>Reach any size audience quickly during critical events.</p>
                <Link href="/MassSystems" className="card-link">Learn more →</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}