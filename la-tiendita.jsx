import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   LA TIENDITA — Tortillería · Restaurante · Mercado
   Ellisville, MO · Professional single-page website
   ═══════════════════════════════════════════════════════════════ */

/* ──────────── COLORS (matched from screenshot) ──────────── */
const C = {
  cream:     "#FAF3E8",
  cardBg:    "#F2EBDF",
  white:     "#FFFFFF",
  darkRed:   "#8B1A1A",
  red:       "#C13B2A",
  olive:     "#2D5016",
  black:     "#1A1A1A",
  brown:     "#3D2B1F",
  warmGray:  "#6B5E53",
  lightGray: "#A89F94",
  divider:   "#D6CFC5",
  footerBg:  "#1C1410",
  gold:      "#D4A853",
};

/* ──────────── IMAGES with Unsplash fallbacks ──────────── */
const IMG = {
  tacos:      "https://latiendita.lovable.app/assets/tacos-DnKXBbtC.jpeg",
  panDulce:   "https://latiendita.lovable.app/assets/pan-dulce-BhU5RugJ.jpeg",
  snacks:     "https://latiendita.lovable.app/assets/snacks-BydMfddE.jpeg",
  bar:        "https://latiendita.lovable.app/assets/interior-bar-o-TSLSeT.jpeg",
  storefront: "https://latiendita.lovable.app/assets/storefront-Dzn-cWs9.jpeg",
};
const FALLBACK = {
  tacos:      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
  panDulce:   "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
  snacks:     "https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=800&q=80",
  bar:        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
  storefront: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
};

/* ──────────── SAFE IMAGE COMPONENT ──────────── */
function Img({ src, fallback, alt, style, ...rest }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? undefined : currentSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (currentSrc === src && fallback) { setCurrentSrc(fallback); }
        else { setErr(true); }
      }}
      style={{
        display: "block", width: "100%", height: "100%", objectFit: "cover",
        background: err ? C.cardBg : undefined,
        ...style,
      }}
      {...rest}
    />
  );
}

