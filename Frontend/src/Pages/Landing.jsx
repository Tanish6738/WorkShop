import React from 'react'
import Hero from '../Components/Landing/Hero'
import Sections from '../Components/Landing/Sections'
import Footer from '../Components/Landing/Footer'

const Landing = () => {
  return (
    <div className="font-sans">
      <Hero />
  <Sections />
  <Footer />
    </div>
  )
}

export default Landing