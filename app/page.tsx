'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import {
  ArrowDown,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Send,
  Sparkles,
  Users,
  Utensils,
  X,
} from 'lucide-react'

const address = 'Main Road, Beside GV Mall, Sathupally, Telangana 507303, India'
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

const menuItems = [
  { name: 'Paneer Tikka', category: 'Starters', description: 'Smoked cottage cheese, peppers, house masala', price: '₹—' },
  { name: 'Garuda Special Biryani', category: 'Biryani', description: 'Fragrant basmati rice, saffron, seasonal garnish', price: '₹—' },
  { name: 'Butter Chicken', category: 'Non-Vegetarian', description: 'Tomato, cream, fenugreek and gentle spice', price: '₹—' },
  { name: 'Dal Tadka', category: 'Vegetarian', description: 'Yellow lentils, cumin, garlic and ghee', price: '₹—' },
  { name: 'Garlic Naan', category: 'Rice & Breads', description: 'Tandoor-baked bread, garlic, coriander', price: '₹—' },
  { name: 'Gulab Jamun', category: 'Desserts', description: 'Soft milk dumplings, warm cardamom syrup', price: '₹—' },
]

const gallery = [
  { src: '/garuda-food.png', alt: 'Indian dishes served on a warm wooden table', label: 'Food' },
  { src: '/garuda-dining.png', alt: 'Warmly lit dining table at Garuda', label: 'Tables' },
  { src: '/garuda-hero.png', alt: 'Garuda restaurant interior', label: 'Restaurant' },
  { src: '/garuda-room.png', alt: 'Comfortable room at Garuda', label: 'Rooms' },
]

function Logo() {
  return <a href="#home" className="logo" aria-label="Garuda home"><span className="logo-mark">✦</span> GARUDA</a>
}

