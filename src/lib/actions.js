export function fadeIn(node) {
	requestAnimationFrame(() => {
		node.classList.add('opacity-100', 'translate-y-0');
		node.classList.remove('opacity-0', 'translate-y-8');
	});

	return {
		destroy() {}
	};
}
