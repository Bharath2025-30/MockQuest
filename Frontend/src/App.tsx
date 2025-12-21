import './App.css'
import CTA from './components/sections/cta/default'
import FAQ from './components/sections/faq/default'
import Hero from './components/sections/hero/default'
import Items from './components/sections/items/default'
import Logos from './components/sections/logos/default'
import Navbar from './components/sections/navbar/default'
import FooterSection from './components/sections/footer/default'

function App() {

  return (
    <div className="dark bg-background text-foreground ">
      <Navbar/>
      <Hero/>
      <Logos/>
      <Items/>
      <FAQ/>
      <CTA/>
      <FooterSection/>
    </div>
  )
}

export default App