function BookingModal({ type, onClose }: { type: 'table' | 'room' | null; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const today = new Date().toISOString().split('T')[0]
  if (!type) return null

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const value = (key: string) => String(form.get(key) || '')
    if (!supabase) {
      setLoading(false)
      setError('Booking service is temporarily unavailable. Please call Garuda directly.')
      return
    }
    const result = type === 'table'
      ? await supabase.rpc('submit_table_reservation', {
          p_name: value('name'), p_phone: value('phone'), p_email: value('email'),
          p_reservation_date: value('date'), p_reservation_time: value('time'),
          p_guest_count: Number(value('guests')), p_table_type: value('table_type'), p_special_request: value('special_request'),
        })
      : await supabase.rpc('submit_room_booking', {
          p_guest_name: value('name'), p_phone: value('phone'), p_email: value('email'),
          p_check_in: value('check_in'), p_check_out: value('check_out'), p_guest_count: Number(value('guests')),
          p_room_type: value('room_type'), p_rooms_requested: Number(value('rooms')), p_special_request: value('special_request'),
        })
    setLoading(false)
    if (result.error) setError(result.error.message.replace(/^.*?: /, ''))
    else setSubmitted(true)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close booking form"><X /></button>
        {submitted ? (
          <div className="success-state"><div className="success-icon"><Check /></div><p className="eyebrow">REQUEST RECEIVED</p><h2>We&apos;ll be in touch.</h2><p>Your {type === 'table' ? 'table reservation' : 'room booking'} request is saved. Garuda will confirm availability directly.</p><button className="button button-dark" onClick={onClose}>Done</button></div>
        ) : (
          <form onSubmit={submitBooking}>
            <p className="eyebrow">GARUDA / {type === 'table' ? 'TABLE RESERVATION' : 'ROOM REQUEST'}</p>
            <h2 id="booking-title">{type === 'table' ? 'Reserve your table.' : 'Plan your stay.'}</h2>
            <p className="modal-intro">A request, not an instant confirmation. We&apos;ll contact you using the details below.</p>
            <div className="form-grid">
              <label>Full name<input required name="name" placeholder="Your name" /></label>
              <label>Phone number<input required name="phone" type="tel" placeholder="XXXXXXXXXX" /></label>
              <label>Email<input name="email" type="email" placeholder="you@example.com" /></label>
              {type === 'table' ? <>
                <label>Date<input required name="date" type="date" min={today} /></label>
                <label>Preferred time<input required name="time" type="time" /></label>
                <label>Guests<select name="guests" defaultValue="2"><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5+ guests</option></select></label>
                <label>Table type<select name="table_type" defaultValue="2-seater"><option value="2-seater">2-Seater</option><option value="4-seater">4-Seater</option><option value="family">Family</option></select></label>
              </> : <>
                <label>Check-in<input required name="check_in" type="date" min={today} /></label>
                <label>Check-out<input required name="check_out" type="date" min={today} /></label>
                <label>Guests<select name="guests" defaultValue="2"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option></select></label>
                <label>Room type<select name="room_type" defaultValue="AC"><option value="AC">AC Room</option><option value="Non-AC">Non-AC Room</option></select></label>
                <label>Rooms requested<select name="rooms" defaultValue="1"><option value="1">1 room</option><option value="2">2 rooms</option><option value="3">3 rooms</option><option value="4">4 rooms</option></select></label>
              </>}
              <label className="full-field">Special request<textarea name="special_request" placeholder="Anything we should know?" rows={3} /></label>
            </div>
            {error && <p role="alert" className="form-error">{error}</p>}
            <button className="button button-dark full-button" type="submit" disabled={loading}>{loading ? 'Checking availability…' : <>Send request <Send data-icon="inline-end" /></>}</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [booking, setBooking] = useState<'table' | 'room' | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', 'Starters', 'Biryani', 'Vegetarian', 'Non-Vegetarian', 'Desserts']
  const filteredMenu = activeCategory === 'All' ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  return (
    <main>
      <header className="site-header">
        <Logo />
        <nav className={mobileOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {['Menu', 'Rooms', 'Tables', 'Gallery', 'About', 'Contact'].map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}>{item}</a>)}
          <a className="nav-map" href={mapsUrl} target="_blank" rel="noreferrer"><MapPin /> Maps</a>
        </nav>
        <button className="button button-gold header-cta" onClick={() => setBooking('table')}>Book now <ArrowRight data-icon="inline-end" /></button>
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label="Toggle navigation">{mobileOpen ? <X /> : <MenuIcon />}</button>
      </header>

      <section className="hero" id="home">
        <Image src="/garuda-hero.png" alt="Warmly lit Garuda restaurant interior" fill priority className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-content page-shell">
          <p className="eyebrow eyebrow-light">INDIAN RESTAURANT & ROOMS / SATHUPALLY</p>
          <h1>Good food.<br /><em>Comfortable stays.</em><br />Warm hospitality.</h1>
          <p className="hero-copy">Experience authentic Indian flavours and comfortable rooms in the heart of Sathupally.</p>
          <div className="hero-actions"><a className="button button-gold" href="#menu">Explore menu <ArrowRight data-icon="inline-end" /></a><button className="button button-outline-light" onClick={() => setBooking('table')}>Book a table</button><button className="text-button light-text" onClick={() => setBooking('room')}>Book a room <ArrowRight data-icon="inline-end" /></button></div>
        </div>
        <div className="scroll-cue"><ArrowDown /> SCROLL TO EXPLORE</div>
      </section>

      <section className="ticker"><div className="ticker-item"><Utensils /> Indian cuisine</div><div className="ticker-item"><BedDouble /> 8 comfortable rooms</div><div className="ticker-item"><Sparkles /> AC & non-AC</div><div className="ticker-item"><Users /> Family friendly</div><div className="ticker-item"><MapPin /> Prime Sathupally location</div></section>

      <section className="section page-shell food-section" id="about"><div className="split-image"><Image src="/garuda-food.png" alt="Authentic Indian food served at Garuda" fill /></div><div className="split-copy"><p className="eyebrow">01 / THE FOOD EXPERIENCE</p><h2>Made for the<br /><em>love of food.</em></h2><p>From the first aroma to the last bite, Garuda is a place to slow down and enjoy the familiar comfort of Indian cooking. Come for a generous meal, stay for the warmth around the table.</p><a className="text-button" href="#menu">Explore our menu <ArrowRight data-icon="inline-end" /></a><div className="mini-note"><span>06</span><p>Editable menu categories<br /><small>Prices and dishes can be updated anytime.</small></p></div></div></section>

      <section className="section section-dark" id="tables"><div className="page-shell"><div className="section-heading"><div><p className="eyebrow eyebrow-light">02 / THE TABLE EXPERIENCE</p><h2>Your table,<br /><em>your moment.</em></h2></div><p>Whether it&apos;s a quick meal for two or a long family gathering, our tables are set for the way you like to spend time together.</p></div><div className="table-grid">{[{ title: '2-Seater', detail: 'For two guests', count: '05 tables' }, { title: '4-Seater', detail: 'For four guests', count: '05 tables' }, { title: 'Family', detail: 'For larger groups', count: '05 tables' }].map((table, index) => <article className="table-card" key={table.title}><div className={`table-art table-art-${index + 1}`}><span>0{index + 1}</span></div><div className="table-card-content"><h3>{table.title}</h3><p>{table.detail}</p><div className="card-meta"><span>{table.count}</span><button className="small-link" onClick={() => setBooking('table')}>Book this table <ArrowRight /></button></div></div></article>)}</div><button className="button button-gold section-button" onClick={() => setBooking('table')}>Book a table online <ArrowRight data-icon="inline-end" /></button></div></section>

      <section className="section rooms-section" id="rooms"><div className="page-shell"><div className="section-heading"><div><p className="eyebrow">03 / REST EASY</p><h2>Stay comfortable<br /><em>at Garuda.</em></h2></div><p>When the day is done, settle into a clean, comfortable room just upstairs. Choose the quiet simplicity of a Non-AC room or the cool ease of AC.</p></div><div className="floor-plan"><div className="floor-label">A SIMPLE STAY, ALL IN ONE PLACE</div>{[['SECOND FLOOR', 'AC Rooms', '04 rooms'], ['FIRST FLOOR', 'Non-AC Rooms', '04 rooms'], ['GROUND FLOOR', 'Restaurant · G1', 'Dining']].map((floor) => <div className="floor-row" key={floor[0]}><span>{floor[0]}</span><strong>{floor[1]}</strong><small>{floor[2]}</small></div>)}</div><div className="room-grid"><article className="room-card"><div className="room-image"><Image src="/garuda-room.png" alt="Comfortable AC room at Garuda" fill /></div><div className="room-body"><div><p className="eyebrow">04 ROOMS / SECOND FLOOR</p><h3>AC rooms</h3></div><p>Cool, calm and considered. A comfortable base for your stay in Sathupally.</p><button className="text-button" onClick={() => setBooking('room')}>Request an AC room <ArrowRight data-icon="inline-end" /></button></div></article><article className="room-card"><div className="room-image room-image-warm"><Image src="/garuda-dining.png" alt="Warm interior detail representing a Non-AC room" fill /></div><div className="room-body"><div><p className="eyebrow">04 ROOMS / FIRST FLOOR</p><h3>Non-AC rooms</h3></div><p>Simple, restful and welcoming. Everything you need for an easy night&apos;s stay.</p><button className="text-button" onClick={() => setBooking('room')}>Request a Non-AC room <ArrowRight data-icon="inline-end" /></button></div></article></div></div></section>

      <section className="section menu-section" id="menu"><div className="page-shell"><div className="section-heading"><div><p className="eyebrow">04 / FROM THE KITCHEN</p><h2>A little taste<br /><em>of Garuda.</em></h2></div><p>Sample dishes shown for direction. Menu items and prices are editable content and can be replaced with your final menu.</p></div><div className="category-tabs" role="tablist">{categories.map((category) => <button key={category} className={activeCategory === category ? 'category-tab active' : 'category-tab'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="menu-list">{filteredMenu.map((item) => <article className="menu-item" key={item.name}><div><span className="menu-category">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p></div><span className="menu-price">{item.price}</span></article>)}</div></div></section>

      <section className="gallery-section" id="gallery"><div className="page-shell"><div className="section-heading"><div><p className="eyebrow eyebrow-light">05 / A GLIMPSE INSIDE</p><h2>Come as you are.<br /><em>Stay awhile.</em></h2></div><p>A peek at the food, tables and rooms that make Garuda feel like a place to return to.</p></div><div className="gallery-grid">{gallery.map((image, index) => <div className={`gallery-item gallery-${index + 1}`} key={image.src}><Image src={image.src} alt={image.alt} fill /><span>{image.label}</span></div>)}</div></div></section>

      <section className="section location-section" id="contact"><div className="page-shell location-grid"><div><p className="eyebrow">06 / FIND GARUDA</p><h2>Good things<br /><em>are close by.</em></h2><p className="location-copy">Main Road, Beside GV Mall,<br />Sathupally, Telangana 507303,<br />India</p><div className="contact-lines"><a href="tel:XXXXXXXXXX"><Phone /> XXXXXXXXXX</a><a href="mailto:hello@garudarestaurant.com"><Send /> hello@garudarestaurant.com</a><span><Clock3 /> Opening hours — editable placeholder</span></div><div className="location-actions"><a className="button button-dark" href={mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps <ArrowRight data-icon="inline-end" /></a><button className="button button-outline-dark" onClick={() => setBooking('table')}>Book a table</button></div></div><div className="map-card"><div className="map-grid-lines" /><div className="map-pin"><MapPin /></div><div className="map-label"><strong>GARUDA</strong><span>SATHUPALLY / TELANGANA</span></div></div></div></section>

      <footer className="footer"><div className="page-shell footer-grid"><div><Logo /><p className="footer-tagline">Indian restaurant & rooms.<br />Flavours. Comfort. Hospitality.</p></div><div><p className="footer-label">Explore</p><a href="#menu">Menu</a><a href="#rooms">Rooms</a><a href="#tables">Tables</a><a href="#gallery">Gallery</a></div><div><p className="footer-label">Visit</p><p>Main Road, Beside GV Mall<br />Sathupally, Telangana 507303</p><a href={mapsUrl} target="_blank" rel="noreferrer">Get directions <ArrowRight /></a></div><div><p className="footer-label">Make a request</p><button className="footer-link" onClick={() => setBooking('table')}>Book a table <ArrowRight /></button><button className="footer-link" onClick={() => setBooking('room')}>Book a room <ArrowRight /></button><a className="social-link" href="#contact"><Sparkles /> Instagram</a></div></div><div className="page-shell footer-bottom"><span>© 2026 Garuda. All rights reserved.</span><span>Content marked editable can be replaced with final details.</span></div></footer>
      <BookingModal type={booking} onClose={() => setBooking(null)} />
    </main>
  )
}
