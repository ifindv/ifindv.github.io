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
