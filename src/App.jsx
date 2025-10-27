import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
/* === ASSETS === */
import logo from "./assets/venus-logo.png";
import imgCentro from "./assets/unidade-barcelos.png";
import imgArcozelo from "./assets/unidade-arcozelo.png";
import barb01 from "./assets/barbeiro-exemplo01.jpg";
import barb02 from "./assets/barbeiro-exemplo02.jpg";
import barb03 from "./assets/barbeiro-exemplo03.jpg";
import gengiscanNova from "./assets/gengiscan-nova.png";

function useInView(options = { threshold: 0.25, rootMargin: "0px" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect(); // anima só uma vez
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, inView };
}

/* === DADOS === */
const UNITS = {
  centro: {
    id: "centro",
    label: "Vênus Prótese Capilar (Centro)",
    address: "Av. Dom Nuno Álvares Pereira 157, Sala 4 — Barcelos",
    phone: "+351 914 418 198",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.+Dom+Nuno+%C3%81lvares+Pereira+157,+Sala+4,+Barcelos",
    whatsapp: "https://wa.me/351914418198?text=Quero%20agendar",
    fresha: "#",
    hours: "Seg–Sáb 09:00–21:00",
  },
  arcozelo: {
    id: "arcozelo",
    label: "Vênus Barbearia .pt (Arcozelo)",
    address: "R. de Olivença 281, 4750-191 Barcelos",
    phone: "+351 914 197 122",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=R.+de+Oliven%C3%A7a+281,+4750-191+Barcelos",
    whatsapp: "https://wa.me/351914197122?text=Tenho%20uma%20d%C3%BAvida",
    fresha: null,
    queueOnly: true, // atendimento por ordem de chegada
  },
};

// fallback simples usado em Arcozelo (até definirmos tudo)
const SERVICES = [
  {
    id: "corte",
    name: "Corte",
    duration: "30–45 min",
    desc: "Consultoria + corte de precisão + finalização.",
    prices: { centro: 17, arcozelo: 14 },
  },
  {
    id: "barba",
    name: "Barba ou Contornos",
    duration: "30 min",
    desc: "Modelagem + toalha quente + acabamento.",
    prices: { centro: 10, arcozelo: 10 },
  },
  {
    id: "combo",
    name: "Combo Corte + Barba",
    duration: "50–70 min",
    desc: "Pacote completo com economia.",
    prices: { centro: 25, arcozelo: 20 },
  },
  {
    id: "hidratacao",
    name: "Hidratação no cabelo",
    duration: "25 min",
    desc: "Tratamento de hidratação.",
    prices: { centro: 15, arcozelo: 15 },
  },
];

