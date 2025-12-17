import Head from 'next/head'
import React from 'react'
import ServicePage from '../components/ServicePage'

export default function BurglarAlarms() {
  return (
    <>
      <Head>
        <title>Burglar Alarms Services</title>
      </Head>
      <ServicePage
        introHeader="Burglar Alarms Services"
        introSub="Turnkey Installations • Parts and Smarts • Test and Certification • Annual Inspections"
        introBody="Whether you require a new system installation, an upgrade to your existing alarm infrastructure, or regular maintenance and inspections, our team is committed to delivering solutions that offer peace of mind and uncompromising security. You can trust that your burglar alarm system is designed and installed to the highest standards, providing reliable protection for what matters most to you."
        fileHeader="Burglar Alarms"
        fileKey="BurglarSystemFiles"
        sideViewId="burgSideview"
      />
    </>
  )
}