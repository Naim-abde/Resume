(function () {
  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  function init() {
    // Hero entrance timeline
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".navbar", { y: -30, opacity: 0, duration: 0.6 })
      .from(".hero-content .badge", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
      .from(".hero-content h1", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-content > p", { y: 30, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(".hero-actions .btn", { y: 30, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.4")
      .from(".hero-stats .stat", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.4")
      .from(".mock-resume", { x: 70, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=1.3")
      .from(".float-card", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)" }, "-=0.5");

    // Hero visual parallax while scrolling
    gsap.to(".hero-visual", {
      y: -60,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Infinite gentle floating for the badges
    gsap.to(".float-card-1", { y: -10, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".float-card-2", { y: -10, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.1 });

    // Section headings
    gsap.utils.toArray(".section").forEach(function (sec) {
      gsap.from(sec.querySelectorAll(".section-head > *"), {
        scrollTrigger: { trigger: sec, start: "top 80%" },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1
      });
    });

    // Feature cards
    gsap.utils.toArray(".feature-card").forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 88%" },
        y: 60,
        opacity: 0,
        duration: 0.7,
        delay: (i % 3) * 0.12
      });
    });

    // Steps
    gsap.utils.toArray(".step").forEach(function (step, i) {
      gsap.from(step, {
        scrollTrigger: { trigger: step, start: "top 88%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.15
      });
    });

    // CTA card
    gsap.from(".cta-card", {
      scrollTrigger: { trigger: ".cta-section", start: "top 82%" },
      scale: 0.88,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out"
    });

    // Footer
    gsap.from(".footer-inner", {
      scrollTrigger: { trigger: ".footer", start: "top 95%" },
      opacity: 0,
      duration: 0.6
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
