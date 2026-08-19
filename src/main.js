// The "soft & intimate" redesign (see docs/afedia-redesign-build-brief.md) is
// mostly static markup, with a few small interactive pieces added across the
// v4/v5/v6.1 passes: the footer's "Connect" modal, a 3D hover tilt on every
// polaroid, a scroll-stagger entrance for gallery/moments grids, and the
// dark-mode toggle's click handling (the FOUC-avoiding part of that — reading
// localStorage and setting the class before first paint — runs earlier, in a
// blocking inline <script> in index.html's <head>, not here).
// oloigbe.html doesn't load this file — it stays self-contained and has its
// own inline copy of all of this (no Connect modal there).
document.addEventListener('DOMContentLoaded', () => {
	initConnectModal();
	initPolaroidTilt();
	initScrollStagger();
	initThemeToggle();
});

// Dark mode toggle (v6.1). The initial class (if any saved choice exists)
// is already applied by the inline <head> script by the time this runs —
// this only wires up the click, flipping between explicit 'dark'/'light'
// and persisting the choice. If no choice is saved yet, "current mode" is
// read from the system preference so the first click moves in the right
// direction rather than assuming light. The actual color values live on
// html.dark/html.light in src/style.css — this only ever needs to touch
// the class.
function initThemeToggle() {
	const KEY = 'theme';
	const toggle = document.getElementById('themeToggle');
	if (!toggle) return;
	const root = document.documentElement;

	toggle.addEventListener('click', () => {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const isDark = root.classList.contains('dark') || (!root.classList.contains('light') && prefersDark);
		const next = isDark ? 'light' : 'dark';
		root.classList.remove('dark', 'light');
		root.classList.add(next);
		localStorage.setItem(KEY, next);
	});
}

function initConnectModal() {
	const trigger = document.getElementById('connectTrigger');
	const modal = document.getElementById('connectModal');
	const closeBtn = document.getElementById('connectModalClose');
	if (!trigger || !modal || !closeBtn) return;

	const open = () => modal.classList.add('open');
	const close = () => modal.classList.remove('open');

	trigger.addEventListener('click', open);
	closeBtn.addEventListener('click', close);
	modal.addEventListener('click', (e) => {
		if (e.target === modal) close(); // click on backdrop, not the modal card
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') close();
	});
}

// 3D hover tilt — every polaroid site-wide, including both hero photos.
// Each photo's resting tilt lives as --rot/--ty custom properties set inline
// in the HTML (see index.html) — read here rather than hardcoded, so this
// stays in sync with whatever scattered position the CSS actually uses.
function initPolaroidTilt() {
	document.querySelectorAll('.tilt-wrap').forEach((wrap) => {
		const card = wrap.querySelector('.polaroid');
		if (!card) return;
		const style = getComputedStyle(card);
		const rot = (style.getPropertyValue('--rot') || '0deg').trim();
		const ty = (style.getPropertyValue('--ty') || '0px').trim();
		const base = `translateY(${ty}) rotate(${rot})`;

		wrap.addEventListener('mousemove', (e) => {
			const rect = wrap.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width - 0.5;
			const y = (e.clientY - rect.top) / rect.height - 0.5;
			card.style.transform = `${base} perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.05)`;
		});
		wrap.addEventListener('mouseleave', () => {
			card.style.transform = base;
		});
	});
}

// Scroll stagger — public gallery grid (oloigbe.html has its own copy for
// the moments grid). Uses a temporary transitionDuration/-Delay override
// rather than a plain CSS transition on `.scatter .polaroid`, so this slow
// one-time reveal doesn't fight with the fast hover-tilt transition that
// .tilt-wrap .polaroid needs for the same `transform` property afterward.
function initScrollStagger() {
	const items = document.querySelectorAll('.scatter .polaroid');
	if (!items.length) return;

	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			const el = entry.target;
			const index = Array.from(items).indexOf(el);
			const style = getComputedStyle(el);
			const rot = (style.getPropertyValue('--rot') || '0deg').trim();
			const ty = (style.getPropertyValue('--ty') || '0px').trim();

			el.style.transitionDuration = '0.7s';
			el.style.transitionDelay = (index * 0.12) + 's';
			el.style.transform = `translateY(${ty}) rotate(${rot})`;
			el.classList.add('in-view');

			// Both `opacity` and `transform` are transitioning with this same
			// duration/delay, so either one's transitionend marks "done" —
			// {once:true} would otherwise get consumed by whichever fires
			// first regardless of which property it was for, leaving these
			// overrides stuck and the later hover-tilt transition too slow.
			el.addEventListener('transitionend', () => {
				el.style.transitionDuration = '';
				el.style.transitionDelay = '';
			}, { once: true });

			io.unobserve(el);
		});
	}, { threshold: 0.3 });

	items.forEach((el) => io.observe(el));
}
