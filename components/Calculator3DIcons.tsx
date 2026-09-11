import React from 'react';

interface IconProps {
  className?: string;
}

// 1. 3D Studio Loft Cube
export const Studio3DIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="st_top" x1="24" y1="4" x2="24" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="st_left" x1="6" y1="14" x2="24" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0369A1" />
        <stop offset="1" stopColor="#082F49" />
      </linearGradient>
      <linearGradient id="st_right" x1="24" y1="22" x2="42" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284C7" />
        <stop offset="1" stopColor="#0C4A6E" />
      </linearGradient>
      <linearGradient id="st_glass" x1="12" y1="20" x2="20" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0F2FE" stopOpacity="0.85" />
        <stop offset="1" stopColor="#7DD3FC" stopOpacity="0.3" />
      </linearGradient>
      <filter id="st_glow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Base Shadow */}
    <ellipse cx="24" cy="41" rx="16" ry="4" fill="#021526" fillOpacity="0.6" />
    {/* Left Face */}
    <path d="M6 15L24 24V40L6 31V15Z" fill="url(#st_left)" />
    {/* Right Face */}
    <path d="M24 24L42 15V31L24 40V24Z" fill="url(#st_right)" />
    {/* Top Face */}
    <path d="M24 6L42 15L24 24L6 15L24 6Z" fill="url(#st_top)" />
    {/* Top Highlight Wire */}
    <path d="M24 6L42 15L24 24L6 15L24 6Z" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
    {/* Studio Glass Balcony Window on Left */}
    <path d="M10 20L20 25V33L10 28V20Z" fill="url(#st_glass)" />
    {/* Studio Light Accent Window on Right */}
    <rect x="27" y="22" width="6" height="8" rx="1" transform="skewY(-26)" fill="#BAE6FD" fillOpacity="0.9" filter="url(#st_glow)" />
    <rect x="35" y="26" width="3" height="8" rx="0.5" transform="skewY(-26)" fill="#38BDF8" fillOpacity="0.6" />
  </svg>
);

// 2. 3D 2-Pièces Modern Home
export const Home2P3DIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="h2_roof" x1="24" y1="4" x2="24" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F43F5E" />
        <stop offset="1" stopColor="#BE123C" />
      </linearGradient>
      <linearGradient id="h2_front" x1="8" y1="18" x2="40" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284C7" />
        <stop offset="1" stopColor="#075985" />
      </linearGradient>
      <linearGradient id="h2_side" x1="28" y1="18" x2="42" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0369A1" />
        <stop offset="1" stopColor="#082F49" />
      </linearGradient>
    </defs>
    {/* Drop shadow */}
    <ellipse cx="24" cy="42" rx="18" ry="4" fill="#021526" fillOpacity="0.6" />
    {/* Pitched Modern Roof */}
    <path d="M24 5L42 16L38 18L24 10L10 18L6 16L24 5Z" fill="url(#h2_roof)" />
    <path d="M24 5L42 16L24 10L6 16L24 5Z" stroke="rgba(255,255,255,0.35)" strokeWidth="0.75" />
    {/* Front facade */}
    <path d="M8 18L26 26V40L8 32V18Z" fill="url(#h2_front)" />
    {/* Right side facade */}
    <path d="M26 26L40 19V33L26 40V26Z" fill="url(#h2_side)" />
    {/* Architectural Windows */}
    <path d="M12 24L18 27V34L12 31V24Z" fill="#E0F2FE" fillOpacity="0.9" />
    <path d="M29 24L36 21V28L29 31V24Z" fill="#7DD3FC" fillOpacity="0.75" />
    {/* Door */}
    <path d="M19 32L24 34V40L19 38V32Z" fill="#0F172A" />
  </svg>
);