/* ──────────── SCROLL REVEAL HOOK ──────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ══════════════════════ TRANSLATIONS ══════════════════════ */
const i18n = {
  es: {
    sub: "TORTILLERÍA · RESTAURANTE · MERCADO",
    nav_order: "ORDENAR",
    topbar_hours: "Mar–Sáb 9–8 · Dom 9–4",
    marquee: [
      "TORTILLAS DE MAÍZ FRESCAS CADA DÍA",
      "BIRRIA · BARBACOA · CARNE ASADA",
      "MENUDO LOS DOMINGOS",
      "TORTILLAS $3/LB",
      "MARGARITAS Y JARRITOS",
      "ELLISVILLE, MO",
    ],
    hero_label: "AUTÉNTICO · DESDE ELLISVILLE, MO",
    hero_h1_1: "EL SABOR DE MÉXICO,",
    hero_h1_2: "HECHO EN CASA",
    hero_h1_3: "cada día.",
    hero_p: "Tortillería tradicional, restaurante de cocina norteña y mercado mexicano — todo en un mismo lugar. Prensamos tortillas frescas todos los días y cocinamos con las recetas de la familia Hernandez.",
    hero_cta1: "ORDENAR EN LÍNEA",
    hero_cta2: "VER EL MENÚ",
    hero_rating_label: "EN GOOGLE",
    hero_quote: '"sabe a México de verdad" — clientes locales',
    badge_daily: "CADA DÍA", badge_price: "$3/LB",
    badge_birria_t: "Birria todos los días", badge_birria_b: "Tacos, ramen y nachos",
    badge_citypark_t: "Servimos CityPark", badge_citypark_b: "Tacos en el estadio 2023",
    badge_market_t: "Mercado completo", badge_market_b: "Chiles, masa, pan dulce",
    badge_google_t: "4.8 ★ Google", badge_google_b: "Cientos de reseñas",
    tres_label: "TRES CASAS, UN TECHO",
    tres_h2_1: "TRES NEGOCIOS.", tres_h2_2: "Una familia.",
    tres_p: "Una tortillería tradicional, un restaurante de cocina norteña y un mercado mexicano — todo en el mismo lugar, hecho con la misma pasión.",
    card1_num: "01 / TORTILLERÍA", card1_title: "Prensadas a diario",
    card1_desc: "Mezclamos masa y prensamos tortillas de maíz tradicionales cada mañana. Venta por libra y al mayoreo para los mejores restaurantes de St. Louis.",
    card2_num: "02 / RESTAURANTE", card2_title: "Cocina norteña",
    card2_desc: "Birria, barbacoa, carne asada, gorditas, tamales — servidos con frijoles charros y salsa de la casa, cortesía nuestra.",
    card3_num: "03 / MERCADO", card3_title: "La despensa de al lado",
    card3_desc: "Chiles secos, verdura fresca, camarón mexicano, antojitos importados, Jarritos — todo lo que necesita para cocinar en casa.",
    card_cta: "CONOCER MÁS",
    birria_label: "ESPECIALIDAD DE LA CASA",
    birria_h2_1: "BIRRIA", birria_h2_2: "todo el día,", birria_h2_3: "todos los días.",
    birria_p: "Trajimos la birria de tiempo completo a West County. Tacos dorados de birria con su consomé para sumergir, nachos de birria y nuestro famoso ramen de birria — servido de la apertura al cierre.",
    birria_cta1: "ORDENAR", birria_cta2: "MENÚ COMPLETO",
    test_label: "LO QUE DICEN",
    test_h2_1: "CIENTOS DE FAMILIAS,", test_h2_2: "una sola opinión.",
    test_rating: "en Google & Yelp",
    testimonials: [
      { text: "Las mejores tortillas de maíz en todo St. Louis. Saben igual que las de mi abuela en México. La birria es espectacular.", name: "María G.", src: "Google" },
      { text: "Por fin un lugar auténtico en West County. El menudo del domingo es la receta tradicional, sin atajos. Zeus y Eva tratan a todos como familia.", name: "Carlos R.", src: "Google" },
      { text: "Los tacos de carne asada son increíbles — y las tortillas se hacen frescas justo ahí. También compré chiles secos y pan dulce. Todo en un solo lugar.", name: "Jennifer M.", src: "Yelp" },
      { text: "Compro mis tortillas aquí cada semana. $3 la libra, calientitas, recién hechas. El servicio en el restaurante es de primera.", name: "Andrés P.", src: "Google" },
    ],
    order_label: "ORDENE EN LÍNEA",
    order_h3_1: "PARA LLEVAR, PARA LA FAMILIA,", order_h3_2: "listo cuando llegue.",
    order_p: "Ordene por DoorDash, Uber Eats o llámenos directamente. Tortillas frescas por libra también disponibles para llevar.",
    order_call: "LLAMAR",
    story_label: "NUESTRA HISTORIA",
    story_h2_1: "DE UNA PRENSA DE TORTILLAS", story_h2_2: "al estadio CityPark.",
    story_p: "Negocio operado por Zeus Hernandez — Oficial de Recursos Escolares de la comunidad — y su esposa Eva Hernandez. La Tiendita abrió para llenar el vacío de una verdadera tortillería en West County. En 2023, nuestros tacos llegaron al estadio CityPark, y regresamos a casa para crecer: agregamos un comedor amplio, un bar hecho a la medida y servicio a la mesa que se siente como familia.",
    stat1_label: "CALIFICACIÓN GOOGLE", stat2_label: "TORTILLAS FRESCAS", stat3_label: "DÍAS DE MASA FRESCA",
    visit_h2_1: "PASE A VERNOS.", visit_h2_2: "Mi casa, su casa.",
    visit_addr: "15821 Manchester Rd · Ellisville, MO 63011",
    visit_hours: "Mar–Sáb 9–8 · Dom 9–4 · Lunes cerrado",
    visit_call: "LLAMAR 636-220-6422", visit_dir: "CÓMO LLEGAR",
    footer_desc: "Negocio familiar de Zeus y Eva Hernandez. Prensamos tortillas de maíz frescas cada día y servimos la auténtica cocina norteña aquí en West County, St. Louis.",
    footer_visit: "VISÍTANOS", footer_hours_title: "HORARIO",
    footer_h1: "Mar–Sáb · 9 AM – 8 PM", footer_h2: "Domingo · 9 AM – 4 PM", footer_h3: "Lunes · Cerrado",
    footer_order: "ORDENAR EN LÍNEA",
    footer_copy: "© 2026 LA TIENDITA · HECHO CON MASA Y AMOR",
    mobile_call: "LLAMAR AHORA", mobile_dir: "DIRECCIONES",
  },
  en: {
    sub: "TORTILLERÍA · RESTAURANT · MARKET",
    nav_order: "ORDER",
    topbar_hours: "Tue–Sat 9–8 · Sun 9–4",
    marquee: [
      "FRESH CORN TORTILLAS DAILY",
      "BIRRIA · BARBACOA · CARNE ASADA",
      "MENUDO ON SUNDAYS",
      "TORTILLAS $3/LB",
      "MARGARITAS & JARRITOS",
      "ELLISVILLE, MO",
    ],
    hero_label: "AUTHENTIC · FROM ELLISVILLE, MO",
    hero_h1_1: "THE TASTE OF MEXICO,",
    hero_h1_2: "MADE AT HOME",
    hero_h1_3: "every day.",
    hero_p: "Traditional tortillería, Northern Mexican restaurant, and Mexican market — all under one roof. We press fresh tortillas daily and cook from the Hernandez family's recipes.",
    hero_cta1: "ORDER ONLINE",
    hero_cta2: "VIEW MENU",
    hero_rating_label: "ON GOOGLE",
    hero_quote: '"tastes like real Mexico" — local customers',
    badge_daily: "EVERY DAY", badge_price: "$3/LB",
    badge_birria_t: "Birria every day", badge_birria_b: "Tacos, ramen & nachos",
    badge_citypark_t: "We serve CityPark", badge_citypark_b: "Stadium tacos 2023",
    badge_market_t: "Full market", badge_market_b: "Chiles, masa, pan dulce",
    badge_google_t: "4.8 ★ Google", badge_google_b: "Hundreds of reviews",
    tres_label: "THREE HOUSES, ONE ROOF",
    tres_h2_1: "THREE BUSINESSES.", tres_h2_2: "One family.",
    tres_p: "A traditional tortillería, a Northern Mexican kitchen, and a Mexican market — all in the same place, made with the same passion.",
    card1_num: "01 / TORTILLERÍA", card1_title: "Pressed daily",
    card1_desc: "We mix masa and press traditional corn tortillas every morning. Sold by the pound and wholesale to the best restaurants in St. Louis.",
    card2_num: "02 / RESTAURANT", card2_title: "Northern kitchen",
    card2_desc: "Birria, barbacoa, carne asada, gorditas, tamales — served with charro beans and house salsa, on the house.",
    card3_num: "03 / MARKET", card3_title: "Your neighborhood pantry",
    card3_desc: "Dried chiles, fresh produce, Mexican shrimp, imported snacks, Jarritos — everything you need to cook at home.",
    card_cta: "LEARN MORE",
    birria_label: "HOUSE SPECIALTY",
    birria_h2_1: "BIRRIA", birria_h2_2: "all day,", birria_h2_3: "every day.",
    birria_p: "We brought full-time birria to West County. Golden birria tacos with consomé for dipping, birria nachos, and our famous birria ramen — served from open to close.",
    birria_cta1: "ORDER", birria_cta2: "FULL MENU",
    test_label: "WHAT THEY SAY",
    test_h2_1: "HUNDREDS OF FAMILIES,", test_h2_2: "one opinion.",
    test_rating: "on Google & Yelp",
    testimonials: [
      { text: "The best corn tortillas in all of St. Louis. They taste just like my grandma's in Mexico. The birria is spectacular.", name: "María G.", src: "Google" },
      { text: "Finally an authentic spot in West County. The Sunday menudo is the real deal, no shortcuts. Zeus and Eva treat everyone like family.", name: "Carlos R.", src: "Google" },
      { text: "The carne asada tacos are incredible — and the tortillas are made fresh right there. I also bought dried chiles and pan dulce. Everything in one place.", name: "Jennifer M.", src: "Yelp" },
      { text: "I buy my tortillas here every week. $3 a pound, warm, freshly made. The restaurant service is top-notch.", name: "Andrés P.", src: "Google" },
    ],
    order_label: "ORDER ONLINE",
    order_h3_1: "TO GO, FOR THE FAMILY,", order_h3_2: "ready when you arrive.",
    order_p: "Order via DoorDash, Uber Eats, or call us directly. Fresh tortillas by the pound also available for pickup.",
    order_call: "CALL",
    story_label: "OUR STORY",
    story_h2_1: "FROM A TORTILLA PRESS", story_h2_2: "to CityPark Stadium.",
    story_p: "Operated by Zeus Hernandez — a School Resource Officer — and his wife Eva Hernandez. La Tiendita opened to fill the void of a real tortillería in West County. In 2023, our tacos reached CityPark Stadium, and we came home to grow: we added a spacious dining room, a custom-built bar, and table service that feels like family.",
    stat1_label: "GOOGLE RATING", stat2_label: "FRESH TORTILLAS", stat3_label: "DAYS OF FRESH MASA",
    visit_h2_1: "COME SEE US.", visit_h2_2: "Mi casa, su casa.",
    visit_addr: "15821 Manchester Rd · Ellisville, MO 63011",
    visit_hours: "Tue–Sat 9–8 · Sun 9–4 · Monday closed",
    visit_call: "CALL 636-220-6422", visit_dir: "GET DIRECTIONS",
    footer_desc: "Family business of Zeus and Eva Hernandez. We press fresh corn tortillas every day and serve authentic Northern Mexican cuisine here in West County, St. Louis.",
    footer_visit: "VISIT US", footer_hours_title: "HOURS",
    footer_h1: "Tue–Sat · 9 AM – 8 PM", footer_h2: "Sunday · 9 AM – 4 PM", footer_h3: "Monday · Closed",
    footer_order: "ORDER ONLINE",
    footer_copy: "© 2026 LA TIENDITA · MADE WITH MASA & LOVE",
    mobile_call: "CALL NOW", mobile_dir: "DIRECTIONS",
  },
};

