import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // SheetDB API URL
  const SHEETDB_URL = "https://sheetdb.io/api/v1/t5c1ic2cy8l6i";

  const handleSubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      // 1. Check for duplicate email
      const checkRes = await fetch(`${SHEETDB_URL}/search?email=${encodeURIComponent(email)}`);
      const checkData = await checkRes.json();
      if (Array.isArray(checkData) && checkData.length > 0) {
        setMessage("This email is already subscribed.");
        setLoading(false);
        return;
      }
      // 2. If not duplicate, add to sheet
      const res = await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [{ email }] }),
      });
      if (res.ok) {
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <footer className="w-full bg-white pt-16 pb-16 px-6 md:px-12 border-t border-gray-200 mt-20">
      {/* Newsletter Signup */}
      <div className="max-w-7xl mx-auto mb-12">
        <form onSubmit={handleSubscribe}>
          <div className="flex flex-col items-start gap-4 mb-4">
            <h2 className="text-xl font-serif text-black" style={{ fontFamily: 'Didot, serif', fontWeight: 500, letterSpacing: 0.8 }}>
              SIGN UP FOR EXCLUSIVITY
            </h2>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter an email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="px-4 py-3 border border-gray-300 bg-white text-gray-900 font-serif text-base focus:outline-none focus:border-gray-500 transition-colors duration-200 rounded-md"
                style={{ fontFamily: 'Didot, serif', width: '280px' }}
                required
                disabled={loading}
              />
              <button
                className="px-6 py-3 bg-gray-900 text-white font-serif text-base hover:bg-gray-700 transition-colors duration-200 focus:outline-none rounded-md"
                style={{ fontFamily: 'Didot, serif', letterSpacing: 1 }}
                type="submit"
                disabled={loading}
              >
                {loading ? "..." : "Confirm"}
              </button>
            </div>
          </div>
        </form>
        {message && (
          <div
            className={`mt-2 text-base font-serif px-4 py-2 rounded-full inline-block shadow-sm ${
              message.startsWith('Thank')
                ? 'bg-[#f8f5ef] text-[#bfa14a] border border-[#bfa14a]'
                : 'bg-[#fff0f0] text-[#d7263d] border border-[#d7263d]'
            }`}
            style={{ fontFamily: 'Didot, serif', letterSpacing: 1 }}
          >
            {message}
          </div>
        )}
      </div>
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-12">
        {/* Find a boutique */}
        <div>
          <h3 className="text-lg font-serif mb-6 text-black" style={{ fontFamily: 'Didot, serif', fontWeight: 400, letterSpacing: 0.5 }}>Find a boutique</h3>
          <ul className="space-y-3">
            <li><Link href="/find-a-boutique" style={{color: '#7B8487'}} className="footer-link">Noamani Perfumes Boutiques</Link></li>
            <li><Link href="/find-a-boutique" style={{color: '#7B8487'}} className="footer-link">Noamani Couture Boutiques</Link></li>
          </ul>
        </div>
        {/* Client Services */}
        <div>
          <h3 className="text-lg font-serif mb-6 text-black" style={{ fontFamily: 'Didot, serif', fontWeight: 400, letterSpacing: 0.5 }}>Client Services</h3>
          <ul className="space-y-3">
            <li><Link href="/customer-care/contact" style={{color: '#7B8487'}} className="footer-link">Contact us</Link></li>
            <li><Link href="/customer-care/returns" style={{color: '#7B8487'}} className="footer-link">Delivery & Returns</Link></li>
            <li><Link href="/customer-care/faqs" style={{color: '#7B8487'}} className="footer-link">FAQ</Link></li>
          </ul>
        </div>
        {/* Maison Noamani */}
        <div>
          <h3 className="text-lg font-serif mb-6 text-black" style={{ fontFamily: 'Didot, serif', fontWeight: 400, letterSpacing: 0.5 }}>Maison Noamani</h3>
          <ul className="space-y-3">
            <li><Link href="/maison-noamani" style={{color: '#7B8487'}} className="footer-link">Noamani Sustainability</Link></li>
            <li><Link href="/maison-noamani" style={{color: '#7B8487'}} className="footer-link">Ethics & Compliance</Link></li>
            <li><Link href="/maison-noamani" style={{color: '#7B8487'}} className="footer-link">Careers</Link></li>
          </ul>
        </div>
        {/* Legal */}
        <div>
          <h3 className="text-lg font-serif mb-6 text-black" style={{ fontFamily: 'Didot, serif', fontWeight: 400, letterSpacing: 0.5 }}>Legal</h3>
          <ul className="space-y-3">
            <li><Link href="/legal/terms" style={{color: '#7B8487'}} className="footer-link">Legal Terms</Link></li>
            <li><Link href="/legal/privacy" style={{color: '#7B8487'}} className="footer-link">Privacy Policy</Link></li>
            <li><Link href="/legal/general-sales-conditions" style={{color: '#7B8487'}} className="footer-link">General Sales Conditions</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section - All in one line */}
      <div className="max-w-7xl mx-auto pt-12">
        <div className="flex items-center justify-between py-6 border-t border-gray-200">
          {/* Left: Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-serif text-gray-600" style={{ fontFamily: 'Didot, serif' }}>Follow us :</span>
            <Link href="#" className="text-sm font-serif text-gray-600 hover:text-gray-800 transition-colors" style={{ fontFamily: 'Didot, serif' }}>Tiktok</Link>
            <Link href="#" className="text-sm font-serif text-gray-600 hover:text-gray-800 transition-colors" style={{ fontFamily: 'Didot, serif' }}>Instagram</Link>
            <Link href="#" className="text-sm font-serif text-gray-600 hover:text-gray-800 transition-colors" style={{ fontFamily: 'Didot, serif' }}>X</Link>
            <Link href="#" className="text-sm font-serif text-gray-600 hover:text-gray-800 transition-colors" style={{ fontFamily: 'Didot, serif' }}>Facebook</Link>
            <Link href="#" className="text-sm font-serif text-gray-600 hover:text-gray-800 transition-colors" style={{ fontFamily: 'Didot, serif' }}>Snapchat</Link>
          </div>
          
          {/* Center: NOAMANI */}
          <div className="text-4xl font-serif tracking-widest text-gray-900" style={{ fontFamily: 'Didot, serif', fontWeight: 400, letterSpacing: 8 }}>
            NOAMANI
          </div>
          
          {/* Right: Email */}
          <div className="text-sm font-serif text-gray-600" style={{ fontFamily: 'Didot, serif' }}>
            noamaniperfumes@gmail.com
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer-link {
          font-family: Didot, serif;
          color: #7b8487 !important;
          font-size: 0.85rem;
          font-weight: 300;
          letter-spacing: 0.2px;
          transition: color 0.2s;
          line-height: 1.8;
        }
        .footer-link:hover {
          color: #555 !important;
        }
      `}</style>
      <style jsx global>{`
        @media (max-width: 600px) {
          .footer-link {
            font-size: 1rem;
          }
          .max-w-lg > div {
            flex-direction: column;
            border-radius: 1.5rem;
          }
          .max-w-lg input {
            font-size: 1rem;
            padding: 0.7rem 1rem;
          }
          .max-w-lg button {
            width: 100%;
            margin-left: 0;
            margin-top: 0.5rem;
            border-radius: 1.5rem;
          }
        }
      `}</style>
    </footer>
  )
}