// 3. 3D 3-Pièces Urban Residence
export const Apartment3P3DIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ap3_top" x1="24" y1="4" x2="24" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
      <linearGradient id="ap3_left" x1="8" y1="12" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E40AF" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="ap3_right" x1="24" y1="16" x2="40" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#1E3A8A" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="43" rx="17" ry="3.5" fill="#021526" fillOpacity="0.6" />
    {/* Top Roof */}
    <path d="M24 6L39 13L24 19L9 13L24 6Z" fill="url(#ap3_top)" />
    <path d="M24 6L39 13L24 19L9 13L24 6Z" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
    {/* Left Wall */}
    <path d="M9 13L24 19V42L9 36V13Z" fill="url(#ap3_left)" />
    {/* Right Wall */}
    <path d="M24 19L39 13V36L24 42V19Z" fill="url(#ap3_right)" />
    {/* Precision Windows Left */}
    <rect x="12" y="19" width="3.5" height="3" rx="0.5" transform="skewY(22)" fill="#FFFFFF" fillOpacity="0.9" />
    <rect x="18" y="22" width="3.5" height="3" rx="0.5" transform="skewY(22)" fill="#FFFFFF" fillOpacity="0.9" />
    <rect x="12" y="27" width="3.5" height="3" rx="0.5" transform="skewY(22)" fill="#FFFFFF" fillOpacity="0.9" />
    <rect x="18" y="30" width="3.5" height="3" rx="0.5" transform="skewY(22)" fill="#FFFFFF" fillOpacity="0.9" />
    {/* Precision Windows Right */}
    <rect x="27" y="24" width="3.5" height="3" rx="0.5" transform="skewY(-22)" fill="#93C5FD" fillOpacity="0.9" />
    <rect x="33" y="21" width="3.5" height="3" rx="0.5" transform="skewY(-22)" fill="#93C5FD" fillOpacity="0.9" />
    <rect x="27" y="32" width="3.5" height="3" rx="0.5" transform="skewY(-22)" fill="#93C5FD" fillOpacity="0.9" />
    <rect x="33" y="29" width="3.5" height="3" rx="0.5" transform="skewY(-22)" fill="#93C5FD" fillOpacity="0.9" />
  </svg>
);

// 4. 3D 4-Pièces Executive Residence
export const Apartment4P3DIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ap4_top" x1="24" y1="4" x2="24" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="ap4_main" x1="6" y1="12" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0369A1" />
        <stop offset="1" stopColor="#0B1E33" />
      </linearGradient>
      <linearGradient id="ap4_glass" x1="16" y1="16" x2="32" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0F2FE" />
        <stop offset="1" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="44" rx="20" ry="3.5" fill="#021526" fillOpacity="0.6" />
    {/* Architectural Step Blocks */}
    <path d="M24 4L42 12L24 19L6 12L24 4Z" fill="url(#ap4_top)" />
    <path d="M24 4L42 12L24 19L6 12L24 4Z" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
    <path d="M6 12L24 19V42L6 35V12Z" fill="url(#ap4_main)" />
    <path d="M24 19L42 12V35L24 42V19Z" fill="#082F49" />
    {/* Executive Glass Terraces */}
    <path d="M10 18L22 23V27L10 22V18Z" fill="url(#ap4_glass)" fillOpacity="0.95" />
    <path d="M10 25L22 30V34L10 29V25Z" fill="url(#ap4_glass)" fillOpacity="0.95" />
    <path d="M26 24L38 18V22L26 28V24Z" fill="#7DD3FC" fillOpacity="0.8" />
    <path d="M26 31L38 25V29L26 35V31Z" fill="#7DD3FC" fillOpacity="0.8" />
  </svg>
);

