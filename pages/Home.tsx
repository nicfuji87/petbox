import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import petboxVideo from '../assets/videos/petbox_video_1.mp4';

// Testimonials data
const TESTIMONIALS = [
  {
    name: 'Thor',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0rgMcUCphGM40PrtkjJSUinz-cS080cB0JOYvXN9BTMI_w6hezZHKW2i6sGVyn0c4coUxea8owMU4IeJ8QfhC6OcGxVovCiYO8FT8En7bma9B0UrVP9TrOJF2AugZbOIbnRpk_aWDVPVGF22EeIH0Id185DUdXulWjZrfTNOwocO4Y2q6W-z3kGtNKuxcZgxIIWVD4P_AuMgvnU52KINwZk2WSwcXmDdLRvOcU0x164gIWsq4jW3Sr3AhEtgLh0Er7r6guvSdZjG7',
    rating: 5,
    testimonial: '"O Thor amou os brinquedos! E o melhor: nada deu alergia nele. A curadoria é perfeita."',
    tutor: '— Tutora Ana'
  },
  {
    name: 'Miau',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatZ04dSJvm6uzjZWELzwgBbaUJO7lrSZZCupF0yYbk9b1YEmqt1fpdBXcqQRCL8JsaxJv-V0gONKZEyWxoXjn3b2L-gHjqXrQL0uywwRgQNCxAgiQcKxxZLei8o-24KhHxXEqcX-061S4tlJWdT2dVZZTGg5NjegKLsPbYeHSdVLkE1-uEvtPp0L7QzB8nJHsC6Py3-1O0oKIpYSpR0Pga2kN-D28Iqn34_ObHO4R4rsMcPIdDlMTsmSfz8D4hmoOLK5G_Vz1Y_lP',
    rating: 5,
    testimonial: '"A Miau Box foi a melhor surpresa do mês. Os petiscos são naturais e ela comeu tudo!"',
    tutor: '— Tutor Carlos'
  },
  {
    name: 'Luna',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiGlAg7BzZQczwJ5OlNA0xVT_GAVhW-tw9thPGriSOr5Gcw_TYzjhlUCeqVWjrD_1Kj8q8xvIQICdUOu_nEh3t5OA6313joyUXjPXrFWPzBfdxRy8UNV0RYI_47VQBEi85m9N_cZJYTvmo651wy5hLYyEnptNRLPKP-SXBtfRldlNnzgizbVM2in7FQdqkgCzhbrD1uJp2VxujYjMlJiTpl9tszW-6wvWIq5mjlAuLcz2BaT16SKbrT3YxrQKYWgclQJvObACIW_Dm',
    rating: 5,
    testimonial: '"Entrega super rápida e o unboxing é uma festa aqui em casa. Recomendo demais!"',
    tutor: '— Tutora Beatriz'
  }
];

// Gallery images
const GALLERY_IMAGES = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDotT2aNhWx0Fw9n60UcaJI6cwbAel_rKIjA_xVy-_lR_SKmCnDw250rM757UT1u19H5NvNuuSbucDaJ3TAyRH1dpdrCOP21tMpRN23DDzP2i0rQh_MBQ9W2uhP-X4fJmER_hxeAb9S4T9kEK5H5OYn3wwmLwvVvZHxMRs65yvYVmR_l7b7LD0dV1_X9oGBmB8KOt51CLkY0v7CDJQes8t1D9wlfKNQWTZ1G9MUrgpByyTnnQA3KQ-7KkkGljpzxCRHcoAwOjMECfJ-',
    alt: 'Happy dog running with toy',
    className: 'row-span-2 rounded-l-xl'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1u_c5BEwh6p-cZdBVwfstoPwMLP5-oCWHiv_5TL0yo-EZF090JJ6LTLusX7mJujfggBXXF9sZWaDnWk0-5FJdFtPfPXZZaSeg8atQdYW8J-GrnWYYqmgD6mpZ3j9s64EuqkbPry8rTxWYCidM_HYoacPwliDshg1M7QdLLTISYZNVEE8Lxl68unsV2Xa1Qw9c-k6XIOiK_YIvTOnvxTVW-mnP7bqZlJRT5uAGc8JVymBAAe4sZJhq8iUHrw0bKlK8M3y7zwPm61O_',
    alt: 'Cat playing with box contents',
    className: 'col-span-2 rounded-tr-xl'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ6ZBFqnuZoNT_3BQ6ul2cFxtSKjnSb-4yBrxf7rZrOnnY0WNT2_lViXo7Unvhe40fXjnNoMOqFBHeNQUXK8a56MeX7IAJtu4lidbTt3zzNj8j8vA2gaid7ctGLCzeJnYqUbZT-HUpW8ga5Vkl8j9gfnZSDZb9SyBiqg8jUG1s53F2lprNlcVI2V7rQrZv7DsCpQOSiuIdUYU-qGGW1bktELZSaDDHIHi98PiyquBlnIdxWs-kcxmqJ0twP4R_F3VwnRMlKbghWpMi',
    alt: 'Dog with treats',
    className: ''
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALRm-y2MBk-e6WKbS5LXPlapaaRVwq3gU3B-PnyM7VV8ud8-sO0olA-GHOTkwO_l8Inr0KTrM4jNOS7TN_cdGfRq_-nxlIvdmZEyrsNhbtYF6uISdpuTFFZ3qVbdcQE_2OCerMfFlXwaFpKqcVYexIsH-w9xovHM0XFo6W35vZq7XQQntMoLN-OJ45LGN5uiYlSG3Yay8IUMRpLeSmWdZgJV9WYBDfMX8kTSweYZXfmEiQCz5w83TukDDYrxD8z_Y3Z7pNDRfB6VF6',
    alt: 'Puppy sleeping after playing',
    className: 'rounded-br-xl'
  }
];

