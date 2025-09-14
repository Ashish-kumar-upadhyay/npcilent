"use client";

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Menu, ChevronDown, Globe, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart, CartProvider } from '@/context/CartContext'
import { useMobileMenu } from '@/context/MobileMenuContext'
import {
  ShoppingBagIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { LoginModal } from "@/components/LoginModal";
import { products } from "@/data/products";
import { Kolker_Brush, Italianno } from 'next/font/google';
import MegaMenu from './MegaMenu';

const kolker = Kolker_Brush({ weight: '400', subsets: ['latin'] });
const italianno = Italianno({ weight: '400', subsets: ['latin'] });

const navItems = [
  // { name: "Shop All", href: "/shop" },
  { name: "Bestsellers", href: "/bestsellers" },
  { name: "Fragrance", href: "/fragrance" },
  { name: "Recreations", href: "/product/recreations" },
  { name: "About Us", href: "/about" },
];

interface UserInfo {
  name: string;
  email: string;
}

interface AdminInfo {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  // All hooks at the top
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const isFixedNavPage = ["/shop", "/bestsellers", "/fragrance", "/about"].includes(pathname ?? "");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCountry") || "IN";
    }
    return "IN";
  });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const earthRef = useRef<HTMLDivElement>(null);
  const userEmailRef = useRef<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { showMobileMenu, setShowMobileMenu } = useMobileMenu();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const countryList = [
    { code: "US", flag: "/country_icon/America.jpg", label: "America" },
    { code: "EU", flag: "/country_icon/Europe.webp", label: "Europe" },
    { code: "ME", flag: "/country_icon/Middle-east.jpg", label: "Middle East" },
    { code: "IN", flag: "/country_icon/India.jpg", label: "India" }
  ];

  const radius = 48; // px, distance from globe

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Always scrolled style for /about/shipping, /product/recreations, and /shop
      if (
        pathname === '/about/shipping' ||
        pathname === '/product/recreations' ||
        pathname === '/shop'
      ) {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Call once on mount to set initial state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleProfileImgUpdate = () => {
    const userEmail = userEmailRef.current;
    if (userEmail) {
      const updatedImg = localStorage.getItem(`profileImg_${userEmail}`);
      setProfileImg(updatedImg || null);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdminInfo = localStorage.getItem("adminInfo");
      const storedUserInfo = localStorage.getItem("userInfo");
      let userEmail: string | null = null;
      if (storedAdminInfo) {
        setAdminInfo(JSON.parse(storedAdminInfo));
        setUserInfo(null);
        userEmail = JSON.parse(storedAdminInfo).email;
      } else if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
        setAdminInfo(null);
        userEmail = JSON.parse(storedUserInfo).email;
      }
      userEmailRef.current = userEmail;
      if (userEmail) {
        const storedImg = localStorage.getItem(`profileImg_${userEmail}`);
        setProfileImg(storedImg || null);
      } else {
        setProfileImg(null);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("profileImgUpdated", handleProfileImgUpdate);
    return () =>
      window.removeEventListener("profileImgUpdated", handleProfileImgUpdate);
  }, []);

  useEffect(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemsCount(count);
  }, [cart]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        earthRef.current &&
        !earthRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    }
    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountryDropdown]);

  useEffect(() => {
    const handleAdminLogout = () => {
      setAdminInfo(null);
      setUserInfo(null);
    };
    window.addEventListener("adminLogout", handleAdminLogout);
    return () => window.removeEventListener("adminLogout", handleAdminLogout);
  }, []);

  useEffect(() => {
    const handleUserLogin = () => {
      if (typeof window !== "undefined") {
        const storedAdminInfo = localStorage.getItem("adminInfo");
        const storedUserInfo = localStorage.getItem("userInfo");
        let userEmail: string | null = null;
        if (storedAdminInfo) {
          setAdminInfo(JSON.parse(storedAdminInfo));
          setUserInfo(null);
          userEmail = JSON.parse(storedAdminInfo).email;
        } else if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
          setAdminInfo(null);
          userEmail = JSON.parse(storedUserInfo).email;
        }
        userEmailRef.current = userEmail;
        if (userEmail) {
          const storedImg = localStorage.getItem(`profileImg_${userEmail}`);
          setProfileImg(storedImg || null);
        } else {
          setProfileImg(null);
        }
      }
    };
    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  useEffect(() => {
    if (showSearchModal) {
      setLoadingProducts(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          setAllProducts(data);
          setLoadingProducts(false);
        })
        .catch(() => setLoadingProducts(false));
    }
  }, [showSearchModal]);

  useEffect(() => {
    function handleClickOutsideUserDropdown(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutsideUserDropdown);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideUserDropdown);
    }
    return () => {
      if (typeof document !== 'undefined') {
      document.removeEventListener("mousedown", handleClickOutsideUserDropdown);
      }
    };
  }, [showDropdown]);

  // Function to truncate username
  const getTruncatedName = (name: string) => {
    if (name.length > 12) {
      return name.substring(0, 12) + "...";
    }
    return name;
  };

  // Early returns after all hooks
  if (!isMounted) return null;
  if (
    (pathname && pathname.startsWith("/admin")) ||
    (pathname && pathname.startsWith("/auth"))
  )
    return null;

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      await clearCart();
      localStorage.removeItem("adminInfo");
      setAdminInfo(null);
      setShowDropdown(false);
      router.push("/");
      toast.success("Logged out successfully", {
        icon: "👋",
        duration: 3000,
      });
    }
  };

  const handleUserLogout = async () => {
    if (typeof window !== "undefined") {
      await clearCart();
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      setShowDropdown(false);
      toast.success("Logged out successfully", {
        icon: "👋",
        duration: 3000,
      });
      router.push("/");
    }
  };

  const handleCountrySelect = (code: string) => {
    setSelectedCountry(code);
    localStorage.setItem("selectedCountry", code);
    setShowCountryDropdown(false);
    window.dispatchEvent(new Event("countryChange"));
    // TODO: Trigger price update globally if needed
  };

  // Add this function to handle requiring login for cart
  const handleRequireLogin = (item: any) => {
    setPendingCartItem(item);
    setShowLoginModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = allProducts.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
        (p.description &&
          p.description.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(results);
  };

  const handleProductClick = (productId: string) => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/product/${productId}`);
  };

  // Determine nav text color for submenu
  const navTextColor = (!isScrolled && !isMobileMenuOpen && !(pathname && pathname.startsWith("/product/"))) ? 'text-white' : 'text-black';
  const isProductUnscrolled = !!(pathname && pathname.startsWith("/product/") && !pathname.includes("recreations") && !isScrolled);

  return (
    <CartProvider onRequireLogin={handleRequireLogin}>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          pathname && pathname.startsWith("/product/")
            ? "bg-white shadow-sm"
            : pathname?.startsWith("/product/recreations")
            ? "bg-white"
            : pathname === "/about/shipping" || pathname === "/about/returns"
              ? "bg-white"
              : (isScrolled || isMobileMenuOpen)
              ? "bg-white shadow-sm"
              : "bg-black/30 backdrop-blur-md"
        )}
        initial={false}
        animate={{
          backgroundColor: (isScrolled || isMobileMenuOpen || 
            (pathname && pathname.startsWith("/product/")) ||
            pathname === "/about/shipping" || pathname === "/about/returns")
            ? "rgba(255, 255, 255, 1)"
            : "rgba(0, 0, 0, 0.3)",
          backdropFilter: (isScrolled || isMobileMenuOpen || 
            (pathname && pathname.startsWith("/product/")) ||
            pathname === "/about/shipping" || pathname === "/about/returns")
            ? "blur(0px)"
            : "blur(12px)",
          boxShadow: (isScrolled || isMobileMenuOpen || 
            (pathname && pathname.startsWith("/product/")))
            ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
            : "none",
          height: isScrolled ? "80px" : "auto"
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 100,
          damping: 25
        }}
      >
        <div
          className={cn(
            pathname === '/about/shipping'
              ? 'w-full pl-0 pr-0 bg-white'
              : pathname && pathname.startsWith("/product/")
              ? 'max-w-7xl mx-auto pl-0 pr-0'
              : 'max-w-7xl mx-auto pl-0 pr-0'
          )}
          style={pathname === '/about/shipping' ? { backgroundColor: '#fff', maxWidth: '100%', margin: 0 } : {}}
        >
          {/* Unscrolled: 2-row luxury hero, Scrolled: 1-row sticky */}
          {isScrolled ||
          (pathname && pathname.startsWith("/product/")) ||
          pathname === "/about/shipping" ||
          pathname === "/about/returns" ||
          pathname === "/about/faqs" ? (
            <div
              className="relative hidden md:flex items-center h-16 md:h-20 justify-between"
              style={{
                transition: "height 0.5s",
                alignItems: "center",
              }}
            >
              {/* Left side: Earth icon + Hamburger menu for product pages + Brand Name */}
              <div className="flex items-center">
                {/* Earth/Country Selector - moved to absolute left corner - Hidden on all recreations pages */}
                {!pathname?.startsWith("/product/recreations") && (
                  <div
                    className="flex items-center h-full mr-12 pl-4"
                    style={{ alignItems: "center", height: "100%", marginTop: 0, position: "absolute", left: 0 }}
                  >
                    <div
                      ref={earthRef}
                      className="relative flex items-center justify-center h-full"
                      style={{ width: 40, height: 40, marginTop: "0px" }}
                    >
                      <motion.button
                        className={cn(
                          "hover:opacity-90 transition-opacity",
                          !isScrolled &&
                            (pathname === "/shop/all" || pathname === "/shop/new")
                            ? "text-black"
                            : pathname &&
                              (pathname.startsWith("/product/") ||
                                pathname === "/about/shipping" ||
                                pathname === "/about/returns" ||
                                pathname === "/about/faqs")
                            ? "text-black"
                            : isScrolled || isMobileMenuOpen
                            ? "text-brand-dark"
                            : "text-white"
                        )}
                        aria-label="Select country"
                        style={{
                          position: "relative",
                          zIndex: 100,
                          background: "none",
                          border: "none",
                          padding: 0,
                          boxShadow: "none",
                        }}
                        onClick={() => setShowCountryDropdown((v) => !v)}
                        whileHover={{
                          scale: 1.12,
                          boxShadow: "0 0 32px 8px #00bfff, 0 0 0 6px #fff",
                        }}
                        whileTap={{ scale: 0.97 }}
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 8,
                          ease: "linear",
                        }}
                      >
                        <Globe
                          className="h-7 w-7"
                          style={{
                            color:
                              pathname &&
                              (pathname.startsWith("/product/") ||
                                pathname === "/about/shipping" ||
                                pathname === "/about/returns" ||
                                pathname === "/about/faqs")
                                ? "#000"
                                : isScrolled
                                ? "#000"
                                : "#fff",
                          }}
                        />
                      </motion.button>
                      <AnimatePresence>
                        {showCountryDropdown && (
                          <motion.div
                            className="absolute left-2 right-auto top-full flex items-center justify-center"
                            style={{
                              transform: "translateY(8px)",
                              pointerEvents: "auto",
                              zIndex: 200,
                            }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{
                              duration: 0.22,
                              type: "spring",
                              stiffness: 300,
                              damping: 22,
                            }}
                          >
                            <div
                              className="relative flex items-center justify-center"
                              style={{ width: 60, height: 60 }}
                            >
                              {countryList.map((country, i) => {
                                const angle =
                                  (i / countryList.length) * 2 * Math.PI -
                                  Math.PI / 2;
                                const radius = 18; // px, distance from center of circle (smaller)
                                const x = Math.cos(angle) * radius + 30; // offset for center (smaller)
                                const y = Math.sin(angle) * radius + 30;
                                return (
                                  <motion.img
                                    key={country.code}
                                    src={country.flag}
                                    alt={country.label}
                                    className="w-6 h-6 rounded-full shadow-lg cursor-pointer absolute"
                                    style={{
                                      left: x,
                                      top: y,
                                      zIndex: 101,
                                      pointerEvents: "auto",
                                      border:
                                        selectedCountry === country.code
                                          ? "2px solid #374151"
                                          : "2px solid #fff",
                                      background: "#fff",
                                      transform: "translate(-50%, -50%)",
                                    }}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 20,
                                      delay: 0.05 * i,
                                    }}
                                    onClick={() =>
                                      handleCountrySelect(country.code)
                                    }
                                    whileHover={{
                                      scale: 1.2,
                                      boxShadow: "0 0 20px #374151",
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
                {/* Hamburger menu - only show on recreation pages */}
                {pathname && pathname.startsWith("/product/recreations") && (
                  <button
                    onClick={() => setShowMobileMenu(true)}
                    className="flex flex-col items-center justify-center w-6 h-6 mr-6 hover:opacity-70 transition-opacity"
                    aria-label="Open menu"
                  >
                    <div className="w-4 h-0.5 bg-black mb-1"></div>
                    <div className="w-4 h-0.5 bg-black"></div>
                  </button>
                )}
                {/* Brand Name */}
                <motion.div
                  className="flex items-center flex-none w-auto ml-20"
                  style={{ alignSelf: "center", height: "100%" }}
                  animate={{
                    x: isScrolled ? 0 : 0,
                    scale: isScrolled ? 0.85 : 1,
                    opacity: isScrolled ? 1 : 1
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                >
                  <Link
                    href="/"
                    className={`transition-all duration-500 font-extrabold tracking-wider select-none ${italianno.className} ${
                      pathname === '/shop'
                        ? 'text-lg md:text-xl'
                        : 'text-2xl md:text-3xl'
                    }`}
                    style={{
                      letterSpacing: "0.08em",
                      color: "#000",
                    }}
                  >
                    Noamani
                  </Link>
                </motion.div>
              </div>
              {/* Nav Links (positioned to accommodate hamburger) */}
              {true && (
                <nav className="hidden md:flex flex-1 justify-center">
                  <ul
                    className={cn(
                      "flex items-center justify-between",
                      pathname && pathname.startsWith("/product/")
                        ? "w-full max-w-2xl ml-[-50px]"
                        : (isFixedNavPage || !isScrolled)
                        ? "w-full max-w-3xl"
                        : "w-full max-w-2xl"
                    )}
                  >
                    {navItems.map((item) => {
                      // Determine if this nav item should be white or black (same as text)
                      const isWhite = !isScrolled && !isMobileMenuOpen;
                      return (
                    <li
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => {
                        if (item.name !== "About Us" && item.name !== "Recreations") {
                          setActiveMenu(item.name);
                        } else {
                          setActiveMenu(null);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "text-lg tracking-wider py-2 transition-colors duration-200 flex items-center font-semibold",
                          pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                            ? "text-black"
                              : isWhite
                                ? "text-white"
                            : "text-black",
                          activeMenu === item.name
                            ? "font-bold"
                            : "font-semibold",
                          item.name === "About Us" &&
                            pathname === "/about" &&
                            "pointer-events-none opacity-70"
                        )}
                        style={{ fontFamily: 'Didot, serif', fontWeight: 'bold' }}
                      >
                          {/* Icon before nav text */}
                          {/* {item.name === 'Shop All' && <ShoppingBag size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {/* {item.name === 'Bestsellers' && <Star size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {/* {item.name === 'Fragrance' && <Droplets size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {/* {item.name === 'Recreations' && <Sparkles size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {/* {item.name === 'About Us' && <Info size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                        {item.name}
                      </Link>
                      {activeMenu === item.name && item.name !== "About Us" && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{
                            background:
                              pathname &&
                              (pathname.startsWith("/product/") ||
                                pathname === "/about/shipping" ||
                                pathname === "/about/returns" ||
                                pathname === "/about/faqs")
                                ? "#000"
                                : "#000",
                          }}
                          layoutId="underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </li>
                    );
                  })}
                </ul>
              </nav>
              )}
              {/* Right side icons (always positioned consistently) */}
              {(
                <div
                  className="flex flex-row items-center space-x-4 items-center absolute right-0 top-1/2 -translate-y-1/2"
                  style={{ alignItems: "center", height: "auto", right: "0px", paddingRight: "0px" }}
                >
                  <button
                    className={cn(
                      "hover:opacity-70 transition-opacity",
                      !isScrolled && (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname && (pathname.startsWith("/product/") || pathname === "/about/shipping" || pathname === "/about/returns" || pathname === "/about/faqs")
                          ? "text-black"
                          : isScrolled || isMobileMenuOpen
                            ? "text-brand-dark"
                            : "text-white"
                    )}
                    onClick={() => setShowSearchModal(true)}
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {adminInfo ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={cn(
                          "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                          isScrolled || isMobileMenuOpen
                            ? "text-brand-dark"
                            : "text-white"
                        )}
                      >
                        <UserCircleIcon className="h-6 w-6" />
                        <span>Admin</span>
                      </button>
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]">
                          <Link
                            href="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : userInfo ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={cn(
                          "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                          (pathname && pathname.startsWith("/product/"))
                            ? "text-black"
                            : isScrolled || isMobileMenuOpen
                            ? "text-brand-dark"
                            : "text-white"
                        )}
                      >
                        {profileImg && userInfo ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" style={{ color: (pathname && pathname.startsWith("/product/")) ? '#000' : (isScrolled ? '#000' : '#fff') }} />
                        )}
                        <span
                          className={`max-w-[80px] truncate text-sm font-medium ${(pathname && pathname.startsWith("/product/")) ? 'text-black' : (isScrolled ? 'text-brand-dark' : 'text-white')}`}
                        >
                          {getTruncatedName(userInfo.name)}
                        </span>
                      </button>
                      {showDropdown && (
                        <AnimatePresence>
                          <motion.div
                            key="user-dropdown"
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setShowDropdown(false);
                                router.push('/profile');
                              }}
                            >
                              Profile
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setShowDropdown(false);
                                router.push('/orders');
                              }}
                            >
                              Orders
                            </button>
                            <button
                              onClick={async () => {
                                setShowDropdown(false);
                                await handleUserLogout();
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={cn(
                        'hover:opacity-70 transition-opacity flex items-center space-x-2',
                        !isScrolled &&
                          (pathname === "/shop/all" || pathname === "/shop/new")
                          ? "text-black"
                          : pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                        ? "text-black"
                        : !isScrolled &&
                          pathname &&
                          !pathname.startsWith("/admin") &&
                          !pathname.startsWith("/auth")
                        ? "text-white"
                        : "text-black"
                      )}
                      aria-label="Login"
                    >
                      <User className="h-6 w-6" />
                    </button>
                  )}

                  <Link
                    href="/cart"
                    className={cn(
                      "hover:opacity-70 transition-opacity relative",
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : isScrolled || isMobileMenuOpen
                        ? "text-brand-dark"
                        : "text-white"
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full pt-6 pb-2 relative">
              {/* Brand Name (center, big) */}
              <motion.div 
                className="flex items-center justify-center w-full"
                animate={{
                  y: isScrolled ? -20 : 0,
                  scale: isScrolled ? 0.7 : 1
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 80,
                  damping: 25
                }}
              >
                {!isScrolled &&
                !(
                  pathname &&
                  (pathname.startsWith("/admin") ||
                    pathname.startsWith("/auth") ||
                    pathname.startsWith("/product/"))
                ) &&
                pathname === "/" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <Link
                      href="/"
                      className={`transition-all duration-700 font-extrabold tracking-wider select-none text-7xl md:text-9xl text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)] ${italianno.className}`}
                      style={{
                        letterSpacing: "0.08em",
                        color: "#fff",
                      }}
                    >
                      Noamani
                    </Link>
                  </motion.div>
                ) : !isScrolled &&
                !(
                  pathname &&
                  (pathname.startsWith("/admin") ||
                    pathname.startsWith("/auth") ||
                    pathname.startsWith("/product/"))
                ) ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Link
                      href="/"
                      className={`transition-all duration-700 font-extrabold tracking-wider select-none text-xl md:text-3xl text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)] ${italianno.className}`}
                      style={{
                        letterSpacing: "0.08em",
                        color: "#fff",
                      }}
                    >
                      Noamani
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ height: "100%" }}
                    animate={{
                      x: isScrolled ? -100 : 0,
                      scale: isScrolled ? 0.8 : 1
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "spring",
                      stiffness: 90,
                      damping: 22
                    }}
                  >
                    <Link
                      href="/"
                      className={`font-extrabold tracking-wider select-none text-2xl md:text-3xl transition-all duration-500 ${italianno.className}`}
                    >
                      Noamani
                    </Link>
                  </motion.div>
                )}
              </motion.div>
              {/* Nav Links and Right Icons in one row */}
              <div className="w-full flex flex-row items-center justify-between mt-5 relative hidden md:flex">
                {/* Nav Links: Centered below big brand name when not scrolled, normal row when scrolled */}
                <nav
                  className={cn(
                    "hidden md:flex flex-1",
                    !isScrolled &&
                      !(
                        pathname &&
                        (pathname.startsWith("/admin") ||
                          pathname.startsWith("/auth") ||
                          pathname.startsWith("/product/"))
                      ) &&
                      (pathname === "/shop/all" || pathname === "/shop/new")
                      ? "justify-center animate-fade-in-down"
                      : !isScrolled &&
                        !(
                          pathname &&
                          (pathname.startsWith("/admin") ||
                            pathname.startsWith("/auth") ||
                            pathname.startsWith("/product/"))
                        )
                      ? "justify-center animate-fade-in-down"
                      : "justify-start"
                  )}
                >
                  <ul
                    className={cn(
                      "flex items-center justify-between gap-8",
                      isScrolled ? "w-full max-w-2xl" : "w-full max-w-3xl"
                    )}
                  >
                    {navItems.map((item) => {
                      // Determine if this nav item should be white or black (same as text)
                      const isWhite = !isScrolled && !isMobileMenuOpen;
                      return (
                      <li
                        key={item.name}
                        className="relative group"
                        onMouseEnter={() => {
                          if (item.name !== "About Us" && item.name !== "Recreations") {
                            setActiveMenu(item.name);
                          } else {
                            setActiveMenu(null);
                          }
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "text-lg tracking-wider py-2 transition-colors duration-200 flex items-center font-semibold",
                            !isScrolled &&
                              (pathname === "/shop/all" ||
                                pathname === "/shop/new")
                              ? "text-black"
                              : !isScrolled &&
                                pathname &&
                                !pathname.startsWith("/admin") &&
                                !pathname.startsWith("/auth") &&
                                !pathname.startsWith("/product/")
                              ? "text-white"
                              : "text-black",
                            activeMenu === item.name
                              ? "font-bold"
                              : "font-semibold",
                            item.name === "About Us" &&
                              pathname === "/about" &&
                              "pointer-events-none opacity-70"
                          )}
                          style={{ fontFamily: 'Didot, serif', fontWeight: 'bold' }}
                        >
                            {/* Icon before nav text */}
                            {/* {item.name === 'Shop All' && <ShoppingBag size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                            {/* {item.name === 'Bestsellers' && <Star size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                            {/* {item.name === 'Fragrance' && <Droplets size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                            {/* {item.name === 'Recreations' && <Sparkles size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                            {/* {item.name === 'About Us' && <Info size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {item.name}
                        </Link>
                        {activeMenu === item.name &&
                          item.name !== "About Us" && (
                            <motion.div
                              className={cn(
                                "absolute bottom-0 left-0 right-0 h-0.5",
                                !isScrolled &&
                                  (pathname === "/shop/all" ||
                                    pathname === "/shop/new")
                                  ? "bg-black"
                                  : !isScrolled &&
                                    pathname &&
                                    !pathname.startsWith("/admin") &&
                                    !pathname.startsWith("/auth") &&
                                    !pathname.startsWith("/product/")
                                  ? "bg-white"
                                  : "bg-black"
                              )}
                              layoutId="underline"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                      </li>
                      );
                    })}
                  </ul>
                </nav>
                {/* Right side icons (aligned with nav links, spaced apart) */}
                <div className="flex flex-row items-center space-x-4 absolute right-0 top-1/2 -translate-y-1/2" style={{ right: "0px", paddingRight: "0px" }}>
                  <button
                    className={cn(
                      "hover:opacity-70 transition-opacity",
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : isScrolled || isMobileMenuOpen
                        ? "text-brand-dark"
                        : "text-white"
                    )}
                    onClick={() => setShowSearchModal(true)}
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {adminInfo ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={cn(
                          "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                          isScrolled || isMobileMenuOpen
                            ? "text-brand-dark"
                            : "text-white"
                        )}
                      >
                        <UserCircleIcon className="h-6 w-6" />
                        <span>Admin</span>
                      </button>
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]">
                          <Link
                            href="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" style={{ color: !isScrolled ? '#fff' : '#000' }} />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            key="user-dropdown"
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </Link>
                            <button
                              onClick={handleUserLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={cn(
                        'hover:opacity-70 transition-opacity flex items-center space-x-2',
                        !isScrolled &&
                          (pathname === "/shop/all" || pathname === "/shop/new")
                          ? "text-black"
                          : pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                        ? "text-black"
                        : !isScrolled &&
                          pathname &&
                          !pathname.startsWith("/admin") &&
                          !pathname.startsWith("/auth")
                        ? "text-white"
                        : "text-black"
                      )}
                      aria-label="Login"
                    >
                      <User className="h-6 w-6" />
                    </button>
                  )}

                  <Link
                    href="/cart"
                    className={cn(
                      "hover:opacity-70 transition-opacity relative",
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : isScrolled || isMobileMenuOpen
                        ? "text-brand-dark"
                        : "text-white"
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* MOBILE NAVBAR: Only this should remain for mobile (md:hidden) */}
          <div className="flex md:hidden w-full flex-row items-center justify-between h-14 px-2 gap-4">
            {isScrolled ? (
              // SCROLLED: ONLY NEW NAVBAR
              <>
                {/* Hamburger menu - only show on recreation pages */}
                {pathname && pathname.startsWith("/product/recreations") && (
                  <button
                    onClick={() => setShowMobileMenu(true)}
                    className={cn(
                      'transition-colors flex items-center',
                      'text-brand-dark'
                    )}
                    aria-label="Open menu"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                )}
                {/* Noamani brand */}
                <motion.div
                  initial={{ x: 0, scale: 1, filter: 'drop-shadow(0 8px 32px #37415199)' }}
                  animate={isScrolled
                    ? { x: 0, scale: 0.6, filter: 'drop-shadow(0 2px 8px #00000033)' }
                    : { x: 0, scale: 1, filter: 'drop-shadow(0 8px 32px #37415199)' }
                  }
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  className="flex items-center"
                  style={{ minWidth: 120 }}
                >
                <Link
                  href="/"
                    className={`select-none mx-2 ${italianno.className}`}
                    style={{
                      fontSize: isScrolled ? '2.2rem' : '5rem',
                      color: isScrolled ? '#222' : '#fff',
                      letterSpacing: '2px',
                      lineHeight: 1.1,
                      transition: 'font-size 0.4s cubic-bezier(0.23,1,0.32,1), color 0.4s',
                      textShadow: isScrolled
                        ? '0 1px 4px #fff8, 0 1px 1px #00000033'
                        : '0 8px 32px #37415199, 0 1px 1px #00000055',
                    }}
                >
                  Noamani
                </Link>
                </motion.div>
                {/* Rest of the icons */}
                <div className="flex flex-row items-center gap-3 ml-auto">
                  {/* Search button */}
                  <button
                    className="hover:opacity-70 transition-opacity text-brand-dark"
                    onClick={() => setShowSearchModal(true)}
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {/* User name (with avatar if available) */}
                  {userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" style={{ color: !isScrolled ? '#fff' : '#000' }} />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            key="user-dropdown"
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setShowDropdown(false);
                                router.push('/profile');
                              }}
                            >
                              Profile
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setShowDropdown(false);
                                router.push('/orders');
                              }}
                            >
                              Orders
                            </button>
                            <button
                              onClick={async () => {
                                setShowDropdown(false);
                                await handleUserLogout();
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="hover:opacity-70 transition-opacity text-brand-dark flex items-center"
                      aria-label="Login"
                    >
                      <User className="h-5 w-5" />
                    </button>
                  )}
                  {/* Cart icon */}
                  <Link
                    href="/cart"
                    className={cn(
                      'hover:opacity-70 transition-opacity relative',
                      (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            ) : (
              // NOT SCROLLED: ONLY OLD NAVBAR
              <>
                {/* Hamburger menu - only show on recreation pages */}
                {pathname && pathname.startsWith("/product/recreations") && (
                  <button
                    onClick={() => setShowMobileMenu(true)}
                    className={cn(
                      'transition-colors flex items-center',
                      (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                    )}
                    aria-label="Open menu"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                )}
                <div className="flex flex-row items-center gap-4 ml-auto">
                  {/* Search button - moved to right side */}
                  <button
                    className={cn(
                      'hover:opacity-70 transition-opacity',
                      (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                    )}
                    onClick={() => setShowSearchModal(true)}
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {/* User name (with avatar if available) */}
                  {userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" style={{ color: !isScrolled ? '#fff' : '#000' }} />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            key="user-dropdown"
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </Link>
                            <button
                              onClick={handleUserLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={cn(
                        'hover:opacity-70 transition-opacity flex items-center space-x-2',
                        !isScrolled &&
                          (pathname === "/shop/all" || pathname === "/shop/new")
                          ? "text-black"
                          : pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                        ? "text-black"
                        : !isScrolled &&
                          pathname &&
                          !pathname.startsWith("/admin") &&
                          !pathname.startsWith("/auth")
                        ? "text-white"
                        : "text-black"
                      )}
                      aria-label="Login"
                    >
                      <User className="h-6 w-6" />
                    </button>
                  )}
                  {/* Cart icon */}
                  <Link
                    href="/cart"
                    className={cn(
                      'hover:opacity-70 transition-opacity relative',
                      (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mega Menu */}
        <div className="relative">
          {activeMenu && activeMenu !== "About Us" && (
            <MegaMenu
              category={activeMenu}
              onClose={() => setActiveMenu(null)}
              onMouseEnter={() => {}}
              onMouseLeave={() => setActiveMenu(null)}
              textColor={navTextColor}
              isNavbarWhite={isScrolled || isMobileMenuOpen}
            />
          )}
        </div>

        {/* Login Modal */}
        <AnimatePresence>
          {showLoginModal && (
            <LoginModal onClose={() => setShowLoginModal(false)} />
          )}
        </AnimatePresence>

        {/* Search Modal */}
        {showSearchModal && (
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowSearchModal(false)}
          >
            <div
              className="fixed top-16 right-10 w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl flex items-center px-6 py-3 animate-slide-in-right border border-pink-200"
              style={{ zIndex: 1001 }}
              onClick={e => e.stopPropagation()}
            >
              <input
                type="text"
                className="flex-1 border-none outline-none bg-transparent text-lg px-3 py-2 placeholder-pink-400 text-gray-900"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                autoFocus
                style={{ minWidth: 0 }}
              />
              <button
                className="ml-2 text-gray-400 hover:text-pink-500"
                onClick={() => setShowSearchModal(false)}
                aria-label="Close search"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Results Dropdown */}
            {searchQuery && (
              <div className="fixed top-28 right-10 w-[90vw] max-w-sm bg-white rounded-xl shadow-xl mt-2 overflow-y-auto max-h-80 border border-pink-100 animate-fade-in-down" style={{ zIndex: 1002 }}>
                {loadingProducts && (
                  <div className="text-center text-gray-500 py-6">Loading products...</div>
                )}
                {!loadingProducts && searchQuery && searchResults.length === 0 && (
                  <div className="text-center text-gray-400 py-6">No products found.</div>
                )}
                {!loadingProducts && searchResults.length > 0 && (
                  <ul className="divide-y divide-gray-100">
                    {searchResults.map((product) => (
                      <li
                        key={product._id || product.id}
                        className="py-3 px-4 flex items-center gap-3 cursor-pointer hover:bg-pink-50 rounded-lg transition"
                        onClick={() => handleProductClick(product._id || product.id)}
                      >
                        <img
                          src={product.image || (product.images && product.images[0])}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md border"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate">{product.description}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Dior-style Simple Hamburger Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 bg-black/10" onClick={() => setShowMobileMenu(false)}>
            <motion.div
              className="bg-white w-72 min-h-screen h-full shadow-xl overflow-y-auto"
              onClick={e => e.stopPropagation()}
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Link href="/" className={`text-xl font-bold tracking-wider ${italianno.className}`} style={{ color: "#000" }}>
                  Noamani
                </Link>
                <button
                  className="p-1 hover:opacity-70 transition-opacity"
                  onClick={() => setShowMobileMenu(false)}
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 text-gray-800" />
                </button>
              </div>

              {/* Menu Content - Simple like Dior */}
              <div className="px-6 py-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Categories</h3>
                  
                  {/* Main Links - Simple */}
                  <Link 
                    href="/fragrance" 
                    className="block py-3 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Fragrance
                  </Link>
                  
                  <Link 
                    href="/product/recreations" 
                    className="block py-3 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Recreations
                  </Link>
                  
                  <Link 
                    href="/bestsellers" 
                    className="block py-3 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Bestsellers
                  </Link>

                  {/* Information Section */}
                  <div className="border-t border-gray-100 pt-4 mt-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Information</h3>
                    <Link href="/about" className="block py-3 text-sm text-gray-700 hover:text-gray-900 transition-colors" onClick={() => setShowMobileMenu(false)}>About Us</Link>
                    <Link href="/about/shipping" className="block py-3 text-sm text-gray-700 hover:text-gray-900 transition-colors" onClick={() => setShowMobileMenu(false)}>Shipping & Returns</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.header>
      <style jsx>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </CartProvider>
  );
}
