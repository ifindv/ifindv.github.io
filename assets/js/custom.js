// add copy button for code block
document.addEventListener('DOMContentLoaded', (event) => {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach((block) => {
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.textContent = 'copy';
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      const code = block.querySelector('code');
      if (code) {
        const textArea = document.createElement('textarea');
        textArea.value = code.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        button.textContent = 'copied';
        setTimeout(() => {
          button.textContent = 'copy';
        }, 2000)
      }
    });
    block.appendChild(button);
  });
});

// add glass effect to header when scrolled
document.addEventListener('DOMContentLoaded', (event) => {
  const header = document.querySelector('.header');
  let isScrolled = false;

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 0 && !isScrolled) {
      header.classList.add('glass');
      isScrolled = true;
    } else if (scrollTop === 0 && isScrolled) {
      header.classList.remove('glass');
      isScrolled = false;
    }
  };

  window.addEventListener('scroll', handleScroll);
});

// banner auto scroll and height adjustment
let currentIndex = 0;
const banners = document.querySelectorAll('.section-banner');
const header = document.querySelector('.header');
const interval = 5000; // 5 seconds

function setBannerHeight(banner) {
  if (header && banner) {
    const headerHeight = header.offsetHeight;
    const viewportHeight = window.innerHeight;
    banner.style.minHeight = `${viewportHeight}px`;
    if (header.classList.contains('sticky')) {
      banner.style.paddingTop = `${headerHeight}px`;
    }
  }
}

banners.forEach(banner => {
  setBannerHeight(banner);
});

function switchBanner() {
  banners.forEach((banner, index) => {
    if (index === currentIndex) {
      setBannerHeight(banner);
      banner.style.display = 'block';
      setTimeout(() => setBannerHeight(banner), 10);
    } else {
      banner.style.display = 'none';
    }
  });
  currentIndex = (currentIndex + 1) % banners.length;
}

window.addEventListener('resize', () => {
  banners.forEach(banner => {
    setBannerHeight(banner);
  });
});

setInterval(switchBanner, interval);
switchBanner(); // Initialize the first banner

// feature section height adjustment
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const features = document.querySelectorAll('.section-favor');
  function setFeatureHeight(feature) {
    if (header && feature) {
      const headerHeight = header.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      feature.style.minHeight = `${viewportHeight}px`;
      
      if (header.classList.contains('sticky')) {
        if (!feature.dataset.paddingApplied) {
          const currentPadding = parseInt(getComputedStyle(feature).paddingTop) || 0;
          feature.style.paddingTop = `${currentPadding + headerHeight}px`;
          feature.dataset.paddingApplied = 'true';
        }
      }
    }
  }

  function initFeatureHeights() {
    features.forEach(feature => {
      setFeatureHeight(feature);
    });
  }
  
  initFeatureHeights();
  window.addEventListener('resize', initFeatureHeights);
  window.addEventListener('scroll', initFeatureHeights);
});

// content table smooth scroll
document.addEventListener('DOMContentLoaded', function() {
  const fixedHeader = document.querySelector('.header');
  const headerHeight = fixedHeader ? fixedHeader.offsetHeight : 0;
  const tocLinks = document.querySelectorAll('#TableOfContents a');
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});

// auto scroll to content table on page load
window.addEventListener('load', function() {
  const targetToc = document.querySelector('.table-of-content.blog');
  const fixedHeader = document.querySelector('.header');
  const headerHeight = fixedHeader ? fixedHeader.offsetHeight : 0;

  if (targetToc) {
    const tocTop = targetToc.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({
      top: tocTop,
      behavior: 'smooth'
    });
  }
});

// scroll to content table and bottom buttons
document.addEventListener('DOMContentLoaded', function() {
  const scrollToTocBtn = document.getElementById('scrollToToc');
  const scrollToBottomBtn = document.getElementById('scrollToBottom');
  const targetToc = document.querySelector('.table-of-content.blog');
  const fixedHeader = document.querySelector('.header');
  const headerHeight = fixedHeader ? fixedHeader.offsetHeight : 0;
  
  function toggleButtons() {
    if (targetToc) {
      const tocPosition = targetToc.getBoundingClientRect().top + window.pageYOffset;
      if (window.pageYOffset > tocPosition + 100 || window.pageYOffset < tocPosition - 100) {
        scrollToTocBtn.classList.remove('opacity-0', 'invisible');
        scrollToTocBtn.classList.add('opacity-100', 'visible');
        
        scrollToBottomBtn.classList.remove('opacity-0', 'invisible');
        scrollToBottomBtn.classList.add('opacity-100', 'visible');
      } else {
        scrollToTocBtn.classList.remove('opacity-100', 'visible');
        scrollToTocBtn.classList.add('opacity-0', 'invisible');
      }
    }
  }
  
  function scrollToToc() {
    if (targetToc) {
      const tocTop = targetToc.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: tocTop,
        behavior: 'smooth'
      });
    }
  }
  
  function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
  
  window.addEventListener('scroll', toggleButtons);
  scrollToTocBtn.addEventListener('click', scrollToToc);
  scrollToBottomBtn.addEventListener('click', scrollToBottom);
  
  toggleButtons();
});
