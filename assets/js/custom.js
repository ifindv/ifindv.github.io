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

// banner auto scroll
let currentIndex = 0;
const banners = document.querySelectorAll('.section-banner.pt-14');
const interval = 5000; // 5 seconds

function switchBanner() {
  banners.forEach((banner, index) => {
    if (index === currentIndex) {
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
    }
  });
  currentIndex = (currentIndex + 1) % banners.length;
}

setInterval(switchBanner, interval);
switchBanner(); // Initialize the first banner
