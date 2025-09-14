'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';
import { useCart } from '@/context/CartContext';
import ProductQuickViewModal from '@/app/components/ProductQuickViewModal';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/product';
import LazyLoader from '@/components/ui/LazyLoader';
import Footer from '@/components/Footer';

export default function FragrancePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const country = useCountry();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products?page=Fragrance')
      .then(res => res.json())
      .then(data => {
        console.log('API DATA:', data);
        // Add hover images for each product and ensure proper type conversion
        const updatedData = data.map((product: any, index: number) => {
          const images = ['/product1.jpg', '/product2.jpg', '/product3.jpg', '/product4.jpg'];
          const nextIndex = (index + 1) % images.length;
          return {
            ...product,
            id: (product._id || product.id || '').toString(), // Ensure id is a string
            image: images[index % images.length],
            hoverImage: images[nextIndex]
          };
        });
        setProducts(updatedData);
        setLoading(false);
      });
  }, []);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[80vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Fragrance Hero"
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
            LUXURY FRAGRANCES
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Discover our collection of exquisite scents
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-light mb-6">SIGNATURE COLLECTION</h2>
          <p className="text-gray-600">
            Each fragrance is carefully crafted using the finest ingredients from around the world,
            creating unique and memorable scents that leave a lasting impression.
          </p>
        </motion.div>

        {/* Fragrance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center"><LazyLoader /></div>
          ) : products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No fragrances found.</p>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={(product as any)._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 hover:-translate-y-1"
              >
                {/* Product Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium tracking-wider">
                    {product.category || 'Fragrance'}
                  </span>
                </div>

                <Link href={`/product/${(product as any)._id || product.id}`}>
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
                      {formatPrice(product.price, country)}
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl font-light mb-6">DISCOVER YOUR SIGNATURE SCENT</h3>
          <Link
            href="/quiz"
            className="inline-block bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            TAKE THE QUIZ
          </Link>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
      />
      <Footer />
    </div>
  );
} 