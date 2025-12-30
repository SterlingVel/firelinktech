import Head from 'next/head'
import React from 'react'
import ServicePage from '../components/ServicePage'

export default function SecuritySystems() {
  return (
    <>
      <Head>
        <title>Security Systems Services</title>
      </Head>
      <ServicePage
        introHeader="Security Systems Services"
        introSub="Turnkey Installations • Parts and Smarts • Test and Certification • Annual Inspections"
        introBody="Whether you require a new system installation, an upgrade to your existing alarm infrastructure, or regular maintenance and inspections, our team is committed to delivering solutions that offer peace of mind and uncompromising security. You can trust that your security systems are designed and installed to the highest standards, providing reliable protection for what matters most to you."
        fileHeader="Security Systems"
        fileKey="SecuritySystemFiles"
        sideViewId="securitySideview"
      />
    </>
  )
}