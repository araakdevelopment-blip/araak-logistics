import React from 'react';

export const AraakHeaderLogo = () => (
  <svg width="160" height="50" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="araak-logo transition-transform duration-200 hover:scale-105">
    {/* رمز الجناح الانسيابي السفلي */}
    <path d="M10 22C25 22 35 28 48 24C40 28 25 30 10 22Z" fill="#F3CA40" />
    {/* رمز الجناح الرئيسي الفيروزي */}
    <path d="M12 15C28 12 42 16 55 22C42 18 26 18 12 15Z" fill="#009695" />
    {/* الحرف الحركي K المتداخل */}
    <path d="M45 12H52L40 25L55 40H47L35 25L45 12Z" fill="#F3CA40" />
    <path d="M32 12H38V40H32V12Z" fill="#009695" />
    
    {/* النصوص المرافقة باللغة العربية والإنجليزية */}
    <text x="65" y="24" fill="#009695" fontFamily="sans-serif" fontSize="14" fontWeight="bold">أراك</text>
    <text x="95" y="24" fill="#F3CA40" fontFamily="sans-serif" fontSize="14" fontWeight="bold">لوجستيك</text>
    <text x="65" y="38" fill="#009695" fontFamily="sans-serif" fontSize="10" letterSpacing="1">ARAAK</text>
    <text x="105" y="38" fill="#F3CA40" fontFamily="sans-serif" fontSize="10" letterSpacing="1">LOGISTIC</text>
  </svg>
);


export const AraakChatAvatar = () => (
  <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* الرمز الفيروزي والأصفر مفرغ ودائري ليناسب الشات */}
    <circle cx="25" cy="25" r="24" fill="#4A4A4A" opacity="0.05" />
    <path d="M5 22C18 22 25 27 35 24C28 27 18 28 5 22Z" fill="#F3CA40" />
    <path d="M7 16C20 13 32 17 42 22C32 18 19 18 7 16Z" fill="#009695" />
    <path d="M35 14H40L30 25L42 36H36L26 25L35 14Z" fill="#F3CA40" />
    <path d="M24 14H29V36H24V14Z" fill="#009695" />
  </svg>
);


export const AraakFooterLogo = () => (
  <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* التكتل المركزي للشعار */}
    <g transform="translate(65, 5)">
      <path d="M5 22C18 22 25 27 35 24C28 27 18 28 5 22Z" fill="#F3CA40" />
      <path d="M7 16C20 13 32 17 42 22C32 18 19 18 7 16Z" fill="#009695" />
      <path d="M35 14H40L30 25L42 36H36L26 25L35 14Z" fill="#F3CA40" />
      <path d="M24 14H29V36H24V14Z" fill="#009695" />
    </g>
    {/* اسم الكيان أسفل الرمز */}
    <text x="100" y="55" textAnchor="middle" fill="#009695" fontFamily="sans-serif" fontSize="16" fontWeight="bold">أراك <tspan fill="#F3CA40">لوجستيك</tspan></text>
    <text x="100" y="72" textAnchor="middle" fill="#009695" fontFamily="sans-serif" fontSize="11" letterSpacing="2">ARAAK <tspan fill="#F3CA40">LOGISTIC</tspan></text>
  </svg>
);