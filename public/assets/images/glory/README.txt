oloigbe.html currently uses placeholder polaroid frames (plain <div class="ph">
boxes with italic caption text) so the page doesn't look empty. Each one is
marked with a TODO(photo) HTML comment right above it in oloigbe.html.

When you have real photos of the two of you, drop them here and replace each
placeholder with a real <img class="ph" src="..." alt=""> inside the same
.polaroid wrapper, e.g.:

  hero.jpg   — the hero section's polaroid, at the top of the page
  1.jpg      — 1st "moments" scatter photo
  2.jpg      — 2nd
  3.jpg      — 3rd
  4.jpg      — 4th

Example swap, in the hero section:
  <div class="polaroid"><div class="ph">photograph — the two of you</div></div>
becomes
  <div class="polaroid"><img class="ph" src="/assets/images/glory/hero.jpg" alt=""></div>

And in the "moments" scatter, each:
  <figure class="polaroid"><div class="ph">photo</div></figure>
becomes
  <figure class="polaroid"><img class="ph" src="/assets/images/glory/1.jpg" alt=""></figure>

The scatter currently has 4 photos but supports more — just copy one of the
existing <figure class="polaroid">...</figure> blocks in the "Moments" section
of oloigbe.html and point its <img> at 5.jpg / 6.jpg, etc.

This README is just a placeholder guide — delete it once the real photos are
in place.
