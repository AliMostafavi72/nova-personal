/**
 * Modern Stellar.js (Vanilla JS) - Parallax Plugin
 * Optimized by Hegmata Web - https://hegmata-web.ir
 */

class Stellar {
	constructor(options = {}) {
		// Default options
		this.options = {
			scrollProperty: 'scroll',       // نوع اسکرول (scroll / transform)
			positionProperty: 'transform',  // نحوه حرکت عناصر
			horizontalScrolling: true,
			verticalScrolling: true,
			horizontalOffset: 0,
			verticalOffset: 0,
			parallaxElements: true,
			parallaxBackgrounds: true,
			hideDistantElements: true,
			...options
		};

		this.particles = [];
		this.backgrounds = [];

		// Viewport info
		this.viewportWidth = window.innerWidth;
		this.viewportHeight = window.innerHeight;
		this.viewportOffsetTop = 0;
		this.viewportOffsetLeft = 0;

		this.currentScrollTop = 0;
		this.currentScrollLeft = 0;

		this.init();
	}

	// ===================== Init =====================
	init() {
		this._findParticles();
		this._findBackgrounds();
		this._handleScroll();
		this._handleResize();
	}

	// ===================== Find parallax elements =====================
	_findParticles() {
		if (!this.options.parallaxElements) return;

		const elements = document.querySelectorAll('[data-stellar-ratio]');
		this.particles = [];

		elements.forEach(el => {
			const rect = el.getBoundingClientRect();
			const offsetTop = rect.top + window.scrollY;
			const offsetLeft = rect.left + window.scrollX;

			this.particles.push({
				el: el,
				startingTop: offsetTop,
				startingLeft: offsetLeft,
				ratio: parseFloat(el.dataset.stellarRatio) || 1,
				isHidden: false
			});
		});
	}

	// ===================== Find parallax backgrounds =====================
	_findBackgrounds() {
		if (!this.options.parallaxBackgrounds) return;

		const elements = document.querySelectorAll('[data-stellar-background-ratio]');
		this.backgrounds = [];

		elements.forEach(el => {
			const style = window.getComputedStyle(el);
			const bg = style.backgroundPosition.split(' ');

			this.backgrounds.push({
				el: el,
				ratio: parseFloat(el.dataset.stellarBackgroundRatio) || 1,
				startingX: bg[0] || '0px',
				startingY: bg[1] || '0px'
			});
		});
	}

	// ===================== Handle scroll =====================
	_handleScroll() {
		const update = () => {
			const scrollTop = window.scrollY;
			const scrollLeft = window.scrollX;

			// Update particles
			this.particles.forEach(p => {
				let newTop = p.startingTop - scrollTop * (p.ratio - 1);
				let newLeft = p.startingLeft - scrollLeft * (p.ratio - 1);

				if (this.options.verticalScrolling) p.el.style.transform = `translateY(${newTop - p.startingTop}px)`;
				if (this.options.horizontalScrolling) p.el.style.transform += ` translateX(${newLeft - p.startingLeft}px)`;
			});

			// Update backgrounds
			this.backgrounds.forEach(b => {
				const newY = parseFloat(b.startingY) - scrollTop * (b.ratio - 1);
				const newX = parseFloat(b.startingX) - scrollLeft * (b.ratio - 1);

				b.el.style.backgroundPosition = `${newX}px ${newY}px`;
			});

			requestAnimationFrame(update);
		};

		requestAnimationFrame(update);
	}

	// ===================== Handle resize =====================
	_handleResize() {
		window.addEventListener('resize', () => {
			this.viewportWidth = window.innerWidth;
			this.viewportHeight = window.innerHeight;

			this._findParticles();
			this._findBackgrounds();
		});
	}
}

// ===================== Init plugin =====================
document.addEventListener('DOMContentLoaded', () => {
	window.stellar = new Stellar({
		horizontalScrolling: false, // مثال: فقط عمودی
	});
});
