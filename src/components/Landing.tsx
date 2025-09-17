import React, { useState, useEffect, useRef } from 'react';
import '../globals.css';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const fixedTextRef = useRef<HTMLDivElement | null>(null);
  const section2ContentRef = useRef<HTMLDivElement | null>(null);
  const section3ContentRef = useRef<HTMLDivElement | null>(null);
  const section4ContentRef = useRef<HTMLDivElement | null>(null);
  const section5ContentRef = useRef<HTMLDivElement | null>(null);
  const avatarsRef = useRef<(HTMLImageElement | null)[]>([]);
  const parallaxRef = useRef<(HTMLDivElement | null)[]>([]);

  // Track current visible section
  const [currentSection, setCurrentSection] = useState(1);

  const sectionConfigs: { [key: number]: { color: string; } } = {
    1: { color: '#FFFFFF' }, // White (Hero)
    2: { color: '#FF1B6B' }, // Bright Pink
    3: { color: '#292929' }, // Black
    4: { color: '#FFFFFF' }, // Light Gray
    5: { color: '#FFFFFF' }  // White (Final)
  };

  interface AvatarItem {
    imageUrl: string;
    class: string;
    size: string;
    baseWidth: number;
    baseHeight: number;
    positionClasses: string;
  }

  const commonAvatarWidth = 120;
  const commonAvatarHeight = 120;
  const commonAvatarSizeClass = 'w-28 h-28 md:w-28 md:h-28 lg:w-36 lg:h-36';

  const avatarData: AvatarItem[] = [
    // Top row
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848933/3_p5ll41.png', class: 'avatar-1', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'left-8 top-16 sm:left-12 sm:top-20' },
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/4_fymrev.png', class: 'avatar-2', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'right-8 top-16 sm:right-12 sm:top-20' },

    // Middle-top row
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/6_tufyle.png', class: 'avatar-3', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'left-20 top-40 sm:left-28 sm:top-44 md:left-36 md:top-48' },
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/5_hbo13q.png', class: 'avatar-4', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'right-20 top-40 sm:right-28 sm:top-44 md:right-36 md:top-48' },

    // Middle row
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/7_jnabcr.png', class: 'avatar-5', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'left-4 top-1/2 transform -translate-y-1/2 sm:left-6' },
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848933/2_lbu6s9.png', class: 'avatar-6', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'right-4 top-1/2 transform -translate-y-1/2 sm:right-6' },

    // Bottom row
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/9_ziillq.png', class: 'avatar-7', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'left-16 bottom-20 sm:left-24 sm:bottom-24 md:left-32' },
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/8_vdlo4t.png', class: 'avatar-8', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'right-16 bottom-20 sm:right-24 sm:bottom-24 md:right-32' }
  ];

  // Section content visibility observer - FIXED VERSION
  useEffect(() => {
    const observerOptions = {
      threshold: [0.3, 0.7],
      rootMargin: '-10% 0px -10% 0px',
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const sectionNumber = parseInt(sectionId.replace('section', ''));

        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setCurrentSection(sectionNumber);
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) sectionObserver.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) sectionObserver.unobserve(section);
      });
    };
  }, []);

  // Update text content based on current section - FIXED VERSION
  useEffect(() => {
    const contents: { [key: number]: HTMLDivElement | null } = {
      1: fixedTextRef.current,
      2: section2ContentRef.current,
      3: section3ContentRef.current,
      4: section4ContentRef.current,
      5: section5ContentRef.current
    };

    Object.values(contents).forEach(content => {
      if (content) {
        gsap.to(content, { opacity: 0, duration: 0.3 });
      }
    });

    if (contents[currentSection]) {
      gsap.to(contents[currentSection], { opacity: 1, duration: 0.5, delay: 0.1 });
    }
  }, [currentSection]);

  // GSAP ANIMATION LOGIC FOR AVATARS (Sequential Reveal)
  useEffect(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    avatarsRef.current.forEach((img, index) => {
      if (!img) return;

      gsap.set(img, { opacity: 0, y: 50, scale: 0.8 });

      gsap.to(img, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "back.out(1.7)",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: img,
          start: "top center+=50",
          end: "top center-=150",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // FIXED BACKGROUND COLOR TRANSITIONS
  useEffect(() => {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id && (trigger.vars.id as string).startsWith("globalBgTransition")) {
        trigger.kill();
      }
    });

    const body = document.body;
    gsap.set(body, { backgroundColor: sectionConfigs[1].color });

    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      const currentSectionNumber = index + 1;
      const nextSectionNumber = index + 2;
      const nextSectionColor = sectionConfigs[nextSectionNumber]?.color;

      if (nextSectionColor && nextSectionNumber <= 5) {
        gsap.to(body, {
          backgroundColor: nextSectionColor,
          duration: 0.5,
          ease: "power2.inOut",
          scrollTrigger: {
            id: `globalBgTransition${currentSectionNumber}`,
            trigger: section,
            start: "bottom 70%",
            end: "bottom 30%",
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (currentSectionNumber === 2 && nextSectionNumber === 3) {
                const progress = self.progress;
                const startColor = sectionConfigs[2].color;
                const endColor = sectionConfigs[3].color;
                gsap.set(body, { backgroundColor: gsap.utils.interpolate(startColor, endColor, progress) });
              }
            }
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id && (trigger.vars.id as string).startsWith("globalBgTransition")) {
          trigger.kill();
        }
      });
    };
  }, [sectionsRef.current.length]);

  // BACKGROUND PARALLAX ELEMENTS
  useEffect(() => {
    let ticking = false;

    function updateBackgroundParallax() {
      const scrolled = window.scrollY;
      parallaxRef.current.forEach((element) => {
        if (element) {
          element.style.transform = `translateY(${scrolled * -0.1}px)`;
        }
      });
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateBackgroundParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    return () => window.removeEventListener('scroll', requestTick);
  }, []);

  return (
    <>
      <div className="overflow-x-hidden">
        {/* Fixed centered text with dynamic color based on background */}
        <div ref={el => { fixedTextRef.current = el; }} className="fixed-text text-center max-w-4xl px-4">
          <div className="mt-[-20%]">
            <img
              src='https://res.cloudinary.com/dyczhwkws/image/upload/v1750281254/JMPN_tpufgy.png'
              alt="Logo"
              className="w-auto h-auto max-w-full mx-auto"
            />
          </div>
          <p className="text-md md:text-xl opacity-80 max-w-2xl mx-auto mt-[-15%]">
            No summer breaks! Only summer breakthroughs. Commitment to fitness is a year-round journey. Let's stay fit for life!
          </p>
        </div>

        {/* Section 1: White Hero */}
        <section
          id="section1"
          ref={el => { sectionsRef.current[0] = el; }}
          className="relative h-screen flex flex-col justify-center items-center text-gray-900 overflow-hidden"
        >
          <div ref={el => { parallaxRef.current[0] = el; }} className="bg-image-moving hero-image absolute inset-0"></div>
          <div className="absolute inset-0 from-transparent to-white/20"></div>
          <div className="parallax-element parallax-back hero-image"></div>

          {/* Moving Avatars with improved spacing */}
          <div className="floating-avatars absolute inset-0 pointer-events-none">
            {avatarData.map((avatar, index) => (
              <img
                key={index}
                src={avatar.imageUrl}
                alt={`Avatar ${index + 1}`}
                className={`rounded-full object-cover absolute ${avatar.class} ${avatar.size} ${avatar.positionClasses}`}
                ref={el => { avatarsRef.current[index] = el as HTMLImageElement; }}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Pink Transition */}
        <section
          id="section2"
          ref={el => { sectionsRef.current[1] = el; }}
          className="section-transition relative h-screen flex flex-col justify-center items-center text-white overflow-hidden"
        >
          <div ref={el => { parallaxRef.current[1] = el; }} className="bg-image-moving sport-image-1 absolute inset-0"></div>
          <div className="parallax-element parallax-back sport-image-1"></div>
          <div
            ref={el => { section2ContentRef.current = el; }}
            className="content-container text-center max-w-5xl px-6 md:px-8 opacity-0"
          >
            <img
              src='https://res.cloudinary.com/dyczhwkws/image/upload/v1750280550/4_xs5x70.png'
              alt="Logo"
              className="w-auto h-auto max-w-full mx-auto"
            />
            <span className="block text-accent text-2xl mb-8 pb-12">Let's stay <b className='text-3xl'>fit for life</b>! I am committed to empower through movement and encourage others to build on their strengths. and maintain good habits</span>
          </div>
        </section>

        {/* Section 3: Black transition */}
        <section
          id="section3"
          ref={el => { sectionsRef.current[2] = el; }}
          className="section-transition relative h-screen flex flex-col justify-center items-center text-white overflow-hidden"
        >
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          >
            <source src="https://res.cloudinary.com/dyczhwkws/video/upload/yplsk8xffg8auhaopprt.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 animate-pulse"></div>
          <div ref={el => { parallaxRef.current[2] = el; }} className="bg-image-moving sport-image-2 absolute inset-0"></div>
          <div className="parallax-element parallax-back sport-image-2"></div>
          <div
            ref={el => { section3ContentRef.current = el; }}
            className="content-container text-center max-w-4xl px-0 opacity-0 "
          >
            <div className="text-xl md:text-xl font-bold">
              <div>
                <img
                  src='https://res.cloudinary.com/dyczhwkws/image/upload/v1750280551/5_uzresn.png'
                  alt="Logo"
                  width={500}
                  height={500}
                />
                <p className=" mt-[-20%] text-lg md:text-2xl opacity-90">
                  Join us for out virtual group sessions.
                  <br /> 6AM  - 7AM <br />
                  Monday / Wednesday / Friday
                </p>
                <a
                  href="mailto:contact@rachelstroy.com"
                  className="bg-[#FF1B6B] text-white mt-8 py-2 px-4 rounded-full font-semibold inline-block text-center whitespace-nowrap hover:bg-white hover:text-[#FF1B6B] focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:ring-opacity-75 transition ease-in-out duration-300 border border-transparent hover:border-[#FF1B6B] "
                >
                  Email for Zoom Link
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Light Gray/White */}
        <section
          id="section4"
          ref={el => { sectionsRef.current[3] = el; }}
          className="section-transition relative h-screen flex flex-col justify-center items-center text-gray-900 overflow-hidden"
        >
          <div ref={el => { parallaxRef.current[3] = el; }} className="bg-image-moving sport-image-3 absolute inset-0"></div>
          <div className="parallax-element parallax-back sport-image-3"></div>
          <div
            ref={el => { section4ContentRef.current = el; }}
            className="content-container text-center max-w-5xl px-6 md:px-8 opacity-0"
          >
            <div className='avatar-image mt-[40%] mb-0 md:mb-4 ' style={{ display: 'flex', justifyContent: 'center' }} >
              <img
                alt="image of woman excercising"
                className="md:w-[200px] md:h-[200px] w-[150px] h-[150px]"
                src='https://res.cloudinary.com/dyczhwkws/image/upload/v1749848933/2_lbu6s9.png'
              />
            </div>
            <div className="text-6xl md:text-7xl font-bold" style={{ display: 'flex', justifyContent: 'center' }} >
              <img
                alt="meet rachel text"

                src='https://res.cloudinary.com/dyczhwkws/image/upload/v1750280551/7_r40pvq.png'
                width={500}
                height={500}
              />


            </div>
            <p className="mt-[10%] ">
              <b>Always on, high energy, and unmatched!</b> Rachel, an ACE certified personal trainer, is your dedicated partner, ready to empower you through every step of your fitness journey. With a specialized focus on bodyweight movements, she'll guide you through effective <b>HIIT</b> flows and challenging cardio sessions to help you <b>build strength</b>, enhance conditioning, and refine your <b>balance</b>. Rachel is ready to help you push beyond your expectations—wherever you are, whenever you're ready. <b>Jump in</b> and let's get started!
            </p>
          </div>
        </section>

        {/* Final section */}
        <section
          id="section5"
          ref={el => { sectionsRef.current[4] = el; }}
          className="section-transition relative flex flex-col h-screen justify-center items-center text-gray-900 overflow-hidden "
        >
          <div
            ref={el => { section5ContentRef.current = el; }}
            className="content-container text-center max-w-4xl  px-6 opacity-0 mt-[30%]"
          >

            <img
              src='https://res.cloudinary.com/dyczhwkws/image/upload/v1750280550/6_pih1ku.png'
              alt="Logo"
              width={500}
              height={500}
              className="w-auto h-auto mx-auto"
            />
            <p className="text-lg md:text-xl opacity-90 mb-8 mt-[-20%]">
              Beyond the workout, beyond the session—your evolution is ongoing. Plug into our network for daily inspiration, expert tips, and a community dedicated to peak performance. Let's build consistency together.
            </p>
            <div className='p-8'>
              <a href="https://venmo.com/u/RAE-WHOO-1" target="_blank" rel="noopener noreferrer">
                <button className="bg-[#E8175D] text-white p-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors mr-4">
                  Venmo
                </button>
              </a>
              <a href="https://www.tiktok.com/@your-handle" target="_blank" rel="noopener noreferrer">
                <button className="bg-[#E8175D] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors mr-4">
                  Tik Tok
                </button>
              </a>
              <a href="mailto:contact@rachelstroy.com">
                <button className="bg-[#E8175D] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors">
                  Email
                </button>
              </a>
            </div>
            <div className="w-full max-w-lg mx-auto mt-[20%] pb-4">
              <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/playlist/02LtXdK3vRDKtKSiQxuTIq?utm_source=generator"
                width="100%"
                height="352"
                frameBorder={0}
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
      <Link to="/login" className="fixed bottom-6 right-6 z-50">
        <div className=" rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer ">
          <img
            src="/assets/boltjmpn.png"
            alt="Bolt logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </Link>
    </>
  );
}