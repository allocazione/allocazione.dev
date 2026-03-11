export const handle = async ({ event, resolve }) => {
	const accentColor = event.cookies.get('accent_color') || '#e16666';

	const hexToRgbStr = (hex) => {
		if (!hex || hex.length < 7) return '225, 102, 102';
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `${r}, ${g}, ${b}`;
	};

	const accentRgb = hexToRgbStr(accentColor);

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%accent%', accentColor)
				.replace('%accent_rgb%', accentRgb)
	});

	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline'",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"font-src 'self' https://fonts.gstatic.com",
			"img-src 'self' data: https://github.com https://*.githubusercontent.com https://cdn.stats.fm https://*.stats.fm https://i.scdn.co https://mosaic.scdn.com https://is1-ssl.mzstatic.com https://www.transparenttextures.com",
			"connect-src 'self' https://beta-api.stats.fm https://api.github.com",
			"frame-ancestors 'none'"
		].join('; ')
	);

	return response;
};
