'use client';
import { recreationsCatalogue } from '@/data/recreationsCatalogue';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Footer from '@/components/Footer';
import Tilt from 'react-parallax-tilt';

export default function RecreationProductPage({ params }: { params: { slug: string } }) {
  const product = recreationsCatalogue.find(p => p.slug === params.slug);
  if (!product) return notFound();

  // Get all unique fragrances for the current brand
  const brandFragrances = Array.from(new Set(
    recreationsCatalogue
      .filter(p => p.brand === product.brand)
      .flatMap(p => p.fragrances)
  ));

  const images = product.images && product.images.length > 0 ? product.images : ['/boxs.png'];
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedFragrance, setSelectedFragrance] = useState(brandFragrances[0] || '');
  const [selectedVolume, setSelectedVolume] = useState('100ml');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white py-10 px-2 md:px-12 flex flex-col md:flex-row gap-12 max-w-7xl mx-auto">
        {/* Left: Thumbnails + Main Image */}
        <div className="flex flex-col md:flex-row gap-8 md:w-1/2 md:items-center justify-center md:ml-[-20px]">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 md:mr-2">
            {images.map((img, idx) => (
              <button
                key={img+idx}
                className={`border-2 rounded-lg overflow-hidden w-16 h-16 flex items-center justify-center bg-white transition-all shadow-sm hover:shadow-lg ${selectedImg === idx ? 'ring-2 ring-pink-500 border-pink-500' : 'border-gray-200 hover:ring-2 hover:ring-gray-300'}`}
                onClick={() => setSelectedImg(idx)}
                aria-label={`Show image ${idx+1}`}
              >
                <Image src={img} alt={product.name + ' thumbnail'} width={64} height={64} className="object-contain w-full h-full" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full max-w-md aspect-square bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-gray-100">
            <Image
              src={images[selectedImg]}
              alt={product.name}
              width={400}
              height={400}
              className="object-contain w-full h-full drop-shadow-xl"
              priority
            />
          </div>
        </div>
        {/* Right: Product Details */}
        <div className="flex-1 max-w-xl mx-auto flex flex-col gap-6">
          <div className="uppercase text-xs tracking-widest font-semibold text-gray-500 mb-1">Inspired By</div>
          <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900 mb-1 tracking-tight uppercase leading-tight">{product.name}</h1>
          <div className="text-base font-semibold text-gray-700 mb-2 uppercase tracking-wider">{product.brand}</div>
          {/* Price moved below quantity */}
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-pink-600">Volume:</label>
              <div className="flex gap-4 mt-2">
                {['25ml', '50ml', '100ml'].map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setSelectedVolume(vol)}
                    className={`px-6 py-2 rounded-lg border text-base font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400
                      ${selectedVolume === vol ? 'border-gray-800 text-gray-900 bg-white shadow' : 'border-gray-300 text-gray-700 bg-white hover:border-pink-400'}`}
                  >
                    {vol.replace('ml', ' mL')}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-pink-600">Fragrance:</label>
              {/* Custom Dropdown Start */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className={`w-full flex justify-between items-center px-4 py-2 rounded-xl border-2 border-pink-400 bg-white/60 backdrop-blur-md shadow-lg font-semibold text-gray-900 transition-all focus:ring-2 focus:ring-pink-400 outline-none hover:border-gold-400 hover:shadow-2xl`}
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <span>{selectedFragrance || 'Select Fragrance'}</span>
                  <svg className={`ml-2 w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-full z-20 bg-white/80 backdrop-blur-xl border-2 border-pink-300 rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-fadeInDown" style={{top: '100%'}}>
                    {brandFragrances.map((f, i) => (
                      <button
                        key={f + i}
                        className={`w-full text-left px-4 py-2 font-medium transition-all hover:bg-pink-100 hover:text-pink-700 ${selectedFragrance === f ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-900'}`}
                        onClick={() => { setSelectedFragrance(f); setDropdownOpen(false); }}
                      >
                        {f}
                      </button>
                ))}
                  </div>
                )}
              </div>
              {/* Custom Dropdown End */}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Quantity:</span>
              <button onClick={()=>setQuantity(q=>Math.max(1,q-1))} className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold hover:bg-gray-100">-</button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button onClick={()=>setQuantity(q=>q+1)} className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold hover:bg-gray-100">+</button>
            </div>
          </div>
          {/* Price below quantity */}
          <div className="text-2xl font-bold text-pink-600 mb-4 tracking-wide">AED {product.price}</div>
          {/* Description Section Styled Like Main Product Page */}
          <div className="mt-8">
            <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-900 tracking-tight">Description</h2>
            <div className="h-1 w-16 bg-gray-200 rounded mb-4" />
            <p className="text-lg font-serif text-gray-700 leading-relaxed" style={{fontFamily: 'serif'}}>
              {product.name} is a luxurious recreation inspired by the original designer fragrance. Enjoy a long-lasting, elegant scent crafted for every occasion.
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {/* Removed Add to Cart and Buy It Now buttons as per request */}
          </div>
          {/* Removed Disclaimer and Shipping & Returns sections */}
        </div>
      </div>


      {/* Enhanced Product Gallery - 4 Product Images */}
      <div className="w-full max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 px-6 md:px-12 mb-16">
        {["/logo.png", "/productall.png", "/productnew.png", "/product1.jpg"].map((img: string, idx: number) => (
          <Tilt key={img} glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl group hover:scale-105 transition-transform duration-500 ease-in-out relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle at 60% 40%, #fffbe6 0%, #bfa14a22 80%, transparent 100%)' }}></div>
            <div className="w-full h-72 md:h-[340px] flex items-center justify-center z-10 relative">
              <Image
                src={img}
                alt={`Product grid image ${idx + 1}`}
                width={320}
                height={320}
                className="object-contain w-full h-full rounded-2xl"
                style={{ background: '#fff' }}
              />
            </div>
          </Tilt>
        ))}
      </div>

      {/* Why You'll Love It Section */}
      <section className="w-full max-w-6xl mx-auto my-20 flex flex-col items-center text-center py-16 px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-12 text-gray-900 tracking-tight relative inline-block">
          <span className="relative z-10">Why You'll Love It</span>
          <span className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-[#bfa14a] via-[#f7e7b4] to-[#bfa14a] rounded-full animate-pulse opacity-60" style={{zIndex:0}}></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          {[
            {icon:'💎',title:'Premium Ingredients',desc:'Crafted with the finest, globally sourced notes for a truly luxurious scent.'},
            {icon:'🕰️',title:'Long Lasting',desc:'Enjoy a fragrance that stays with you all day and into the night.'},
            {icon:'♻️',title:'Refillable Bottle',desc:'Eco-friendly, beautifully designed bottles you can refill again and again.'},
            {icon:'🌍',title:'Unisex Appeal',desc:'A scent designed to be loved by everyone, anytime, anywhere.'},
          ].map((f, i) => (
            <div key={f.title} className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden">
              <span className="text-5xl mb-4 animate-glow" style={{ textShadow: '0 0 16px #fffbe6,0 0 32px #bfa14a' }}>{f.icon}</span>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-transparent bg-clip-text animate-pulse">{f.title}</h3>
              <p className="text-gray-500 font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Noamani Range Section */}
      <section className="w-full max-w-7xl mx-auto mb-24 flex flex-col items-center py-14 px-6 md:px-12" style={{background: '#fcf8e5'}}>
        <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-10 text-center w-full relative inline-block text-gray-900 tracking-tight" style={{ fontFamily: 'Didot, serif' }}>
          <span className="relative z-10">The Noamani Range</span>
          <span className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-[#bfa14a] via-[#f7e7b4] to-[#bfa14a] rounded-full animate-pulse opacity-60" style={{zIndex:0}}></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-10 md:gap-0">
          {/* Left: Text + Button */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left px-4 md:pr-12 py-8 md:py-0">
            <p className="text-lg font-serif text-gray-700 leading-relaxed mb-8 max-w-md" style={{ fontFamily: 'serif' }}>
              Fragrances that are <span className="font-bold text-[#bfa14a]">powerful</span> and <span className="font-bold text-[#bfa14a]">noble</span> all at once: choose from the crisp & raw Eau de Noamani, the mysterious & sensual Eau de Parfum, the smoldering & fierce Parfum, and the rare & intoxicating Elixir.
            </p>
            <button className="bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 mt-4">
              Discover
            </button>
          </div>
          {/* Right: Video */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="shadow-2xl max-w-[500px] w-full rounded-[40px] overflow-hidden">
              <video
                src="/video/pv.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="object-contain w-full h-full rounded-2xl"
                style={{ borderRadius: '32px' }}
                poster="/newproduct-removebg-preview.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Prolong the Trail of Noamani with the Ritual Section */}
      <section className="w-full mb-16 flex flex-col items-center py-10 px-6 md:px-12" style={{background: '#fcf8e5'}}>
        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-10 text-center w-full relative inline-block text-gray-900 tracking-tight" style={{ fontFamily: 'Didot, serif' }}>
          <span className="relative z-10">Prolong the Trail of Noamani with the Ritual:</span>
          <span className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-[#bfa14a] via-[#f7e7b4] to-[#bfa14a] rounded-full animate-pulse opacity-60" style={{zIndex:0}}></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4">
          {/* Step 1 */}
          <Tilt glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white/90 rounded-[40px] shadow-2xl flex flex-col items-center p-8 w-full md:w-[300px] h-[400px] gap-4 border-2 border-transparent hover:border-[3px] hover:border-[#bfa14a] transition-all duration-300 group bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white font-bold shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">01</span>
              <span className="text-4xl animate-bounce">🌅</span>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="text-lg md:text-xl font-black uppercase text-[#bfa14a] text-center mb-2 tracking-wider drop-shadow-lg bg-white/70 px-3 py-1 rounded-xl">
                Awaken the Senses
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#bfa14a] to-[#fffbe6] rounded-full mb-3"></div>
            </div>
            <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3] flex-1">
              <Image src="/product1.jpg" alt="Awaken the Senses" width={180} height={200} className="object-contain w-full h-full" />
            </div>
          </Tilt>
          {/* Step 2 */}
          <Tilt glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white/90 rounded-[40px] shadow-2xl flex flex-col items-center p-8 w-full md:w-[300px] h-[400px] gap-4 border-2 border-transparent hover:border-[3px] hover:border-[#bfa14a] transition-all duration-300 group bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white font-bold shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">02</span>
              <span className="text-4xl animate-bounce">💧</span>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="text-lg md:text-xl font-black uppercase text-[#bfa14a] text-center mb-2 tracking-wider drop-shadow-lg bg-white/70 px-3 py-1 rounded-xl">
                Prolong the Olfactory Experience
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#bfa14a] to-[#fffbe6] rounded-full mb-3"></div>
            </div>
            <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3] flex-1">
              <Image src="/newproduct-removebg-preview.png" alt="Prolong the Olfactory Experience" width={180} height={200} className="object-contain w-full h-full" />
            </div>
          </Tilt>
          {/* Step 3 */}
          <Tilt glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white/90 rounded-[40px] shadow-2xl flex flex-col items-center p-8 w-full md:w-[300px] h-[400px] gap-4 border-2 border-transparent hover:border-[3px] hover:border-[#bfa14a] transition-all duration-300 group bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white font-bold shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">03</span>
              <span className="text-4xl animate-bounce">✨</span>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="text-lg md:text-xl font-black uppercase text-[#bfa14a] text-center mb-2 tracking-wider drop-shadow-lg bg-white/70 px-3 py-1 rounded-xl">
                Spray Pulse Points
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#bfa14a] to-[#fffbe6] rounded-full mb-3"></div>
            </div>
            <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3] flex-1">
              <Image src="/productnew.png" alt="Spray Pulse Points" width={180} height={200} className="object-contain w-full h-full" />
            </div>
          </Tilt>
        </div>
      </section>

      {/* Product Reviews Section */}
      <div className="w-full bg-[#f8f5ef] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#bfa14a] mb-4" style={{ fontFamily: 'Didot, serif', fontWeight: 400, letterSpacing: 2 }}>
              Product Reviews
            </h2>
            <div className="w-20 h-1 bg-[#bfa14a] mx-auto rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {/* Review 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#bfa14a] to-[#d4b85a] rounded-full flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-lg">A</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-serif font-semibold text-gray-900" style={{ fontFamily: 'Didot, serif' }}>Aarav Kapoor</h4>
                  <p className="text-sm text-gray-600">Luxury Lifestyle Blogger</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#bfa14a] text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 font-serif leading-relaxed text-sm" style={{ fontFamily: 'Didot, serif' }}>
                "Noamani Fragrances offer pure luxury in a bottle. The scent is unique and long-lasting—my new signature!"
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#bfa14a] to-[#d4b85a] rounded-full flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-lg">I</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-serif font-semibold text-gray-900" style={{ fontFamily: 'Didot, serif' }}>Isabelle Laurent</h4>
                  <p className="text-sm text-gray-600">Fashion Editor</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#bfa14a] text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 font-serif leading-relaxed text-sm" style={{ fontFamily: 'Didot, serif' }}>
                "I get compliments every time I wear Noamani. The bottle design is stunning and the fragrance is unforgettable."
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#bfa14a] to-[#d4b85a] rounded-full flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-lg">O</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-serif font-semibold text-gray-900" style={{ fontFamily: 'Didot, serif' }}>Omar Al Farsi</h4>
                  <p className="text-sm text-gray-600">Perfume Collector</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#bfa14a] text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 font-serif leading-relaxed text-sm" style={{ fontFamily: 'Didot, serif' }}>
                "A true masterpiece! The notes are perfectly balanced and exude sophistication. Highly recommended."
              </p>
            </div>

            {/* Review 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#bfa14a] to-[#d4b85a] rounded-full flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-lg">S</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-serif font-semibold text-gray-900" style={{ fontFamily: 'Didot, serif' }}>Sophia Rossi</h4>
                  <p className="text-sm text-gray-600">Beauty Influencer</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#bfa14a] text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 font-serif leading-relaxed text-sm" style={{ fontFamily: 'Didot, serif' }}>
                "The best fragrance I have ever owned. Elegant, luxurious, and makes me feel special every day."
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
} 