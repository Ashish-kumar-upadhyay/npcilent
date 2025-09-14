'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';
import { useCart } from '@/context/CartContext';
import LazyLoader from '@/components/ui/LazyLoader';
import Footer from '@/components/Footer';

export default function AllProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const country = useCountry();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: any) => {
    await addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LazyLoader /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[60vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="All Products Hero"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-light mb-6 font-playfair"
          >
            All Products
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Discover our complete collection of luxury fragrances
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product._id || product.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 hover:-translate-y-1"
              >
                {/* Product Badge */}
                {product.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium tracking-wider">
                      {product.isNew ? 'New Product' : product.isPopular ? 'Popular' : product.category}
                    </span>
                  </div>
                )}

                <Link href={`/product/${product._id || product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 cursor-pointer rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-105 p-4"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors duration-300" style={{ fontFamily: 'Didot, serif' }}>
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold text-black mb-4">
                      {typeof product.price === 'number'
                        ? formatPrice(product.price, country)
                        : product.price}
                    </p>
                  </div>
                </Link>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-black text-white py-3 text-sm rounded-full font-medium shadow-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 