// serviços da unidade de prótese (Centro), categorizados
const SERVICES_BY_UNIT = {
  centro: {
    Serviços: [
      {
        id: "avaliacao-protese",
        name: "Prótese capilar — Avaliação",
        duration: "30 min",
        priceLabel: "€0",
        img: null,
      },
      {
        id: "protese-capilar",
        name: "Prótese capilar",
        duration: null,
        priceLabel: "a partir de €400",
        img: null,
      },
      {
        id: "manutencao-protese-corte",
        name: "Manutenção de prótese + corte",
        duration: "1h 20 min",
        priceLabel: "a partir de €40",
        img: null,
      },

      {
        id: "platinado-nevou",
        name: "Platinado / Nevou",
        duration: "3h",
        priceLabel: "a partir de €60",
        img: null,
      },
      {
        id: "madeixas-luzes",
        name: "Madeixas / Luzes",
        duration: "3h",
        priceLabel: "a partir de €40",
        img: null,
      },
      {
        id: "alisamento-progressiva",
        name: "Alisamento / progressiva / botox",
        duration: "40 min",
        priceLabel: "€35",
        img: null,
      },
      {
        id: "hidratacao",
        name: "Hidratação no cabelo",
        duration: "25 min",
        priceLabel: "€15",
        img: null,
      },

      {
        id: "limpeza-pele",
        name: "Limpeza de pele",
        duration: "30 min",
        priceLabel: "€25",
        img: null,
      },
      {
        id: "pigmentacao",
        name: "Pigmentação",
        duration: "10 min",
        priceLabel: "€15",
        img: null,
      },

      {
        id: "corte-cabelo",
        name: "Corte de cabelo",
        duration: "30 min",
        priceLabel: "€17",
        img: null,
      },
      {
        id: "barba-contornos",
        name: "Barba ou Contornos",
        duration: "30 min",
        priceLabel: "€10",
        img: null,
      },

      {
        id: "limpeza-cera",
        name: "Limpeza na cera (nariz/orelhas)",
        duration: "10 min",
        priceLabel: "€5",
        img: null,
      },
      {
        id: "sobrancelha-pinca",
        name: "Sobrancelha na pinça",
        duration: "5 min",
        priceLabel: "€7",
        img: null,
      },
      // ⚠️ “Lavagem” removida como item avulso. É cortesia embutida nos cortes.
    ],
    Combos: [
      {
        id: "combo-corte-barba",
        name: "Corte + Barba",
        duration: "50 min",
        priceLabel: "€25",
        img: null,
      },
      {
        id: "combo-corte-barba-sobrancelha",
        name: "Corte + Barba + Sobrancelha",
        duration: null,
        priceLabel: "€30",
        img: null,
      },
      {
        id: "combo-cabelo-sobrancelha",
        name: "Cabelo + Sobrancelha",
        duration: null,
        priceLabel: "€20",
        img: null,
      },
      {
        id: "combo-cbs-hidratacao",
        name: "Corte + Barba + Sobrancelha + Hidratação",
        duration: "1h",
        priceLabel: "€45",
        img: null,
      },
      {
        id: "combo-cbs-limpeza-pele",
        name: "Corte + Barba + Sobrancelha + Limpeza de pele",
        duration: null,
        priceLabel: "€55",
        img: null,
      },
      {
        id: "combo-cbs-pigmentacao",
        name: "Corte + Barba + Sobrancelha + Pigmentação (Cabelo e Barba)",
        duration: null,
        priceLabel: "€45",
        img: null,
      },
      {
        id: "combo-cbs-pigmentacao-opcao",
        name: "Corte + Barba + Sobrancelha + Pigmentação (1 Cabelo ou 2 Barba)",
        duration: null,
        priceLabel: "€60",
        img: null,
      },
      // ⚠️ Sem “Lavagem” como combo; é cortesia nos cortes.
    ],
  },

  arcozelo: {
    Serviços: [
      {
        id: "platinado-nevou-a",
        name: "Platinado / Nevou",
        duration: "3h",
        priceLabel: "a partir de €60",
        img: null,
      },
      {
        id: "madeixas-luzes-a",
        name: "Madeixas / Luzes",
        duration: "3h",
        priceLabel: "a partir de €40",
        img: null,
      },
      {
        id: "alisamento-progressiva-a",
        name: "Alisamento / progressiva / botox",
        duration: "40 min",
        priceLabel: "€35",
        img: null,
      },
      {
        id: "hidratacao-a",
        name: "Hidratação no cabelo",
        duration: "25 min",
        priceLabel: "€15",
        img: null,
      },

      {
        id: "limpeza-pele-a",
        name: "Limpeza de pele",
        duration: "30 min",
        priceLabel: "€25",
        img: null,
      },
      {
        id: "pigmentacao-a",
        name: "Pigmentação",
        duration: "10 min",
        priceLabel: "€15",
        img: null,
      },

      {
        id: "corte-cabelo-a",
        name: "Corte de cabelo",
        duration: "30 min",
        priceLabel: "€14",
        img: null,
      },
      {
        id: "barba-contornos-a",
        name: "Barba ou Contornos",
        duration: "30 min",
        priceLabel: "€10",
        img: null,
      },

      {
        id: "limpeza-cera-a",
        name: "Limpeza na cera",
        duration: "10 min",
        priceLabel: "€7",
        img: null,
      },
      {
        id: "sobrancelha-a",
        name: "Sobrancelha (básica)",
        duration: "5 min",
        priceLabel: "€2",
        img: null,
      },
      {
        id: "sobrancelha-pinca-a",
        name: "Sobrancelha na pinça",
        duration: "5 min",
        priceLabel: "€5",
        img: null,
      },
      // ⚠️ “Lavagem” removida como item avulso. É cortesia embutida nos cortes.
    ],
    Combos: [
      {
        id: "combo-corte-barba-a",
        name: "Corte + Barba",
        duration: "45–50 min",
        priceLabel: "€20",
        img: null,
      },
      {
        id: "combo-corte-barba-sobrancelha-a",
        name: "Corte + Barba + Sobrancelha",
        duration: null,
        priceLabel: "€22",
        img: null,
      },
      {
        id: "combo-cabelo-sobrancelha-a",
        name: "Cabelo + Sobrancelha",
        duration: null,
        priceLabel: "€16",
        img: null,
      },
      {
        id: "combo-cbs-hidratacao-a",
        name: "Corte + Barba + Sobrancelha + Hidratação",
        duration: null,
        priceLabel: "€35",
        img: null,
      },
      {
        id: "combo-cbs-limpeza-pele-a",
        name: "Corte + Barba + Sobrancelha + Limpeza de pele",
        duration: null,
        priceLabel: "€45",
        img: null,
      },
      {
        id: "combo-cbs-pigmentacao-a",
        name: "Corte + Barba + Sobrancelha + Pigmentação (Cabelo e Barba)",
        duration: null,
        priceLabel: "€35",
        img: null,
      },
      {
        id: "combo-cbs-pigmentacao-opcao-a",
        name: "Corte + Barba + Sobrancelha + Pigmentação (1 Cabelo ou 2 Barba)",
        duration: null,
        priceLabel: "€50",
        img: null,
      },
      // ⚠️ Sem “Lavagem” como combo.
    ],
  },
};

