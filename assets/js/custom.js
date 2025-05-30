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

// add glass effect to navbar when scrolled
document.addEventListener('DOMContentLoaded', (event) => {
  const navbar = document.querySelector('.navbar');
  let isScrolled = false;

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 0 && !isScrolled) {
      navbar.classList.add('glass');
      isScrolled = true;
    } else if (scrollTop === 0 && isScrolled) {
      navbar.classList.remove('glass');
      isScrolled = false;
    }
  };

  window.addEventListener('scroll', handleScroll);
});
