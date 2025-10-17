
  const openPopup = document.getElementById('openPopup');
  const closePopup = document.getElementById('closePopup');
  const popup = document.getElementById('productPopup');

  openPopup.addEventListener('click', () => {
    popup.classList.remove('hidden');
    popup.classList.add('flex');
  });

  closePopup.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.classList.add('hidden');
  });




  gsap.from(".relative.z-10", {
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".relative.z-10",
      start: "top 80%"
    }
  });


  
    // ---------- Simple SPA-ish navigation (hash)
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        const href = a.getAttribute('href');
        if(href && href.startsWith('#')) {
          const el = document.querySelector(href);
          if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
        }
      });
    });

    // ---------- GSAP: entrance animations
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.logo', {y:-8, opacity:0, duration:0.8, delay:0.2});
    gsap.from('h1,h2,h3', {y:20, opacity:0, duration:0.9, stagger:0.06, ease:'power3.out'});

    gsap.utils.toArray('.glass').forEach((el,i)=>{
      gsap.from(el, {
        y: 30, opacity: 0, duration: 0.8, delay: 0.12 + i*0.04, ease:'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' }
      });
    });

    // ---------- Bottle micro-parallax on pointer
    const bottle = document.getElementById('bottle');
    document.addEventListener('pointermove', (e)=>{
      const cx = window.innerWidth/2, cy = window.innerHeight/2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      if(bottle) gsap.to(bottle, {rotationY: dx * 6, rotationX: -dy * 6, transformPerspective:900, duration: 0.7, ease:'power2.out'});
    });

    // ---------- Product modal logic
    const modal = document.getElementById('productModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const closeModalBtn = document.getElementById('closeModal');

    document.querySelectorAll('.show-popup').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const card = e.target.closest('article');
        const img = card.querySelector('img')?.src || '';
        const title = card.querySelector('h3')?.innerText || 'Produit';
        const desc = card.querySelector('p')?.innerText || '';
        const price = card.querySelector('.text-lg')?.innerText || card.querySelector('.text-2xl')?.innerText || '—';

        if(img) modalImg.src = img;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modalPrice.innerText = price;

        modal.classList.remove('hidden');
        gsap.fromTo(modal, {autoAlpha:0},{autoAlpha:1, duration:0.4});
        gsap.from('#productModal .glass', {y:18, scale:0.99, opacity:0, duration:0.55});
      });
    });

    function closeModal(){
      gsap.to(modal, {autoAlpha:0, duration:0.35, onComplete: ()=> modal.classList.add('hidden')});
    }
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });
    window.addEventListener('keydown', (e)=> { if(e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });

    // ---------- Buy button demo toast
    document.getElementById('buyBtn')?.addEventListener('click', ()=>{
      gsap.to('#buyBtn', {scale:0.98, duration:0.08, yoyo:true, repeat:1});
      const t = document.createElement('div');
      t.innerText = 'Ajouté au panier (exemple)';
      t.className = 'fixed right-6 bottom-6 p-3 rounded bg-white/6 text-gray-100 shadow-lg';
      document.body.appendChild(t);
      gsap.fromTo(t, {y:20, autoAlpha:0}, {y:0, autoAlpha:1, duration:0.4});
      setTimeout(()=> gsap.to(t, {y:20, autoAlpha:0, duration:0.5, onComplete: ()=> t.remove()}), 1500);
    });

    // ---------- Music toggle
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let musicOn = false;
    musicToggle?.addEventListener('click', ()=>{
      musicOn = !musicOn;
      if(musicOn){ bgMusic.volume = 0.18; bgMusic.play(); musicToggle.classList.add('gold'); musicToggle.textContent = 'Musique: ON' }
      else { bgMusic.pause(); musicToggle.classList.remove('gold'); musicToggle.textContent = 'Musique' }
    });

    // ---------- Small interactions
    document.querySelectorAll('button, a').forEach(el=>{
      el.addEventListener('pointerenter', ()=> gsap.to(el, {scale:1.03, duration:0.12}));
      el.addEventListener('pointerleave', ()=> gsap.to(el, {scale:1, duration:0.12}));
    });

    // ---------- Accessibility: focus styles for cards
    document.addEventListener('focusin', (e)=>{
      const c = e.target.closest('.glass');
      if(c) c.style.outline = '1px solid rgba(201,163,90,0.12)';
    });
    document.addEventListener('focusout', (e)=>{
      document.querySelectorAll('.glass').forEach(c => c.style.outline = '');
    });
