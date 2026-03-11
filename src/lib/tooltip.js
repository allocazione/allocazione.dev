export function tooltip(node, text) {
  let tooltipNode;

  const show = () => {
    if (tooltipNode) return;

    tooltipNode = document.createElement("div");
    tooltipNode.className = "pointer-events-none fixed z-[9999] whitespace-nowrap rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-black shadow-xl tracking-tight transition-all duration-150 ease-out opacity-0 scale-95 origin-bottom";
    
    tooltipNode.innerHTML = `
      ${text}
      <span class="absolute left-1/2 top-full -translate-x-1/2 -mt-px border-x-[5px] border-x-transparent border-t-[5px] border-t-accent"></span>
    `;
    
    document.body.appendChild(tooltipNode);

    const nodeRect = node.getBoundingClientRect();
    const tooltipRect = tooltipNode.getBoundingClientRect();

    const left = nodeRect.left + (nodeRect.width / 2) - (tooltipRect.width / 2);
    const top = nodeRect.top - tooltipRect.height - 8;

    tooltipNode.style.left = `${left}px`;
    tooltipNode.style.top = `${top}px`;
    void tooltipNode.offsetWidth;

    tooltipNode.style.opacity = '1';
    tooltipNode.style.transform = 'scale(1)';
  };

  const hide = () => {
    if (tooltipNode) {
        const el = tooltipNode;
        tooltipNode = null;
        
        el.style.opacity = '0';
        el.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }, 150);
    }
  };

  node.addEventListener('mouseenter', show);
  node.addEventListener('mouseleave', hide);

  return {
      update(newText) {
          text = newText;
          if (tooltipNode) {
              tooltipNode.innerHTML = `
                ${text}
                <span class="absolute left-1/2 top-full -translate-x-1/2 -mt-px border-x-[5px] border-x-transparent border-t-[5px] border-t-accent"></span>
              `;
          }
      },
      destroy() {
          node.removeEventListener('mouseenter', show);
          node.removeEventListener('mouseleave', hide);
          if (tooltipNode && tooltipNode.parentNode) {
              tooltipNode.parentNode.removeChild(tooltipNode);
          }
      }
  };
}
