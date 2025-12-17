import Head from 'next/head'
import React from 'react'
import ServicePage from '../components/ServicePage'

export default function MassSystems() {
  return (
    <>
      <Head>
        <title>Mass Notification Services</title>
      </Head>
      <ServicePage
        introHeader="Mass Notification Services"
        introSub="Turnkey Installations • Parts and Smarts • Test and Certification • Annual Inspections"
        introBody="Our Mass Notification Systems are designed to reach large audiences quickly and effectively 
        during critical events. Whether for emergency alerts, routine communications, or system testing, we provide 
        turnkey solutions tailored to your facility’s needs. With expert engineering, intuitive controls, and robust 
        integration, our systems help ensure clear, timely communication when it matters most."
        fileHeader="Mass Notification Systems"
        fileKey="MassSystemFiles"
        sideViewId="massSideview"
      />
    </>
  )
}