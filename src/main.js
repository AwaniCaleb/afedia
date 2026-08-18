// The "soft & intimate" redesign (see docs/afedia-redesign-build-brief.md) is
// mostly static markup, with three small interactive pieces added across the
// v4/v5 passes: the footer's "Connect" modal, a 3D hover tilt on every
// polaroid, and a scroll-stagger entrance for gallery/moments grids.
// oloigbe.html doesn't load this file — it stays self-contained and has its
// own inline copy of the polaroid motion logic (no Connect modal there).
document.addEventListener('DOMContentLoaded', () => {
	initConnectModal();
	initPolaroidTilt();
	initScrollStagger();
});

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
