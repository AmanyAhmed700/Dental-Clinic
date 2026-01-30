import Doctor from '@/app/sides/doctors'
import Hero from '@/app/sides/hero'

import React from 'react'
import Testimonials from '@/app/sides/banar'
import About from '@/app/sides/about'
import Services from '@/app/sides/services'
import BlogPreview from '@/app/sides/blogside'
import WhatsAppButton from '@/app/sides/whatsapp'
import AskAIButton from '@/app/sides/AskAIButton'

const Home  = () => {
  return (
    <div>
      <Hero/>
     <Doctor/>
     <About/>
     <Services/>
     <BlogPreview />
     <AskAIButton/>
     <WhatsAppButton/>
     <Testimonials/>
     </div>
  )
}

export default Home 