// 5. 3D Swiss Luxury Villa 5p+
export const Villa5P3DIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vl_roof" x1="24" y1="3" x2="24" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DC2626" />
        <stop offset="1" stopColor="#881337" />
      </linearGradient>
      <linearGradient id="vl_front" x1="6" y1="18" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="vl_glass" x1="12" y1="22" x2="24" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <ellipse cx="24" cy="43" rx="20" ry="4" fill="#021526" fillOpacity="0.6" />
    {/* Swiss Villa Double Pitched Roof */}
    <path d="M24 4L44 15L24 22L4 15L24 4Z" fill="url(#vl_roof)" />
    <path d="M24 4L44 15L24 22L4 15L24 4Z" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
    {/* Villa Structure */}
    <path d="M5 16L24 23V41L5 34V16Z" fill="url(#vl_front)" />
    <path d="M24 23L43 16V34L24 41V23Z" fill="#94A3B8" />
    {/* Floor-to-ceiling glass windows */}
    <path d="M9 22L20 26V37L9 33V22Z" fill="url(#vl_glass)" fillOpacity="0.9" />
    <path d="M27 25L39 20V31L27 36V25Z" fill="#0284C7" fillOpacity="0.7" />
    {/* Glass Mullions */}
    <line x1="14.5" y1="24" x2="14.5" y2="35" stroke="rgba(255,255,255,0.8)" strokeWidth="0.75" />
    <line x1="9" y1="28" x2="20" y2="32" stroke="rgba(255,255,255,0.8)" strokeWidth="0.75" />
  </svg>
);

// 6. 3D Living Room (Salon & Séjour)
export const Salon3DIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sf_top" x1="16" y1="4" x2="16" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="sf_cushion" x1="6" y1="12" x2="26" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0369A1" />
        <stop offset="1" stopColor="#0C4A6E" />
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="27" rx="12" ry="2.5" fill="#021526" fillOpacity="0.5" />
    {/* Sofa Backrest */}
    <path d="M6 10C6 8.89543 6.89543 8 8 8H24C25.1046 8 26 8.89543 26 10V18H6V10Z" fill="url(#sf_top)" />
    {/* Sofa Armrests */}
    <rect x="4" y="12" width="4" height="11" rx="2" fill="#0284C7" />
    <rect x="24" y="12" width="4" height="11" rx="2" fill="#0284C7" />
    {/* Seat Cushions */}
    <rect x="8" y="14" width="16" height="9" rx="1.5" fill="url(#sf_cushion)" />
    <line x1="16" y1="14" x2="16" y2="23" stroke="#0284C7" strokeWidth="1" />
    {/* Minimal Metallic Legs */}
    <rect x="6" y="24" width="1.5" height="3" rx="0.5" fill="#CBD5E1" />
    <rect x="24.5" y="24" width="1.5" height="3" rx="0.5" fill="#CBD5E1" />
  </svg>
);

// 7. 3D Bedroom (Chambres & Bureau)
export const Chambre3DIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bd_head" x1="16" y1="4" x2="16" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818CF8" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="bd_sheet" x1="6" y1="14" x2="26" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="27" rx="12" ry="2.5" fill="#021526" fillOpacity="0.5" />
    {/* Headboard */}
    <rect x="5" y="6" width="22" height="10" rx="2" fill="url(#bd_head)" />
    {/* Pillows */}
    <rect x="7" y="11" width="8" height="4" rx="1" fill="#E2E8F0" />
    <rect x="17" y="11" width="8" height="4" rx="1" fill="#E2E8F0" />
    {/* Mattress & Duvet */}
    <rect x="5" y="15" width="22" height="10" rx="1.5" fill="url(#bd_sheet)" />
    {/* Duvet fold accent */}
    <path d="M5 19H27V24C27 24.5523 26.5523 25 26 25H6C5.44772 25 5 24.5523 5 24V19Z" fill="#38BDF8" fillOpacity="0.85" />
  </svg>
);