/* ══════════════════════ SVG ICONS ══════════════════════ */
const TranslateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8l6 0"/><path d="M4 5h8"/><path d="M8 5v1c0 2.5-2 5-4 6.5"/><path d="M6 11c1.3 1 3 2 5 2"/>
    <path d="M14 19l3-7 3 7"/><path d="M15 17h4"/>
  </svg>
);
const MenuIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>);
const XIcon = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const PhoneIcon = ({ s = 15 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const OrderIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>);
const ArrowUpRight = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>);
const ArrowRight = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const MapPinIcon = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const NavArrow = ({ s = 14 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 18.5l7.5-16 7.5 16-7.5-4-7.5 4z"/></svg>);
const StarIcon = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const InstagramIcon = ({ s = 16 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>);
const FacebookIcon = ({ s = 16 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);

/* ── Section label with line ── */
function SectionLabel({ children, center, color = C.lightGray, lineColor = C.divider }) {
  return (
    <div style={{ display: "flex", alignItems: center ? "center" : "center", justifyContent: center ? "center" : "flex-start", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 32, height: 1.5, background: lineColor }} />
      <span style={{ fontSize: 11, letterSpacing: 3.5, color, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>
      {center && <div style={{ width: 32, height: 1.5, background: lineColor }} />}
    </div>
  );
}

/* ── Heading component ── */
function Heading({ line1, line2, size = "clamp(1.8rem,4.5vw,2.8rem)", center }) {
  return (
    <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, lineHeight: 1.15, fontSize: size, textAlign: center ? "center" : "left" }}>
      <span style={{ color: C.black, display: "block" }}>{line1}</span>
      <em style={{ color: C.olive, fontWeight: 500, display: "block" }}>{line2}</em>
    </h2>
  );
}

/* ── Button styles ── */
const btn = {
  primary: { background: C.darkRed, color: "#fff", padding: "14px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2.5, borderRadius: 50, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textAlign: "center", justifyContent: "center", transition: "background .25s, transform .25s" },
  outline: { background: "transparent", color: C.black, padding: "13px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2.5, borderRadius: 50, border: `1.5px solid ${C.black}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textAlign: "center", justifyContent: "center", transition: "background .25s, color .25s, transform .25s" },
  outlineRed: { background: "transparent", color: C.red, padding: "13px 28px", fontSize: 13, fontWeight: 700, letterSpacing: 2.5, borderRadius: 50, border: `1.5px solid ${C.red}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, textAlign: "center", justifyContent: "center", transition: "background .25s, transform .25s" },
};

/* ══════════════════════ MAIN APP ══════════════════════ */
export default function LaTiendita() {
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = i18n[lang];

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const extLink = { target: "_blank", rel: "noopener noreferrer" };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: C.cream, color: C.black, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');
        html{scroll-behavior:smooth}
        @keyframes marq{0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}
        *{margin:0;padding:0;box-sizing:border-box}
        a{color:inherit;text-decoration:none}
        .w{max-width:1160px;margin:0 auto;padding:0 24px}
        .g-hero{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
        .g-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .g-photos{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .g-tests{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        .g-order{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
        .g-footer{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px}
        .hero-img-box{position:relative}
        .bdg-bot{position:absolute;bottom:-14px;left:-12px;display:flex;gap:8px;z-index:2}
        .bdg-right{position:absolute;top:16px;right:-10px;display:flex;flex-direction:column;gap:8px;z-index:2}
        .mbar{display:none;position:fixed;bottom:0;left:0;right:0;z-index:99}
        .mbar-pad{display:none;height:56px}
        .topbar-desk{display:flex}
        .btn-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
        .btn-row-h{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
        /* hover states */
        .card-lift{transition:transform .35s ease,box-shadow .35s ease}
        .card-lift:hover{transform:translateY(-5px);box-shadow:0 16px 44px rgba(0,0,0,.08)}
        .photo-zoom img{transition:transform .5s ease}
        .photo-zoom:hover img{transform:scale(1.06)}
        .btn-hover:hover{opacity:.88;transform:translateY(-1px)}
        /* mobile */
        @media(max-width:860px){
          .g-hero{grid-template-columns:1fr;gap:24px}
          .g-cards{grid-template-columns:1fr}
          .g-photos{grid-template-columns:1fr 1fr}
          .g-tests{grid-template-columns:1fr}
          .g-order{grid-template-columns:1fr}
          .g-footer{grid-template-columns:1fr;gap:24px;text-align:center}
          .bdg-bot,.bdg-right{position:static;flex-direction:row;flex-wrap:wrap;margin-top:10px;justify-content:center}
          .mbar{display:flex}
          .mbar-pad{display:block}
          .topbar-desk{display:none!important}
          .btn-row{flex-direction:column;align-items:stretch}
          .btn-row-h{flex-direction:row;justify-content:center}
          .hero-img-mobile{display:block!important}
          .g-footer>div{display:flex;flex-direction:column;align-items:center}
        }
        @media(min-width:861px){
          .hero-img-mobile{display:none!important}
        }
      `}</style>

      {/* ═══════════ TOP BAR (desktop) ═══════════ */}
      <div className="topbar-desk" style={{ background: C.cream, borderBottom: `1px solid ${C.divider}`, padding: "8px 24px", fontSize: 12, color: C.lightGray }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6, maxWidth: 1160, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPinIcon s={11}/> 15821 Manchester Rd, Ellisville, MO 63011</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ClockIcon/> {t.topbar_hours}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="https://instagram.com" {...extLink} style={{ color: C.lightGray }}><InstagramIcon s={13}/></a>
            <a href="https://facebook.com" {...extLink} style={{ color: C.lightGray }}><FacebookIcon s={13}/></a>
            <span style={{ color: C.divider }}>|</span>
            <a href="tel:+16362206422" style={{ color: C.darkRed, fontWeight: 600 }}>636-220-6422</a>
          </div>
        </div>
      </div>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav style={{ background: C.cream, padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72, position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${C.divider}` }}>
        <a href="#" style={{ lineHeight: 1.15 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800, color: C.darkRed, letterSpacing: 0.5 }}>LA TIENDITA</span>
          <span style={{ display: "block", fontSize: 9.5, letterSpacing: 2.5, color: C.lightGray, fontWeight: 500, marginTop: 1 }}>{t.sub}</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLang(l => l === "es" ? "en" : "es")} aria-label="Toggle language" style={{
            background: "transparent", border: `1px solid ${C.divider}`, color: C.brown,
            padding: "8px 14px", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif",
          }}>
            <TranslateIcon/> ES / EN
          </button>
          <a href="https://www.doordash.com/store/la-tiendita-ellisville" {...extLink} className="topbar-desk btn-hover" style={{
            background: C.red, color: "#fff", padding: "10px 24px", fontSize: 12,
            fontWeight: 700, letterSpacing: 2.5, display: "inline-flex", alignItems: "center",
          }}>
            {t.nav_order}
          </a>
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{
            background: "transparent", border: `1px solid ${C.divider}`, color: C.brown,
            padding: 10, cursor: "pointer", display: "none", alignItems: "center", justifyContent: "center",
          }} className="hero-img-mobile">
            <MenuIcon/>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: `${C.cream}f8`, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, backdropFilter: "blur(8px)" }}>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ position: "absolute", top: 18, right: 22, background: "none", border: "none", color: C.brown, cursor: "pointer" }}><XIcon/></button>
          {[
            { href: "#top", label: lang === "es" ? "Inicio" : "Home" },
            { href: "#tortilleria", label: "Tortillería" },
            { href: "#menu", label: lang === "es" ? "Menú" : "Menu" },
            { href: "#historia", label: lang === "es" ? "Historia" : "Our Story" },
            { href: "#visita", label: lang === "es" ? "Visítanos" : "Visit Us" },
          ].map((lnk, i) => (
            <a key={i} href={lnk.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: C.darkRed }}>{lnk.label}</a>
          ))}
          <a href="https://www.doordash.com/store/la-tiendita-ellisville" {...extLink} onClick={() => setMenuOpen(false)} style={{ ...btn.primary, marginTop: 10, padding: "14px 40px" }}>{t.nav_order}</a>
        </div>
      )}

      {/* ═══════════ MARQUEE ═══════════ */}
      <div style={{ background: C.red, overflow: "hidden", whiteSpace: "nowrap", padding: "12px 0" }}>
        <div style={{ display: "inline-block", animation: "marq 28s linear infinite", color: C.cream, fontSize: 13, letterSpacing: 3, fontWeight: 600 }}>
          {[0,1,2].map(r => t.marquee.map((m,i) => (
            <span key={`${r}-${i}`}><span style={{ color: C.gold, margin: "0 10px" }}>★</span>{m}<span style={{ display: "inline-block", width: 16 }}/></span>
          )))}
        </div>
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section id="top" style={{ background: C.cream, padding: "clamp(40px,8vw,80px) 24px clamp(56px,10vw,100px)" }}>
        <div className="w g-hero">
          <Reveal>
            <SectionLabel color={C.olive} lineColor={C.olive}>{t.hero_label}</SectionLabel>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, lineHeight: 1.08, marginBottom: 26 }}>
              <span style={{ fontSize: "clamp(2rem,5.5vw,3.5rem)", color: C.black, display: "block" }}>{t.hero_h1_1}</span>
              <span style={{ fontSize: "clamp(2rem,5.5vw,3.5rem)", color: C.darkRed, display: "block" }}>{t.hero_h1_2}</span>
              <em style={{ fontSize: "clamp(2.2rem,5.8vw,3.7rem)", color: C.olive, display: "block", fontWeight: 500 }}>{t.hero_h1_3}</em>
            </h1>
            <p style={{ color: C.warmGray, fontSize: 16.5, lineHeight: 1.75, maxWidth: 500, marginBottom: 36 }}>{t.hero_p}</p>
            <div className="btn-row" style={{ marginBottom: 18 }}>
              <a href="https://www.doordash.com/store/la-tiendita-ellisville" {...extLink} className="btn-hover" style={btn.primary}><OrderIcon/> {t.hero_cta1}</a>
              <a href="#menu" className="btn-hover" style={btn.outline}>{t.hero_cta2} <ArrowUpRight/></a>
            </div>
            <a href="tel:+16362206422" className="btn-hover" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.brown, fontSize: 15, fontWeight: 600, letterSpacing: 1, padding: "4px 0" }}>
              <PhoneIcon/> 636-220-6422
            </a>
          </Reveal>

          {/* Hero image — desktop */}
          <Reveal delay={0.15} style={{ position: "relative" }} className="hero-img-box">
            <div className="topbar-desk" style={{ display: "block" }}>
              <div style={{ width: "100%", aspectRatio: "4/5", overflow: "hidden", borderRadius: 6, border: `1px solid ${C.divider}` }}>
                <Img src={IMG.tacos} fallback={FALLBACK.tacos} alt="Tacos hechos con tortillas de maíz frescas"/>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
                <div style={{ background: `${C.gold}18`, padding: "7px 14px", display: "flex", alignItems: "center", gap: 5, borderRadius: 4 }}>
                  <span style={{ color: "#B8860B", fontWeight: 700, fontSize: 17 }}>4.8</span>
                  <StarIcon/><span style={{ color: C.lightGray, fontSize: 11.5 }}>{t.hero_rating_label}</span>
                </div>
                <p style={{ color: C.lightGray, fontSize: 12.5, fontStyle: "italic" }}>{t.hero_quote}</p>
              </div>
              <div className="bdg-bot">
                {[[t.badge_daily,t.badge_price],[t.badge_birria_t,t.badge_birria_b]].map(([top,bot],i)=>(
                  <div key={i} style={{ background: C.footerBg, padding: "10px 14px", minWidth: 108 }}>
                    <div style={{ color: C.gold, fontSize: 9.5, letterSpacing: 2, fontWeight: 600 }}>{top}</div>
                    <div style={{ color: C.cream, fontSize: 12.5, fontWeight: 500, marginTop: 2 }}>{bot}</div>
                  </div>
                ))}
              </div>
              <div className="bdg-right">
                {[[t.badge_market_t,t.badge_market_b],[t.badge_google_t,t.badge_google_b]].map(([top,bot],i)=>(
                  <div key={i} style={{ background: C.footerBg, padding: "9px 13px" }}>
                    <div style={{ color: C.gold, fontSize: 9.5, letterSpacing: 2, fontWeight: 600 }}>{top}</div>
                    <div style={{ color: "#aaa", fontSize: 11.5, marginTop: 2 }}>{bot}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero image — mobile */}
            <div className="hero-img-mobile" style={{ display: "none", marginTop: 8 }}>
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: 6, border: `1px solid ${C.divider}` }}>
                <Img src={IMG.tacos} fallback={FALLBACK.tacos} alt="Tacos de La Tiendita"/>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
                <div style={{ background: `${C.gold}18`, padding: "6px 12px", display: "flex", alignItems: "center", gap: 5, borderRadius: 4 }}>
                  <span style={{ color: "#B8860B", fontWeight: 700, fontSize: 16 }}>4.8</span>
                  <StarIcon/><span style={{ color: C.lightGray, fontSize: 11 }}>{t.hero_rating_label}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ THREE BUSINESSES ═══════════ */}
      <section id="tortilleria" style={{ padding: "clamp(48px,8vw,88px) 24px", background: C.cardBg }}>
        <div className="w">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <SectionLabel center>{t.tres_label}</SectionLabel>
              <Heading line1={t.tres_h2_1} line2={t.tres_h2_2} center/>
              <p style={{ color: C.warmGray, fontSize: 15.5, maxWidth: 540, margin: "14px auto 0", lineHeight: 1.7 }}>{t.tres_p}</p>
            </div>
          </Reveal>
          <div className="g-cards">
            {[
              { num: t.card1_num, title: t.card1_title, desc: t.card1_desc },
              { num: t.card2_num, title: t.card2_title, desc: t.card2_desc },
              { num: t.card3_num, title: t.card3_title, desc: t.card3_desc },
            ].map((c,i) => (
              <Reveal key={i} delay={i * 0.1}>
                <a href="#" className="card-lift" style={{ display: "block", background: C.white, color: C.black, padding: "34px 26px", border: `1px solid ${C.divider}` }}>
                  <div style={{ fontSize: 10.5, letterSpacing: 3, color: C.red, marginBottom: 14, fontWeight: 700 }}>{c.num}</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 23, fontWeight: 700, marginBottom: 10 }}>{c.title}</h3>
                  <p style={{ color: C.warmGray, lineHeight: 1.7, fontSize: 14.5, marginBottom: 22 }}>{c.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.darkRed, fontSize: 11.5, letterSpacing: 2, fontWeight: 700 }}>{c.cta || t.card_cta} <ArrowRight/></div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BIRRIA ═══════════ */}
      <section id="menu" style={{ background: C.cream, padding: "clamp(48px,8vw,88px) 24px" }}>
        <div className="w">
          <Reveal>
            <div style={{ maxWidth: 540, marginBottom: 40 }}>
              <SectionLabel color={C.red} lineColor={C.red}>{t.birria_label}</SectionLabel>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, lineHeight: 1.12, fontSize: "clamp(1.8rem,4.5vw,2.8rem)", marginBottom: 18 }}>
                <span style={{ color: C.darkRed, display: "block" }}>{t.birria_h2_1}</span>
                <em style={{ color: C.olive, fontWeight: 500, display: "block" }}>{t.birria_h2_2}</em>
                <em style={{ color: C.olive, fontWeight: 500, display: "block" }}>{t.birria_h2_3}</em>
              </h2>
              <p style={{ color: C.warmGray, fontSize: 15.5, lineHeight: 1.75, marginBottom: 28 }}>{t.birria_p}</p>
              <div className="btn-row-h">
                <a href="https://www.doordash.com/store/la-tiendita-ellisville" {...extLink} className="btn-hover" style={btn.primary}>{t.birria_cta1}</a>
                <a href="#" className="btn-hover" style={btn.outline}>{t.birria_cta2}</a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="g-photos">
              {[
                [IMG.tacos, FALLBACK.tacos, "Tacos de birria"],
                [IMG.panDulce, FALLBACK.panDulce, "Pan dulce"],
                [IMG.snacks, FALLBACK.snacks, "Snacks mexicanos"],
                [IMG.bar, FALLBACK.bar, "Interior del bar"],
              ].map(([src, fb, alt], i) => (
                <div key={i} className="photo-zoom" style={{ aspectRatio: "1", overflow: "hidden", borderRadius: 4, border: `1px solid ${C.divider}` }}>
                  <Img src={src} fallback={fb} alt={alt}/>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section style={{ background: C.cardBg, padding: "clamp(48px,8vw,88px) 24px" }}>
        <div className="w">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <SectionLabel center>{t.test_label}</SectionLabel>
              <Heading line1={t.test_h2_1} line2={t.test_h2_2} center/>
              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 10, background: C.white, border: `1px solid ${C.divider}`, padding: "10px 22px", borderRadius: 4 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: C.darkRed }}>4.8 / 5</span>
                <span style={{ color: C.lightGray, fontSize: 13 }}>{t.test_rating}</span>
              </div>
            </div>
          </Reveal>
          <div className="g-tests">
            {t.testimonials.map((rev,i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: C.white, border: `1px solid ${C.divider}`, padding: "30px 26px", borderRadius: 2, height: "100%" }}>
                  <div style={{ color: C.red, fontSize: 28, fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 10 }}>"</div>
                  <p style={{ color: C.warmGray, fontSize: 14.5, lineHeight: 1.7, fontStyle: "italic", marginBottom: 18 }}>{rev.text}</p>
                  <div style={{ color: C.black, fontWeight: 700, fontSize: 13.5 }}>{rev.name}</div>
                  <div style={{ color: C.lightGray, fontSize: 11.5 }}>{rev.src}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ORDER ONLINE ═══════════ */}
      <section style={{ background: C.cream, padding: "clamp(48px,8vw,88px) 24px" }}>
        <div className="w g-order">
          <Reveal>
            <SectionLabel>{t.order_label}</SectionLabel>
            <Heading line1={t.order_h3_1} line2={t.order_h3_2} size="clamp(1.6rem,3.6vw,2.3rem)"/>
            <p style={{ color: C.warmGray, fontSize: 15.5, lineHeight: 1.75, margin: "14px 0 28px" }}>{t.order_p}</p>
            <div className="btn-row-h">
              <a href="https://www.doordash.com/store/la-tiendita-ellisville" {...extLink} className="btn-hover" style={btn.primary}>DOORDASH</a>
              <a href="https://www.ubereats.com" {...extLink} className="btn-hover" style={btn.outline}>UBER EATS</a>
              <a href="tel:+16362206422" className="btn-hover" style={btn.outlineRed}>{t.order_call}</a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: 6, border: `1px solid ${C.divider}` }}>
              <Img src={IMG.storefront} fallback={FALLBACK.storefront} alt="Fachada de La Tiendita en Ellisville"/>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ OUR STORY ═══════════ */}
      <section id="historia" style={{ background: C.cardBg, padding: "clamp(48px,8vw,88px) 24px" }}>
        <div className="w" style={{ maxWidth: 760, textAlign: "center" }}>
          <Reveal>
            <SectionLabel center>{t.story_label}</SectionLabel>
            <Heading line1={t.story_h2_1} line2={t.story_h2_2} center/>
            <p style={{ color: C.warmGray, fontSize: 15.5, lineHeight: 1.85, margin: "20px 0 44px" }}>{t.story_p}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px,5vw,56px)", flexWrap: "wrap" }}>
              {[
                { big: "4.8★", label: t.stat1_label },
                { big: "$3/lb", label: t.stat2_label },
                { big: "6", label: t.stat3_label },
              ].map((s,i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, color: C.darkRed, lineHeight: 1.1 }}>{s.big}</div>
                  <div style={{ fontSize: 10.5, letterSpacing: 2.5, color: C.lightGray, marginTop: 5, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ VISIT US + MAP ═══════════ */}
      <section id="visita" style={{ background: C.cream, padding: "clamp(48px,8vw,88px) 24px 0" }}>
        <div className="w" style={{ maxWidth: 660, textAlign: "center" }}>
          <Reveal>
            <Heading line1={t.visit_h2_1} line2={t.visit_h2_2} center/>
            <p style={{ color: C.warmGray, fontSize: 15.5, marginTop: 18 }}>{t.visit_addr}</p>
            <p style={{ color: C.lightGray, fontSize: 14.5, marginTop: 4 }}>{t.visit_hours}</p>
            <div className="btn-row-h" style={{ justifyContent: "center", marginTop: 24 }}>
              <a href="tel:+16362206422" className="btn-hover" style={btn.primary}><PhoneIcon s={13}/> {t.visit_call}</a>
              <a href="https://maps.google.com/?q=15821+Manchester+Rd+Ellisville+MO+63011" {...extLink} className="btn-hover" style={btn.outline}><NavArrow/> {t.visit_dir}</a>
            </div>
          </Reveal>
        </div>
        {/* Google Maps embed */}
        <div style={{ marginTop: "clamp(32px,6vw,56px)", width: "100%", height: "clamp(260px,30vw,400px)", background: C.cardBg, borderTop: `1px solid ${C.divider}` }}>
          <iframe
            title="La Tiendita location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3116.8!2d-90.5871!3d38.5937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d8cec1a1a1a1a1%3A0x1234567890abcdef!2s15821+Manchester+Rd%2C+Ellisville%2C+MO+63011!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%" height="100%" style={{ border: 0 }}
            allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ background: C.footerBg, color: "#999", padding: "52px 24px 20px" }}>
        <div className="w g-footer" style={{ marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 800, color: C.cream, marginBottom: 3 }}>LA TIENDITA</div>
            <div style={{ fontSize: 10.5, letterSpacing: 2, color: "#666", marginBottom: 14 }}>{t.sub}</div>
            <p style={{ color: "#888", fontSize: 13.5, lineHeight: 1.7, maxWidth: 360 }}>{t.footer_desc}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 14, justifyContent: "inherit" }}>
              <a href="https://instagram.com" {...extLink} aria-label="Instagram" style={{ color: "#888" }}><InstagramIcon s={17}/></a>
              <a href="https://facebook.com" {...extLink} aria-label="Facebook" style={{ color: "#888" }}><FacebookIcon s={17}/></a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: 2, color: C.cream, marginBottom: 14, fontWeight: 700 }}>{t.footer_visit}</h4>
            <p style={{ fontSize: 13.5, lineHeight: 1.7 }}>15821 Manchester Rd<br/>Ellisville, MO 63011</p>
            <a href="tel:+16362206422" style={{ color: C.red, fontSize: 13.5, display: "block", marginTop: 7 }}>636-220-6422</a>
          </div>
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: 2, color: C.cream, marginBottom: 14, fontWeight: 700 }}>{t.footer_hours_title}</h4>
            <p style={{ fontSize: 13.5, lineHeight: 1.8 }}>{t.footer_h1}<br/>{t.footer_h2}<br/>{t.footer_h3}</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #ffffff0a", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 10.5, letterSpacing: 1, color: "#555" }}>{t.footer_copy}</span>
          <a href="https://www.doordash.com/store/la-tiendita-ellisville" {...extLink} style={{ fontSize: 11, letterSpacing: 2, color: C.red, fontWeight: 700 }}>{t.footer_order}</a>
        </div>
      </footer>

      {/* ═══════════ MOBILE STICKY BAR ═══════════ */}
      <div className="mbar">
        <a href="tel:+16362206422" style={{ flex: 1, padding: 15, textAlign: "center", background: C.red, color: "#fff", fontSize: 12.5, fontWeight: 700, letterSpacing: 2.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <PhoneIcon s={14}/> {t.mobile_call}
        </a>
        <a href="https://maps.google.com/?q=15821+Manchester+Rd+Ellisville+MO+63011" {...extLink} style={{ flex: 1, padding: 15, textAlign: "center", background: C.darkRed, color: "#fff", fontSize: 12.5, fontWeight: 700, letterSpacing: 2.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <NavArrow/> {t.mobile_dir}
        </a>
      </div>
      <div className="mbar-pad"/>
    </div>
  );
}
