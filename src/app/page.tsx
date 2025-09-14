'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useEffect, useState } from 'react'
import FeaturedProducts from './layout/home/FeaturedProducts'
import ProductReviews from '@/components/ProductReviews'
import { Playfair_Display } from 'next/font/google'
import Footer from '@/components/Footer'

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] })

export default function Home() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Primary Hero Section with Video */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 min-h-screen w-full object-cover"
        >
          <source src="/video/a.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-screen flex-col items-center justify-end text-center text-white px-4 pb-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-light text-white/95 max-w-3xl mx-auto leading-relaxed tracking-wide mb-12"
          >
            Explore our collection of luxury fragrances
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-semibold tracking-[0.2em] text-black bg-white/95 backdrop-blur-sm border border-white/20 transition-all duration-500 ease-out hover:bg-transparent hover:text-white hover:border-white/80 hover:backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent uppercase"
            >
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-white/95 transition-all duration-500 ease-out group-hover:bg-transparent"></div>
            </Link>
          </motion.div>
        </div>
      </div>


      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Brand Story Section */}
      <div className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[32px] mb-6" style={{ fontFamily: 'Didot, serif' }}>Our Story</h2>
              <p className="text-[15px] text-gray-600 mb-6">
                Discover the world of <span className="font-semibold text-black">Noamani-Fragrance</span>, where artistry meets luxury. Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection. Our fragrances are designed to evoke unforgettable emotions, leaving a signature impression of elegance and sophistication. Experience the essence of true luxury—crafted for those who desire distinction in every detail.
              </p>
              <Link
                href="/about"
                className="inline-block mt-4 text-gray-800 font-semibold border-b-2 border-gray-800 hover:text-black hover:border-black transition-colors transition-all duration-300 ease-in-out hover:scale-105 hover:shadow"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="relative aspect-square overflow-hidden w-full max-w-[400px] mx-auto rounded-2xl shadow-lg">
              <video
                src="/video/pv.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                poster="/ourstoryimg.png"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <ProductReviews />

      <Footer />
    </motion.div>
  )
}