function AutoPlayVideo({
  src,
  poster,
  className = "",
  loop = true,
  muted = true,
  playsInline = true,
  preload = "metadata",
  controls = false,
}) {
  const ref = useRef(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // iOS/Safari são sensíveis aos atributos já estarem no markup
    el.muted = true; // reforça
    el.playsInline = true; // reforça
    el.setAttribute("playsinline", ""); // iOS
    el.setAttribute("webkit-playsinline", ""); // iOS legacy

    const tryPlay = () => {
      const p = el.play?.();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Autoplay bloqueado -> mostra botão para toque do usuário
          setBlocked(true);
        });
      }
    };

    const onCanPlay = () => tryPlay();
    const onLoadedMeta = () => {
      if (el.currentTime === 0) el.currentTime = 0.001; // evita frame preto
    };

    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("loadedmetadata", onLoadedMeta);

    // primeira tentativa
    tryPlay();

    return () => {
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("loadedmetadata", onLoadedMeta);
      el.pause?.();
    };
  }, [src]);

  return (
    <div className="relative">
      <video
        ref={ref}
        autoPlay
        muted
        playsInline
        loop={loop}
        preload={preload}
        poster={poster}
        controls={controls}
        className={`block w-full h-full object-cover object-center ${
          className || ""
        }`}
      >
        <source src={src} type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>

      {/* Fallback: se iOS bloquear autoplay, aparece um botão de tocar */}
      {blocked && (
        <button
          type="button"
          onClick={() => {
            const el = ref.current;
            if (!el) return;
            el.muted = true;
            el.playsInline = true;
            el.play?.();
            setBlocked(false);
          }}
          className="absolute inset-0 grid place-items-center bg-black/40 text-white text-sm rounded-xl"
          aria-label="Tocar vídeo"
        >
          Tocar vídeo
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [unitId, setUnitId] = useState("centro");
  const unit = UNITS[unitId];

  return (
    <div id="top" className="min-h-screen bg-brand-black text-brand-ice">
      <Header unitId={unitId} setUnitId={setUnitId} />
      <Hero unit={unit} />
      {/* ordem pedida: Unidades acima de Serviços */}
      <Locations unitId={unitId} setUnitId={setUnitId} />
      <Services unit={unit} unitId={unitId} />
      <Experience />
      <Barbers />
      <LearnMethod />
      <Testimonials unitId={unitId} />
      <AboutOwner />
      <FAQ />
      <Footer />
    </div>
  );
}

/* === HEADER (com menu mobile) === */
function Header({ unitId, setUnitId }) {
  const [open, setOpen] = useState(false);

  // agenda: Whats da prótese ou link da outra unidade
  const scheduleHref =
    unitId === "centro" ? UNITS.centro.whatsapp : UNITS[unitId].fresha;

  // trava o scroll quando o menu está aberto
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
  }, [open]);

  // helper pra fechar o menu depois de clicar em um link
  const closeAnd = (fn) => (e) => {
    if (fn) fn(e);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-[10000] backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo + marca */}
        <a
          href="#"
          className="flex items-center gap-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={logo}
            alt="Venus Barbearia"
            className="h-9 w-auto select-none"
            draggable="false"
          />
          <span className="font-semibold tracking-wide">Vênus Barbearia</span>
        </a>

        {/* Navegação desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#unidades" className="hover:text-white">
            Unidades
          </a>
          <a href="#servicos" className="hover:text-white">
            Serviços
          </a>
          <a href="#aprenda" className="hover:text-white">
            Método Vênus
          </a>
          <a href="#conheca" className="hover:text-white">
            Conheça
          </a>
        </nav>

        {/* Select + CTA (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="bg-black/30 border border-white/15 text-white/90 text-sm rounded-lg px-3 py-2"
            aria-label="Escolha a unidade"
          >
            {Object.values(UNITS).map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>

          <a
            href={scheduleHref}
            className="px-4 py-2 rounded-xl bg-brand-gold text-black font-medium hover:brightness-110"
          >
            Agendar agora
          </a>
        </div>

        {/* Botão sanduíche (mobile) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 border border-white/15 text-white/90 hover:bg-white/10"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {/* Ícone hamburguer / X */}
          <svg
            className={`h-5 w-5 ${open ? "hidden" : "block"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
            <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
            <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
          </svg>
          <svg
            className={`h-5 w-5 ${open ? "block" : "hidden"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* MENU MOBILE via Portal (fora do header) */}
      {open &&
        createPortal(
          <MobileMenu
            onClose={() => setOpen(false)}
            unitId={unitId}
            setUnitId={setUnitId}
            scheduleHref={scheduleHref}
          />,
          document.body
        )}
    </header>
  );
}
function MobileMenu({ onClose, unitId, setUnitId, scheduleHref }) {
  // trava scroll do body enquanto aberto
  useEffect(() => {
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, []);

  return (
    <div className="fixed inset-0" style={{ zIndex: 99999 }}>
      {/* 1) Área clicável invisível em TODA a tela para fechar */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* 2) Scrim VISUAL só na faixa esquerda (pode reduzir/zerar a opacidade se quiser) */}
      <div
        className="absolute inset-y-0 left-0 right-[85%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, rgba(0,0,0,0.45), rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* 3) Painel: altura pelo conteúdo, com limite e scroll se precisar */}
      <div
        className="absolute right-0 top-3 w-[85%] max-w-xs
                 border-l border-white/10 shadow-2xl
                 rounded-l-xl rounded-b-2xl
                 overflow-y-auto"
        style={{
          backgroundColor: "#0E0E10",
          // no máximo a altura da janela com um respiro (3 * 8px)
          maxHeight: "calc(100vh - 24px)",
        }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-7 w-auto" />
            <span className="font-medium">Vênus Barbearia</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 border border-white/15 text-white/90 hover:bg-white/10"
            aria-label="Fechar menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
            >
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <nav className="p-4 grid gap-2 text-base">
          <a
            href="#unidades"
            onClick={onClose}
            className="px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Unidades
          </a>
          <a
            href="#servicos"
            onClick={onClose}
            className="px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Serviços
          </a>
          <a
            href="#aprenda"
            onClick={onClose}
            className="px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Método Vênus
          </a>
          <a
            href="#conheca"
            onClick={onClose}
            className="px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Conheça
          </a>

          <div className="h-px my-2 bg-white/10" />

          <label className="text-xs text-white/60 px-1">Unidade</label>
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="mt-1 bg-black/30 border border-white/15 text-white/90 text-sm rounded-lg px-3 py-2"
            aria-label="Escolha a unidade"
          >
            {Object.values(UNITS).map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>

          <a
            href={scheduleHref}
            onClick={onClose}
            className="mt-3 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-brand-gold text-black font-medium hover:brightness-110"
          >
            Agendar agora
          </a>
        </nav>
      </div>
    </div>
  );
}

function VideoCard({ children }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width; // -0.5..0.5
    const y = (e.clientY - (r.top + r.height / 2)) / r.height; // -0.5..0.5
    setTilt({ x, y });
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="
        animate-float-slow
        p-[1px] rounded-2xl
        bg-gradient-to-br from-brand-gold/50 via-brand-gold/10 to-transparent
        shadow-[0_20px_60px_-10px_rgba(0,0,0,.7)]
        transition-transform duration-300 video-glow
      "
      style={{
        transform: `rotateX(${-(tilt.y * 6)}deg) rotateY(${tilt.x * 6}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* camada interna sem bg/border/blur para não criar “faixa” */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden leading-none">
        {children}
      </div>
    </div>
  );
}

/* === HERO === */
function Hero({ unit }) {
  // troque as fontes dos vídeos usados no Hero
  const unitVideos = {
    centro: "/videos/video-unidade-barcelos.ios.mp4",
    arcozelo: "/videos/video-unidade-arcozelo.ios.mp4",
  };

  const unitPosters = { centro: imgCentro, arcozelo: imgArcozelo };

  return (
    <section className="relative overflow-hidden">
      {/* overlay decorativo */}
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(192,160,98,0.3),transparent_50%)]" />

      <div
        className="
      mx-auto max-w-6xl px-4 py-10 md:py-20
      grid gap-6 md:gap-x-10 md:gap-y-6
      md:grid-cols-[1fr_minmax(520px,560px)]
      md:[grid-auto-rows:min-content]
      items-start
    "
      >
        {/* 1) Título */}
        <h1
          className="
        order-1 md:order-none md:col-[1] md:row-[1]
        font-cinzel text-4xl md:text-5xl font-semibold leading-snug
        mt-2 md:mt-0 md:max-w-[18ch] md:pr-8
      "
        >
          Corte e barba de alto nível, sem mistério.
        </h1>

        {/* 2) Vídeo (fixo na coluna 2, ocupando a altura das linhas da esquerda) */}
        <div
          className="
        order-2 md:order-none md:col-[2] md:row-[1_/span_4] md:self-start
        relative [perspective:1000px] group mt-3 md:mt-0
      "
        >
          <VideoCard>
            <AutoPlayVideo
              key={unit.id}
              src={unitVideos[unit.id]}
              poster={unitPosters[unit.id]}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </VideoCard>

          {/* pill de endereço (desktop) */}
          <div className="absolute -bottom-4 -right-4 hidden md:block rounded-xl bg-black/60 border border-white/10 p-4 backdrop-blur">
            <p className="text-xs text-white/70">{unit.label}</p>
            <p className="text-sm font-medium">{unit.address}</p>
            <p className="text-xs text-white/70">{unit.hours}</p>
          </div>
        </div>

        {/* 3) CTAs */}
        <div
          className="
        order-3 md:order-none md:col-[1] md:row-[2]
        mt-2 md:mt-4 flex flex-wrap gap-2 md:pr-8
      "
        >
          <a
            href={unit.id === "centro" ? UNITS.centro.whatsapp : unit.fresha}
            className="px-5 py-3 rounded-xl bg-brand-gold text-black font-medium hover:brightness-110 cursor-pointer"
          >
            Agende agora o seu atendimento!
          </a>
          <a
            href="#aprenda"
            className="px-5 py-3 rounded-xl border bg-emerald-500 hover:bg-emerald-600 font-extrabold cursor-pointer"
            aria-label="Ir para Aprenda o nosso método"
          >
            Invista no seu futuro com a Vênus!
          </a>
        </div>

        {/* 4) Parágrafo */}
        <p
          className="
        order-4 md:order-none md:col-[1] md:row-[3]
        mt-1 md:mt-4 text-white/80 max-w-prose md:max-w-[60ch] md:pr-12
      "
        >
          Agende seu atendimento em segundos, ou seja atendido sem agendamento.
          Cada unidade é especializada para melhor lhe atender — conheça o
          Método Vênus.
        </p>

        {/* 5) Bullets */}
        <ul
          className="
        order-5 md:order-none md:col-[1] md:row-[4]
        mt-3 md:mt-4 flex flex-wrap gap-3 text-sm text-white/70 md:pr-8
      "
        >
          <li className="before:content-['•'] before:mr-2 before:text-brand-gold">
            Profissionais certificados
          </li>
          <li className="before:content-['•'] before:mr-2 before:text-brand-gold">
            Horários pontuais
          </li>
          <li className="before:content-['•'] before:mr-2 before:text-brand-gold">
            Ambiente premium
          </li>
        </ul>
      </div>
    </section>
  );
}

/* === SERVIÇOS (abas) === */
function Services({ unit, unitId }) {
  const [activeTab, setActiveTab] = useState("Serviços");

  const fallbackItems = SERVICES.map((s) => ({
    id: s.id,
    name: s.name,
    duration: s.duration,
    priceLabel:
      typeof s.prices?.[unitId] === "number"
        ? `€${s.prices[unitId]}`
        : s.price || "—",
    img: null,
    badge: s.badge,
  }));

  const splitByPlus = (items) => {
    const services = [];
    const combos = [];
    items.forEach((i) => (/\+/.test(i.name) ? combos : services).push(i));
    return { Serviços: services, Combos: combos };
  };

  const categorized =
    SERVICES_BY_UNIT[unitId] && typeof SERVICES_BY_UNIT[unitId] === "object"
      ? SERVICES_BY_UNIT[unitId]
      : splitByPlus(fallbackItems);

  const itemsToRender = categorized[activeTab] || [];

  const ServiceCard = ({ item }) => (
    <article className="group h-full flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition shadow-sm overflow-hidden">
      {/* Imagem com proporção menor no mobile para 2 colunas */}
      <div
        className="w-full border-b border-white/10 overflow-hidden
                aspect-[4/3] md:aspect-[16/8] bg-white/5"
      >
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/30 text-[11px] md:text-xs">
            (adicione uma imagem)
          </div>
        )}
      </div>

      <div className="px-3 md:px-5 pt-1">
        <div className="h-2 md:h-3" />
      </div>

      {/* Corpo com alturas padronizadas */}
      <div className="px-3 md:px-5 pb-4 md:pb-5 flex-1 flex flex-col">
        {/* Título com altura fixa de 2 linhas */}
        <h3 className="min-h-title-2 text-[14px] md:text-lg font-medium leading-snug line-clamp-2 no-hyphens">
          {item.name}
        </h3>

        {/* Preço na mesma faixa em todos os cards */}
        <div className="h-price mt-1 flex items-center justify-end">
          <span className="text-brand-gold font-semibold text-sm md:text-base whitespace-nowrap">
            {item.priceLabel || "—"}
          </span>
        </div>

        {/* Duração alinhada */}
        <div className="h-duration mt-1 flex items-center">
          {item.duration ? (
            <p className="text-[12px] md:text-sm text-white/70">
              {item.duration}
            </p>
          ) : (
            <span className="text-[12px] md:text-sm text-transparent">
              .
            </span> /* placeholder invisível */
          )}
        </div>

        {/* Rodapé: centro → botão; arcozelo → ordem de chegada */}
        <div className="mt-auto pt-3">
          {unitId === "arcozelo" ? (
            <span
              className="w-full inline-flex items-center justify-center px-3 py-2 md:px-4 md:py-2.5 rounded-xl
                             bg-white/[0.06] border border-white/10 text-[13px] md:text-sm text-white/90"
            >
              Ordem de chegada!
            </span>
          ) : (
            <a
              href={UNITS.centro.whatsapp}
              className="w-full inline-flex items-center justify-center px-3 py-2 md:px-4 md:py-2.5 rounded-xl
                         border border-white/15 hover:bg-white/10 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar
            </a>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <section
      id="servicos"
      className="mx-auto max-w-6xl px-4 pt-10 md:pt-16 pb-16"
    >
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h2 className="font-cinzel text-2xl md:text-3xl font-semibold">
          Serviços & Preços
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("Serviços")}
            className={`px-3 py-2 rounded-xl text-sm ${
              activeTab === "Serviços"
                ? "bg-brand-gold text-black"
                : "border border-white/15 hover:bg-white/10"
            }`}
          >
            Ver nossos serviços
          </button>
          <button
            onClick={() => setActiveTab("Combos")}
            className={`px-3 py-2 rounded-xl text-sm ${
              activeTab === "Combos"
                ? "bg-brand-gold text-black"
                : "border border-white/15 hover:bg-white/10"
            }`}
          >
            Ver nossos combos
          </button>
        </div>
        {unitId === "centro" ? (
          <a
            href={UNITS.centro.whatsapp}
            className="text-sm underline text-white/80 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </a>
        ) : (
          <span className="text-sm text-white/70">
            Atendimento por ordem de chegada
          </span>
        )}
      </div>

      {itemsToRender.length ? (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {itemsToRender.map((item) => (
            <ServiceCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-white/60">Nenhum item nesta categoria ainda.</p>
      )}
      <p className="mt-4 text-xs md:text-sm text-white/60">
        Lavagem (antes/depois do corte) está incluída como cortesia nos
        atendimentos.
      </p>
    </section>
  );
}

/* === EXPERIÊNCIA === */
function Experience() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Coluna de texto (igual) */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            A experiência Vênus
          </h2>
          <p className="mt-3 text-white/80 max-w-prose">
            Precisão clássica, ambiente agradável e atenção real aos detalhes.
            Você entra, relaxa e sai um novo homem para qualquer ocasião.
          </p>
          <ul className="mt-6 space-y-3 text-white/80">
            {[
              "Consulta rápida para entender seu estilo",
              "Higiene impecável e conforto",
              "Bebida como cortesia e música em volume ideal",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#C6A15B]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* === VÍDEO com o mesmo estilo do Hero === */}
        <div className="relative [perspective:1000px] group">
          <VideoCard>
            <AutoPlayVideo
              src="/videos/video-experiencia-venus-test.ios.mp4"
              poster={imgCentro}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </VideoCard>
        </div>
      </div>
    </section>
  );
}

/* === UNIDADES === */
function Locations({ unitId, setUnitId }) {
  const unitImages = { centro: imgCentro, arcozelo: imgArcozelo };

  return (
    <section
      id="unidades"
      className="mx-auto max-w-6xl px-4 pt-10 md:pt-16 pb-16"
    >
      <h2 className="text-2xl md:text-3xl font-semibold">Nossas unidades</h2>
      <p className="mt-3 text-white/80 max-w-prose">
        Selecione a unidade que deseja ser atendido
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:gap-6">
        {Object.values(UNITS).map((u) => {
          const isActive = unitId === u.id;
          return (
            <article
              key={u.id}
              onClick={() => setUnitId(u.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setUnitId(u.id);
                }
              }}
              role="button"
              tabIndex={0}
              className={`relative overflow-hidden rounded-2xl border transition cursor-pointer
    p-3 sm:p-4 md:p-5
    h-full flex flex-col
    ${
      isActive
        ? "border-brand-gold/80 bg-white/[0.06] ring-1 ring-brand-gold/30 shadow-[0_20px_60px_-10px_rgba(0,0,0,.65)]"
        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
    }`}
            >
              {/* Luz quando ativo (igual) */}
              {isActive && (
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 rounded-2xl blur-2xl opacity-50 bg-[radial-gradient(120%_80%_at_50%_50%,rgba(198,161,91,0.12),rgba(198,161,91,0.05)_55%,transparent_70%)]" />
                  <div className="absolute -inset-16 animate-sweep-soft will-change-transform">
                    <div className="w-[200%] h-[140%] blur-[18px] opacity-40 bg-[linear-gradient(100deg,transparent_40%,rgba(198,161,91,0.22)_50%,transparent_60%)]" />
                  </div>
                </div>
              )}

              {/* Conteúdo */}
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex-1 text-sm sm:text-base md:text-lg font-medium leading-snug">
                    {u.label}
                  </h3>
                </div>

                <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-white/80 line-clamp-2">
                  {u.address}
                </p>
                <p className="text-[10px] sm:text-[11px] md:text-xs text-white/60">
                  Seg–Sáb 09:00–21:00
                </p>

                <div className="mt-3 sm:mt-3 grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-2">
                  <a
                    href={u.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="col-span-1 inline-flex justify-center px-2 py-2 rounded-xl border border-white/15 hover:bg-white/10 text-xs sm:text-sm"
                  >
                    Ver rota no maps
                  </a>

                  {u.queueOnly ? (
                    <span
                      onClick={(e) => e.stopPropagation()}
                      title="Atendimento por ordem de chegada"
                      className="col-span-1 inline-flex justify-center px-3 py-2 rounded-xl border border-white/15 bg-white/10 text-xs sm:text-sm text-white/80 cursor-default"
                    >
                      Ordem de chegada!
                    </span>
                  ) : (
                    <a
                      href={
                        u.id === "centro" ? UNITS.centro.whatsapp : u.fresha
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="col-span-1 inline-flex justify-center px-3 py-2 rounded-xl bg-brand-gold text-black text-xs sm:text-sm font-medium hover:brightness-110"
                    >
                      Agende nessa unidade!
                    </a>
                  )}
                </div>

                {/* Imagem: altura fixa no mobile; grande no desktop */}
                <a
                  href={u.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 sm:mt-4 block rounded-xl bg-white/5 border border-white/10 overflow-hidden
                 h-28 sm:h-32 md:h-auto md:aspect-[16/10]"
                  title={`Abrir ${u.label} no Google Maps`}
                >
                  <img
                    src={unitImages[u.id]}
                    alt={`Fachada — ${u.label}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* === BARBEIROS === */
function Barbers() {
  const items = [
    {
      name: "Alex",
      role: "Master Barber",
      bio: "Do classico ao moderno",
      img: barb01,
    },
    {
      name: "Bruno",
      role: "Barber",
      bio: "Do clássico ao moderno.",
      img: barb02,
    },
    {
      name: "Caio",
      role: "Barber",
      bio: "Do clássico ao moderno.",
      img: barb03,
    },
  ];

  return (
    <section id="barbeiros" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-cinzel text-2xl md:text-3xl font-semibold">
        Barbeiros
      </h2>

      {/* 1 coluna no mobile, 2 no desktop */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((b) => (
          <article
            key={b.name}
            className="h-full rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
          >
            <div className="p-4 md:p-5 flex gap-4 md:gap-6">
              {/* Foto à esquerda (tamanho fixo) */}
              <div className="shrink-0 w-28 h-28 md:w-40 md:h-40 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <img
                  src={b.img}
                  alt={b.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Infos à direita + botão embaixo */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-cinzel text-lg md:text-xl font-medium leading-snug">
                  {b.name}
                </h3>
                <p className="text-sm text-white/70">{b.role}</p>
                <p className="mt-2 text-sm md:text-base text-white/80 leading-relaxed">
                  {b.bio}
                </p>

                <div className="mt-auto pt-2">
                  <a
                    href="#"
                    className="inline-flex px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 text-sm"
                  >
                    Agendar com {b.name}
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* === APRENDA O MÉTODO (CTA forte) === */
function LearnMethod() {
  return (
    <section
      id="aprenda"
      className="mx-auto max-w-6xl px-4 pt-10 md:pt-16 pb-16"
    >
      <h2 className="font-cinzel text-2xl md:text-3xl font-semibold">
        Aprenda o nosso método
      </h2>

      {/* Vídeo flutuante no mesmo padrão dos outros */}
      <div className="mt-6">
        <VideoCard>
          <AutoPlayVideo
            src="/videos/video-experiencia-venus-test.web.mp4"
            className="w-full h-full object-cover"
          />
        </VideoCard>
      </div>

      {/* faixa de escassez */}
      <div className="mt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/90 text-black px-4 py-2 text-base md:text-lg font-semibold">
          <span>VAGAS LIMITADAS</span>
          <span className="hidden md:inline-block">
            • Próxima turma em breve
          </span>
        </div>
      </div>

      {/* CTA principal */}
      <div className="mt-6">
        <a
          href="#"
          aria-label="Ir para a página de inscrição do Método Vênus"
          className="block w-full text-center px-6 py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600
                     text-white font-extrabold text-xl md:text-2xl shadow-lg transition"
        >
          Garanta o seu acesso agora!
        </a>
        <p className="mt-2 text-center text-white/70 text-sm">
          Não perca essa oportunidade!
        </p>
      </div>

      {/* benefícios rápidos */}
      <ul className="mt-6 grid md:grid-cols-3 gap-4 text-base md:text-lg text-white/80">
        <li className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 leading-relaxed">
          • Invista no seu futuro com a Vênus e conheça o nosso método
        </li>
        <li className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 leading-relaxed">
          • Uma das profissões que mais cresce na Europa e no mundo
        </li>
        <li className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 leading-relaxed">
          • Aprendizado da base até a excelência
        </li>
      </ul>

      {/* confiança/garantia */}
      <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
        Inscrição segura, suporte direto da nossa equipa e certificado de
        conclusão incluso.
      </p>
    </section>
  );
}

/* === DEPOIMENTOS === */
function Testimonials({ unitId }) {
  // placeholder por unidade (quando integrar API do Google, trocamos aqui)
  const GOOGLE_REVIEWS = {
    centro: [
      {
        name: "Ricardo",
        rating: 5,
        text: "Atendimento impecável. Avaliação de prótese muito esclarecedora.",
      },
      {
        name: "Bruna",
        rating: 5,
        text: "Profissionais top e ambiente premium. Recomendo!",
      },
      {
        name: "Nuno",
        rating: 5,
        text: "Marcação rápida pelo Whats e serviço excelente.",
      },
    ],
    arcozelo: [
      {
        name: "Diogo",
        rating: 5,
        text: "Corte perfeito e pontualidade. Melhor da região.",
      },
      {
        name: "Marta",
        rating: 5,
        text: "Experiência nota 10, super cuidadosos.",
      },
      { name: "Filipe", rating: 5, text: "Ambiente tranquilo e preço justo." },
    ],
  };

  const items = GOOGLE_REVIEWS[unitId] || [];
  const avg = items.length
    ? (items.reduce((s, r) => s + (r.rating || 5), 0) / items.length).toFixed(1)
    : "5.0";
  const mapsLink = UNITS[unitId]?.mapsUrl || "#";

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-16 pb-16">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-cinzel text-2xl md:text-3xl font-semibold">
          Depoimentos
        </h2>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <span>Nota média ★★★★★ {avg}</span>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Ver todos no Google
          </a>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {items.slice(0, 6).map((t, i) => (
          <blockquote
            key={i}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="text-brand-gold text-sm mb-2">
              {"★".repeat(t.rating || 5)}
              <span className="text-white/40">
                {"☆".repeat(5 - (t.rating || 5))}
              </span>
            </div>
            <p className="text-white/90">“{t.text}”</p>
            <footer className="mt-3 text-sm text-white/60">{t.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
function AboutOwner() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section
      id="conheca"
      ref={ref}
      className="relative w-full md:min-h-screen py-8 md:py-14 overflow-x-visible"
    >
      {/* ======== MOBILE – clean, nítido e com camadas leves ======== */}
      <div className="md:hidden px-4">
        <h2 className="font-cinzel text-2xl font-semibold text-center mt-1 crisp-text">
          Conheça a Vênus & o fundador
        </h2>

        {/* Cena mobile */}
        <div
          className={`-mx-4 mt-2 relative h-[60vh] overflow-visible scene-isolate
                      transition-transform duration-500 ease-out
                      ${
                        inView
                          ? "scale-[1.02] opacity-100"
                          : "scale-100 opacity-95"
                      }`}
        >
          {/* spotlight MUITO sutil por trás do rosto */}
          <div className="absolute inset-0 z-0 spot-soft" />

          {/* PNG com degradê (novo) — sem filtros pesados */}
          <img
            src={gengiscanNova}
            alt="Gengiscan dos Santos Correia"
            className={`absolute inset-x-0 top-0 w-full h-auto object-contain select-none pointer-events-none sharp-img
                        ${
                          inView ? "-translate-y-2" : "-translate-y-1"
                        } scale-[1.01]`}
            style={{ transformOrigin: "center top" }}
            draggable="false"
          />

          {/* vinheta leve nas bordas + base longa (enterrar cadeira) */}
          <div className="absolute inset-0 z-10 vignette-soft" />
          {/* FADE para legibilidade do texto – fica à frente da imagem */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-20 pointer-events-none
               h-[36%] md:h-[32%]
               bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.42)_38%,rgba(0,0,0,0.85)_100%)]"
          />

          {/* placa discreta atrás do nome para legibilidade */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-24 z-30
             px-3 py-2 rounded-xl"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
              backdropFilter: "blur(1px)",
              WebkitBackdropFilter: "blur(1px)",
            }}
          />

          {/* Nome – ouro vivo e contorno contido (nítido) */}
          <h3
            className="absolute left-1/2 -translate-x-1/2 bottom-24 z-40 text-center
             font-cinzel font-semibold leading-[0.95] tracking-wide
             text-[42px] sm:text-5xl px-4 name-white crisp-text"
            style={{ letterSpacing: "-0.5px", wordSpacing: "2px" }}
          >
            Gengiscan dos
            <br />
            Santos Correia
          </h3>
        </div>

        <div className="relative z-40 -mt-16">
          <p className="-mt-1 text-sm text-white/70 text-center">
            Fundador da Vênus Barbearia • Nasc. 05/12/1995 • Barcelos, PT
          </p>
          <div className="prose prose-invert text-white/85 max-w-none mt-1 leading-relaxed">
            {/* ...parágrafos... */}
          </div>
        </div>
        {/* Texto */}
        <div className="relative z-40 prose prose-invert text-white/85 max-w-none mt-3 leading-relaxed">
          <p>
            Brasileiro, hoje residente em Barcelos, Gengiscan construiu sua
            história ao lado da parceira e de seus dois filhos. Criado com
            valores sólidos, aprendeu cedo a inovar, adaptar-se e buscar
            soluções criativas.
          </p>
          <p>
            Ao deixar o serviço militar no Brasil, viveu um ponto de virada:
            precisou se reinventar para priorizar a família. Inspirado por
            referências da área, como <em>@srelias</em>, firmou uma jornada
            guiada por persistência, caráter e resiliência.
          </p>
          <p>
            Empreendedor nato, fundou a <strong>Vênus Barbearia</strong> na
            garagem de casa para estar mais presente com a família e criar renda
            sustentável. A Vênus evoluiu para uma operação sólida — fruto de
            disciplina, aprendizagem contínua e foco no cliente.
          </p>
          <p>
            Lealdade, honestidade e proteção à família são inegociáveis. Nos
            momentos de pressão manteve o equilíbrio e buscou liderança, cultura
            e marketing.
          </p>
          <p>
            Hoje participa de mentorias para estruturar crescimento, fortalecer
            a marca e diversificar receitas — mantendo a essência familiar e o
            atendimento premium.
          </p>
        </div>

        <ul className="mt-4 grid gap-3 text-sm">
          <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            • Valores: honestidade, lealdade e compromisso
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            • Aprendizados: apostar nas pessoas certas e evoluir sempre
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            • Objetivo: premium com essência familiar
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            • Legado: base familiar forte e mentalidade empreendedora
          </li>
        </ul>
      </div>

      {/* ======== DESKTOP – mantém seu layout, só troca imagem p/ nova ======== */}
      <div className="hidden md:block w-full px-6 lg:px-10 xl:px-16 2xl:px-24">
        <h2 className="font-cinzel text-2xl md:text-3xl font-semibold">
          Conheça a Vênus & o fundador
        </h2>

        <div
          className={`mt-8 max-w-[1100px] transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
          }`}
        >
          <div
            aria-hidden
            className="hidden md:block"
            style={{
              float: "right",
              width: "min(8rem, 12vw)",
              height: "72vh",
              shapeOutside: "inset(0 round 24px)",
              marginLeft: "1.25rem",
            }}
          />

          <h3 className="text-xl md:text-2xl font-semibold">
            Gengiscan dos Santos Correia
          </h3>
          <p className="mt-2 text-white/70 text-sm">
            Fundador da Vênus Barbearia • Nasc. 05/12/1995 • Barcelos, PT
          </p>

          <div className="prose prose-invert text-white/85 max-w-none mt-6 leading-relaxed">
            <p>
              Brasileiro, hoje residente em Barcelos, Gengiscan construiu sua
              história ao lado da parceira e de seus dois filhos. Criado com
              valores sólidos, aprendeu cedo a inovar, adaptar-se e buscar
              soluções criativas.
            </p>
            <p>
              Ao deixar o serviço militar no Brasil, viveu um ponto de virada:
              precisou se reinventar para priorizar a família. Inspirado por
              referências da área, como <em>@srelias</em>, firmou uma jornada
              guiada por persistência, caráter e resiliência.
            </p>
            <p>
              Empreendedor nato, fundou a <strong>Vênus Barbearia</strong> na
              garagem de casa para estar mais presente com a família e criar
              renda sustentável. A Vênus evoluiu para uma operação sólida —
              fruto de disciplina, aprendizagem contínua e foco no cliente.
            </p>
            <p>
              Lealdade, honestidade e proteção à família são inegociáveis. Nos
              momentos de pressão (perdas de equipa, finanças, exposição)
              manteve o equilíbrio e buscou liderança, cultura e marketing.
            </p>
            <p>
              Hoje participa de mentorias para estruturar crescimento,
              fortalecer a marca e diversificar receitas — mantendo a essência
              familiar e o atendimento premium.
            </p>

            <ul className="mt-6 grid md:grid-cols-2 gap-3 text-sm not-prose">
              <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                • Valores: honestidade, lealdade e compromisso
              </li>
              <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                • Aprendizados: apostar nas pessoas certas e evoluir sempre
              </li>
              <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                • Objetivo: premium com essência familiar
              </li>
              <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                • Legado: base familiar forte e mentalidade empreendedora
              </li>
            </ul>
          </div>
        </div>

        {/* imagem/flutuação desktop – usa imagem nova e sem blur */}
        <div
          className={`pointer-events-none select-none hidden md:block absolute top-1/2 -translate-y-1/2 right-[-14vw]
                      w-[50vw] 2xl:w-[44vw] md:max-h-[88vh] transition-all duration-700 ease-out
                      ${inView ? "translate-x-0" : "translate-x-8 opacity-0"}`}
          style={{ opacity: 0.5 }}
        >
          <div className="relative w-full h-full">
            <img
              src={gengiscanNova}
              alt="Gengiscan dos Santos Correia"
              className="w-full h-full object-contain select-none pointer-events-none sharp-img"
            />
            {/* luz de vitrine MUITO sutil */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 88% 62%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.03) 45%, rgba(0,0,0,0) 70%)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* === FAQ === */
function FAQ() {
  const qa = [
    {
      q: "Como funcionam as marcações?",
      a: "Agende online e receba confirmação imediata. Chegue 5 minutos antes para a sua consulta inicial.",
    },
    {
      q: "Há política de no-show?",
      a: "Sim. Atrasos acima de 10 minutos podem resultar em remarcação. Cancelamentos até 2h antes pelo link do agendamento.",
    },
    {
      q: "Quais métodos de pagamento?",
      a: "MB Way, cartão e dinheiro nas unidades.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 pt-10 md:pt-16 pb-16">
      <h2 className="text-2xl md:text-3xl font-semibold">FAQ & Políticas</h2>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {qa.map((i) => (
          <div
            key={i.q}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h3 className="font-medium">{i.q}</h3>
            <p className="mt-2 text-white/80">{i.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* === RODAPÉ === */
function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-semibold">Vênus Barbearia</p>
          <p className="text-sm text-white/70">
            Clássico, clean e premium — do seu jeito.
          </p>
        </div>
        <div className="text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} Vênus Barbearia. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
