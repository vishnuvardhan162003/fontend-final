import Hero from '../components/home/Hero'
import TrustStrip from '../components/home/TrustStrip'
import FeaturedCourses from '../components/home/FeaturedCourses'
import HowItWorks from '../components/home/HowItWorks'
import Testimonials from '../components/home/Testimonials'
import FaqSection from '../components/home/FaqSection'
import CtaBand from '../components/home/CtaBand'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedCourses />
      <HowItWorks />
      <Testimonials />
      <FaqSection />
      <CtaBand />
    </>
  )
}
