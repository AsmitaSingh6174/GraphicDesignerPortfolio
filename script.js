const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => observer.observe(element));

// Project video play/pause behavior
const playButtons = document.querySelectorAll('.play-button');
const videos = document.querySelectorAll('.project-video');

function pauseAllExcept(active) {
  videos.forEach((v) => {
    if (v !== active) {
      v.pause();
      v.currentTime = 0;
      const btn = v.closest('.project-media')?.querySelector('.play-button');
      if (btn) btn.style.display = '';
    }
  });
}

playButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const media = btn.closest('.project-media');
    if (!media) return;
    const vid = media.querySelector('.project-video');
    if (!vid) return;
    if (vid.paused) {
      pauseAllExcept(vid);
      vid.style.display = 'block';
      vid.play().catch(() => {});
      btn.style.display = 'none';
    } else {
      vid.pause();
      btn.style.display = '';
    }
  });
});

videos.forEach((v) => {
  v.addEventListener('play', () => {
    const btn = v.closest('.project-media')?.querySelector('.play-button');
    if (btn) btn.style.display = 'none';
  });
  v.addEventListener('pause', () => {
    const btn = v.closest('.project-media')?.querySelector('.play-button');
    if (btn) btn.style.display = '';
  });
  v.addEventListener('ended', () => {
    const btn = v.closest('.project-media')?.querySelector('.play-button');
    if (btn) btn.style.display = '';
    v.currentTime = 0;
  });
});