// Features/Guarantees data
const GUARANTEES = [
  {
    icon: 'verified_user',
    title: 'Satisfação 100%',
    description: 'Seu pet não gostou? Nós trocamos.'
  },
  {
    icon: 'swap_horiz',
    title: 'Troca Fácil',
    description: 'Direto na sua próxima box.'
  },
  {
    icon: 'lock_open',
    title: 'Segurança Total',
    description: 'Produtos seguros e atóxicos.'
  }
];

// Star Rating Component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex text-primary">
    {[...Array(rating)].map((_, i) => (
      <span
        key={i}
        className="material-symbols-outlined text-sm"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
    ))}
  </div>
);

const Home: React.FC = () => {
  const [showFab, setShowFab] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show FAB after scrolling past hero (600px)
      const pastHero = scrollY > 600;

      // Hide FAB when near footer (last 300px of page)
      const nearFooter = scrollY + windowHeight > documentHeight - 300;

      setShowFab(pastHero && !nearFooter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-black/5 dark:border-white/5">
        <Logo />
        <div className="flex items-center justify-end gap-3">
          <Link to="/admin/pets" className="flex items-center justify-center text-text-main dark:text-text-dark-main font-bold text-sm hover:text-primary transition-colors">
            Area Admin
          </Link>
          <button className="flex items-center justify-center rounded-full size-10 bg-surface-light dark:bg-surface-dark text-text-main dark:text-text-dark-main shadow-sm">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="@container">
        <div className="p-4 @[480px]:p-6">
          <div className="relative flex min-h-[520px] flex-col gap-6 overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat @[480px]:gap-8 items-center justify-end p-6 pb-10" style={{ backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3xqX9x0CxJYl3p727sX8Ok-TM1GaWDwdb49jGuSJSIFIEGQEYx4ggFzZcZE08xfWqN9I-d8x3YZyLNBKQ9N4fuUd0VB7DRUkgUE95XsDaRmvujN82MDrPh4ly8cYq7h_ebTwK8ML3k5uaCgSUxBiVigxVn8wDYOI4nfgFtK-YFkXAlIQ6u0YgnQDwvprmQ3dy4p1lmfgeFABZmIB8K0_rk-9yTJVYr4grUHRZ5qzGvG0EtMCPSlptzmrMHXJjEBa9UoojFx1KRo6W")' }}>
            <div className="flex flex-col gap-3 text-center z-10 max-w-[500px]">
              <span className="text-primary font-bold text-xs uppercase tracking-wider bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full w-fit mx-auto border border-white/10">Personalizado para seu pet</span>
              <h1 className="text-white text-4xl font-black leading-[1.1] tracking-[-0.033em] @[480px]:text-5xl drop-shadow-sm">
                Felicidade entregue na porta do seu pet todo mês.
              </h1>
              <p className="text-white/90 text-sm font-medium leading-relaxed @[480px]:text-base">
                Brinquedos, petiscos e itens essenciais personalizados para o perfil do seu melhor amigo.
              </p>
            </div>
            <div className="flex flex-col w-full max-w-[480px] gap-4 z-10">
              <Link to="/montar-box" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-primary-hover active:scale-95 transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30">
                <span className="truncate">Quero minha Pet Box</span>
              </Link>
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-xs font-medium text-white/80">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <span>Frete Grátis</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30"></div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
                  <span>Satisfação Garantida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section with Vertical Video (Reels Style) */}
      <section className="flex flex-col px-4 py-12 md:py-20 w-full max-w-[1000px] mx-auto @container">
        <div className="mb-10 md:mb-16 text-center flex flex-col items-center">
          <h2 className="text-text-main dark:text-text-dark-main tracking-tight text-3xl font-extrabold leading-tight md:text-4xl max-w-[720px]">
            Veja a alegria chegando
          </h2>
          <div className="w-16 h-1.5 bg-primary rounded-full mt-4"></div>
          <p className="mt-4 text-text-secondary dark:text-text-dark-secondary max-w-[500px]">
            Descubra como transformar o dia do seu pet em um momento inesquecível.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center justify-center">
          {/* Vertical Video (Reels Style) */}
          <div className="relative w-[280px] md:w-[320px] aspect-[9/16] shrink-0 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-surface-dark bg-black group md:-rotate-2 hover:rotate-0 transition-transform duration-500 ring-1 ring-black/5 dark:ring-white/10">
            {/* Phone Notch/Header Mockup (Optional aesthetic detail) */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/40 to-transparent z-20 pointer-events-none"></div>

            <video
              src={petboxVideo}
              controls
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1548681528-6a5c45b6c342?q=80&w=1974&auto=format&fit=crop"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Reels UI Elements Mockup */}
            <div className="absolute bottom-16 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white z-10 pointer-events-none">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">pets</span>
                </div>
                <span className="font-bold text-sm">@petbox</span>
              </div>
              <p className="text-sm font-medium leading-snug mb-2">A reação do Thor recebendo a caixa desse mês é impagável! 🧡 📦 #petbox #felicidade</p>
            </div>
          </div>

          {/* Steps List */}
          <div className="flex flex-col gap-6 w-full max-w-[480px]">
            <div className="md:hidden text-center mb-2">
              <h3 className="font-bold text-xl text-text-main dark:text-text-dark-main">Como funciona?</h3>
            </div>

            {[
              { icon: 'edit_note', step: 1, title: 'Crie o Perfil', desc: 'Conte-nos sobre a raça, tamanho, alergias e o que seu pet mais ama no mundo.' },
              { icon: 'card_giftcard', step: 2, title: 'Nós Personalizamos', desc: 'Nossos especialistas e veterinários montam a caixa perfeita todos os meses.' },
              { icon: 'local_shipping', step: 3, title: 'Receba em Casa', desc: 'Todo mês uma nova surpresa chega na sua porta para vocês aproveitarem juntos.' }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-4 md:pl-0">
                {/* Timeline line for desktop */}
                {idx !== 2 && <div className="hidden md:block absolute left-[27px] top-[60px] bottom-[-24px] w-0.5 bg-primary/20"></div>}

                <div className="group flex items-start gap-5 rounded-2xl md:bg-transparent bg-surface-light dark:bg-surface-dark p-4 md:p-2 shadow-sm md:shadow-none transition-all">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-surface-dark border-2 border-primary/10 shadow-sm text-primary group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm border-2 border-white dark:border-background-dark">{item.step}</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <h3 className="text-text-main dark:text-text-dark-main text-lg font-bold leading-tight">{item.title}</h3>
                    <p className="text-text-secondary dark:text-text-dark-secondary text-sm font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-center md:justify-start">
              <Link to="/montar-box" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm uppercase tracking-wider">
                Começar agora <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8">
        <div className="px-4 mb-6">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-text-main dark:text-text-dark-main">
            Quem comprou, <span className="text-primary">amou!</span>
          </h2>
          <p className="mt-2 text-text-secondary dark:text-text-dark-secondary text-base">
            Veja o que os tutores (e seus pets) estão falando sobre a experiência Pet Box.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="w-full overflow-hidden">
          <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar snap-x snap-mandatory">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-[280px] bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="size-12 rounded-full bg-neutral-200 bg-cover bg-center"
                    style={{ backgroundImage: `url('${testimonial.image}')` }}
                  />
                  <div>
                    <p className="font-bold text-text-main dark:text-text-dark-main">{testimonial.name}</p>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
                <p className="text-text-secondary dark:text-text-dark-secondary text-sm leading-relaxed">
                  {testimonial.testimonial}
                </p>
                <p className="text-xs text-text-secondary/60 dark:text-text-dark-secondary/60 font-medium mt-auto">
                  {testimonial.tutor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Gallery */}
      <section className="px-4 py-6">
        <h3 className="text-lg font-bold text-text-main dark:text-text-dark-main mb-4">Galeria da Felicidade</h3>
        <div className="w-full gap-2 overflow-hidden rounded-xl grid grid-cols-[2fr_1fr_1fr] aspect-[3/2]">
          {GALLERY_IMAGES.map((image, idx) => (
            <div
              key={idx}
              className={`w-full bg-center bg-no-repeat bg-cover h-full relative group ${image.className}`}
              style={{ backgroundImage: `url('${image.src}')` }}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee & Features Section */}
      <section className="px-4 py-8">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-bold leading-tight text-text-main dark:text-text-dark-main">
            Sua tranquilidade garantida
          </h2>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
            Seu pet feliz ou trocamos o item na próxima caixa. Sem stress, sem burocracia.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {GUARANTEES.map((guarantee, idx) => (
            <div
              key={idx}
              className="flex flex-row sm:flex-col items-center sm:items-start gap-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 shadow-sm"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">{guarantee.icon}</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-text-main dark:text-text-dark-main">{guarantee.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">{guarantee.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-8 md:py-12 bg-surface-light dark:bg-surface-dark border-y border-border-light dark:border-border-dark">
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h2 className="text-2xl font-bold leading-tight text-text-main dark:text-text-dark-main">
            Dúvidas frequentes
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-2"></div>
        </div>
        <div className="w-full max-w-[800px] mx-auto flex flex-col gap-3">
          {[
            { q: 'O que vem na caixa?', a: 'Cada Pet Box contém 5 a 6 itens premium, incluindo brinquedos duráveis, petiscos naturais e acessórios úteis, tudo personalizado para o porte e gosto do seu pet.' },
            { q: 'Meu pet tem alergia. Posso avisar?', a: 'Com certeza! Durante o cadastro, você pode listar todas as restrições alimentares e nós garantiremos que ele receba apenas o que pode comer.' },
            { q: 'Como cancelo a assinatura?', a: 'Sem letras miúdas. Você pode cancelar ou pausar sua assinatura a qualquer momento direto pelo painel do usuário, sem burocracia.' },
            { q: 'Qual a data de entrega?', a: 'Nós enviamos todas as caixas até o dia 10 de cada mês. O prazo de entrega varia de 2 a 5 dias úteis dependendo da sua região.' }
          ].map((item, idx) => (
            <details key={idx} className="group bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden transition-all hover:border-primary/30">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-text-main dark:text-text-dark-main marker:content-none transition-colors group-hover:bg-primary/5">
                {item.q}
                <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-4 pb-4 pt-0 text-sm leading-relaxed text-text-secondary dark:text-text-dark-secondary">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="px-4 py-12 md:py-20 text-center">
        <div className="w-full max-w-[800px] mx-auto flex flex-col items-center gap-6 rounded-3xl bg-[#ee862b] p-8 md:p-12 shadow-xl shadow-primary/25 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-white">pets</span>
          </div>
          <div className="absolute bottom-0 left-0 p-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[100px] text-white">card_giftcard</span>
          </div>

          <h2 className="relative z-10 text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Pronto para ver o <br className="hidden md:block" /> rabinho abanando?
          </h2>
          <p className="relative z-10 text-white/90 text-base md:text-lg font-medium max-w-[500px]">
            Junte-se a milhares de tutores que transformam a vida dos seus pets todos os meses.
          </p>
          <Link to="/montar-box" className="relative z-10 mt-2 bg-white text-primary text-lg font-bold py-4 px-8 rounded-full shadow-lg hover:bg-neutral-50 hover:scale-105 transition-all w-full md:w-auto">
            Assinar Pet Box Agora
          </Link>
          <p className="relative z-10 text-white/70 text-xs font-medium mt-2">
            Satisfação garantida ou seu dinheiro de volta
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-8 px-5 py-10 text-center @container border-t border-[#e7dacf] dark:border-white/10 bg-surface-light dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors" href="#">Termos</a>
            <a className="text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors" href="#">Privacidade</a>
            <a className="text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors" href="#">Ajuda</a>
          </div>
          <p className="text-text-secondary/60 dark:text-text-dark-secondary/60 text-xs font-normal leading-normal">
            © 2024 Pet Box. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <Link
        to="/montar-box"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-4 rounded-full shadow-xl shadow-primary/40 transition-all duration-300 group ${showFab
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-20 opacity-0 scale-90 pointer-events-none'
          }`}
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          pets
        </span>
        <span className="hidden sm:inline">Montar Box</span>
        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </Link>
    </div>
  );
};

export default Home;