// 8. 3D Kitchen (Cuisine & Électro)
export const Cuisine3DIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ck_front" x1="8" y1="5" x2="24" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="ck_door" x1="10" y1="16" x2="22" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0C4A6E" />
        <stop offset="1" stopColor="#0369A1" />
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="28" rx="10" ry="2" fill="#021526" fillOpacity="0.5" />
    {/* Fridge Appliance Tower */}
    <rect x="8" y="4" width="16" height="23" rx="2" fill="url(#ck_front)" />
    <rect x="8" y="4" width="16" height="23" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
    {/* Split Freezer / Fridge Doors */}
    <rect x="9.5" y="5.5" width="13" height="8" rx="1" fill="#075985" />
    <rect x="9.5" y="14.5" width="13" height="11" rx="1" fill="url(#ck_door)" />
    {/* Sleek Handles */}
    <rect x="10.5" y="8" width="1" height="3.5" rx="0.5" fill="#F8FAFC" />
    <rect x="10.5" y="16" width="1" height="5" rx="0.5" fill="#F8FAFC" />
  </svg>
);

// 9. 3D Storage (Cave, Garage & Divers)
export const Divers3DIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bx_top" x1="16" y1="4" x2="16" y2="14" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="bx_left" x1="4" y1="10" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#B45309" />
        <stop offset="1" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="bx_right" x1="16" y1="14" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D97706" />
        <stop offset="1" stopColor="#92400E" />
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="27" rx="11" ry="2.5" fill="#021526" fillOpacity="0.5" />
    {/* Isometric Moving Box */}
    <path d="M16 5L27 10L16 15L5 10L16 5Z" fill="url(#bx_top)" />
    <path d="M5 10L16 15V27L5 21V10Z" fill="url(#bx_left)" />
    <path d="M16 15L27 10V21L16 27V15Z" fill="url(#bx_right)" />
    {/* Reinforced Tape Line */}
    <path d="M14 6L25 11L23 12L12 7L14 6Z" fill="#FDE68A" fillOpacity="0.9" />
    <line x1="16" y1="15" x2="16" y2="27" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
    {/* Handle cutouts */}
    <rect x="8" y="15" width="4" height="1.5" rx="0.75" transform="skewY(22)" fill="#451A03" />
    <rect x="20" y="16.5" width="4" height="1.5" rx="0.75" transform="skewY(-22)" fill="#451A03" />
  </svg>
);

// 10. 3D Swiss Moving Truck
export const Truck3DIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tk_body" x1="6" y1="8" x2="34" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284C7" />
        <stop offset="1" stopColor="#075985" />
      </linearGradient>
      <linearGradient id="tk_cabin" x1="26" y1="14" x2="38" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    <ellipse cx="20" cy="34" rx="16" ry="3" fill="#021526" fillOpacity="0.6" />
    {/* Cargo Body */}
    <rect x="4" y="10" width="22" height="17" rx="2" fill="url(#tk_body)" />
    {/* Swiss Red Stripe on Cargo */}
    <rect x="4" y="18" width="22" height="3" fill="#EF4444" />
    {/* Cabin */}
    <path d="M26 14H33L37 20V27H26V14Z" fill="url(#tk_cabin)" />
    {/* Cabin Window */}
    <path d="M28 16H32L35 20H28V16Z" fill="#38BDF8" />
    {/* Wheels */}
    <circle cx="10" cy="28" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
    <circle cx="10" cy="28" r="1.5" fill="#E2E8F0" />
    <circle cx="31" cy="28" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
    <circle cx="31" cy="28" r="1.5" fill="#E2E8F0" />
  </svg>
);

// 11. 3D Swiss Shield Guarantee
export const Shield3DIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sh_grad" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="0.6" stopColor="#059669" />
        <stop offset="1" stopColor="#064E3B" />
      </linearGradient>
      <linearGradient id="sh_rim" x1="20" y1="3" x2="20" y2="37" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Shield Base */}
    <path d="M20 4L34 9V20C34 28.5 28 34.5 20 37C12 34.5 6 28.5 6 20V9L20 4Z" fill="url(#sh_grad)" />
    <path d="M20 4L34 9V20C34 28.5 28 34.5 20 37C12 34.5 6 28.5 6 20V9L20 4Z" stroke="url(#sh_rim)" strokeWidth="1.5" />
    {/* Swiss Cross in Shield */}
    <path d="M18 13H22V18H27V22H22V27H18V22H13V18H18V13Z" fill="#FFFFFF" />
  </svg>
);
