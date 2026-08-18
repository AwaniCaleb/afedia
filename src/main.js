// The "soft & intimate" redesign (see docs/afedia-redesign-build-brief.md) is
// static markup with one small exception, added in the v4 refinement pass:
// the footer's "Connect" button opens a modal with monochrome social icons.
// oloigbe.html has no such interaction and doesn't load this file.
document.addEventListener('DOMContentLoaded', () => {
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
});
