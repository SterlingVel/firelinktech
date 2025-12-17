import Head from 'next/head'
import React from 'react'
import ServicePage from '../components/ServicePage'

export default function FireAlarms() {
  return (
    <>
      <Head>
        <title>Fire Alarms Services</title>
      </Head>
      <ServicePage
        introHeader="Fire Alarms Services"
        introSub="Turnkey Installations • Parts and Smarts • Test and Certification • Annual Inspections"
        introBody="Our fire alarm systems are engineered to deliver rapid detection and reliable notifications, 
        protecting lives and property in any environment. From new installations to upgrades and annual inspections, 
        our experienced team ensures every system meets the highest safety standards and local codes."
        fileHeader="Fire Alarms"
        fileKey="FireSystemFiles"
        sideViewId="fireSideview"
      />
    </>
  )
}