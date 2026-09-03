/* ==========================================================================
   SPARKSTUDYVALE — JAVASCRIPT CONTROLLERS
   Cognitive Retention Simulator, Theme Switcher, Search & Typography
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Reading Progress Bar
  const progressBar = document.querySelector('.reading-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    });
  }

  // 2. 3-Mode Theme Switcher (Oxford Midnight -> Campus Daylight -> Deep Neural Focus)
  const themeBtn = document.querySelector('.theme-toggle-btn');
  const themes = ['theme-midnight', 'theme-daylight', 'theme-focus'];
  const themeIcons = ['⚡', '☀️', '🧠'];
  
  let currentThemeIndex = 0;
  const savedTheme = localStorage.getItem('sparkstudyvale_edu_theme');
  if (savedTheme) {
    const idx = themes.indexOf(savedTheme);
    if (idx !== -1) {
      currentThemeIndex = idx;
      if (savedTheme !== 'theme-midnight') {
        document.body.classList.add(savedTheme);
      }
    }
  }

  if (themeBtn) {
    themeBtn.textContent = themeIcons[currentThemeIndex];
    themeBtn.addEventListener('click', () => {
      document.body.classList.remove('theme-daylight', 'theme-focus');
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const newTheme = themes[currentThemeIndex];
      
      if (newTheme !== 'theme-midnight') {
        document.body.classList.add(newTheme);
      }
      themeBtn.textContent = themeIcons[currentThemeIndex];
      localStorage.setItem('sparkstudyvale_edu_theme', newTheme);
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      navMenu.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.backgroundColor = 'var(--bg-surface)';
        navMenu.style.padding = '1.5rem';
        navMenu.style.boxShadow = 'var(--shadow-md)';
        navMenu.style.borderBottom = '1px solid var(--border-subtle)';
      }
    });
  }

  // 4. Interactive Cognitive Retention & Spaced Repetition Simulator
  const complexitySlider = document.getElementById('study-complexity-slider');
  const familiaritySlider = document.getElementById('study-familiarity-slider');
  const complexityVal = document.getElementById('study-complexity-val');
  const familiarityVal = document.getElementById('study-familiarity-val');

  const halfLifeDisplay = document.getElementById('calc-halflife');
  const scheduleDisplay = document.getElementById('calc-schedule');
  const masteryDisplay = document.getElementById('calc-mastery');

  function calculateCognitiveMetrics() {
    if (!complexitySlider || !familiaritySlider) return;

    const complexity = parseInt(complexitySlider.value, 10);
    const familiarity = parseInt(familiaritySlider.value, 10);

    let compLabel = "Foundational Knowledge";
    if (complexity >= 8) compLabel = "High Cognitive Load (Abstract/STEM)";
    else if (complexity >= 5) compLabel = "Intermediate Conceptual Complexity";

    if (complexityVal) complexityVal.textContent = `Tier ${complexity}/10 (${compLabel})`;
    if (familiarityVal) familiarityVal.textContent = `${familiarity}% Baseline Schema Foundation`;

    // Ebbinghaus half-life calculation: t1/2 = 24hrs * (familiarity/100) / (complexity*0.12)
    const halfLifeHours = Math.max(8, Math.round((24 * (familiarity / 50)) / (complexity * 0.15)));
    
    // Calculated Long-Term Recall Mastery
    const mastery = Math.min(99, Math.round(55 + (familiarity * 0.3) + (10 - complexity) * 1.5));

    // Spaced interval multiplier
    const r1 = 1;
    const r2 = Math.round(r1 * (2.2 + familiarity/50));
    const r3 = Math.round(r2 * 2.3);
    const r4 = Math.round(r3 * 2.2);

    if (halfLifeDisplay) halfLifeDisplay.textContent = `t½ = ${halfLifeHours} Hours (Memory Half-Life)`;
    if (scheduleDisplay) scheduleDisplay.textContent = `Days: +${r1}, +${r2}, +${r3}, +${r4}`;
    if (masteryDisplay) masteryDisplay.textContent = `${mastery}% Long-Term Retention`;
  }

  if (complexitySlider && familiaritySlider) {
    complexitySlider.addEventListener('input', calculateCognitiveMetrics);
    familiaritySlider.addEventListener('input', calculateCognitiveMetrics);
    calculateCognitiveMetrics();
  }

  // 5. In-Article Typography Scaler
  const fontDec = document.querySelector('.font-dec');
  const fontReset = document.querySelector('.font-reset');
  const fontInc = document.querySelector('.font-inc');
  const articleBody = document.querySelector('.article-body');

  let currentFontSize = 1.125;

  if (articleBody) {
    if (fontDec) {
      fontDec.addEventListener('click', () => {
        if (currentFontSize > 0.95) {
          currentFontSize -= 0.075;
          articleBody.style.fontSize = currentFontSize + 'rem';
        }
      });
    }
    if (fontReset) {
      fontReset.addEventListener('click', () => {
        currentFontSize = 1.125;
        articleBody.style.fontSize = '1.125rem';
      });
    }
    if (fontInc) {
      fontInc.addEventListener('click', () => {
        if (currentFontSize < 1.45) {
          currentFontSize += 0.075;
          articleBody.style.fontSize = currentFontSize + 'rem';
        }
      });
    }
  }

  // 6. Blog Archive Search & Live Filter Chips
  const searchInput = document.getElementById('study-search-input');
  const filterChips = document.querySelectorAll('.filter-chip');
  const blogCards = document.querySelectorAll('.blog-card');

  function filterPosts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeChip = document.querySelector('.filter-chip.active');
    const selectedCategory = activeChip ? activeChip.getAttribute('data-category') : 'all';

    blogCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();
      
      const matchesCategory = (selectedCategory === 'all' || cardCategory === selectedCategory);
      const matchesQuery = query === '' || text.includes(query);

      if (matchesCategory && matchesQuery) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterPosts);
  }

  if (filterChips.length > 0) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filterPosts();
      });
    });
  }

});
