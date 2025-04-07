document.addEventListener('DOMContentLoaded', function () {
	// Sample gallery data - in a real application, this would come from an API
	const galleryData = [
		{
			id: 1,
			title: 'Azure Horizon',
			category: 'Nature',
			description: 'Tranquil ocean view at sunset',
			imageUrl: '/assets/images/me/1.jpg',
			date: '2025-03-15'
		},
		{
			id: 2,
			title: 'Urban Geometry',
			category: 'Urban',
			description: 'Modern architecture with bold lines',
			imageUrl: '/assets/images/me/2.jpg',
			date: '2025-03-18'
		},
		{
			id: 3,
			title: 'Chromatic Flow',
			category: 'Abstract',
			description: 'Vibrant colors in motion',
			imageUrl: '/assets/images/me/9.jpg',
			date: '2025-03-20'
		},
		{
			id: 4,
			title: 'Forest Whispers',
			category: 'Nature',
			description: 'Misty woodland scene at dawn',
			imageUrl: '/assets/images/me/4.jpg',
			date: '2025-03-22'
		},
		{
			id: 5,
			title: 'City Lights',
			category: 'Urban',
			description: 'Nighttime cityscape with illuminated buildings',
			imageUrl: '/assets/images/me/5.jpg',
			date: '2025-03-25'
		},
		{
			id: 6,
			title: 'Geometric Harmony',
			category: 'Abstract',
			description: 'Balanced shapes in pastel tones',
			imageUrl: '/assets/images/me/13.jpg',
			date: '2025-03-28'
		},
		{
			id: 6,
			title: 'Geometric Harmony',
			category: 'Abstract',
			description: 'Balanced shapes in pastel tones',
			imageUrl: '/assets/images/me/14.jpg',
			date: '2025-03-28'
		}
	];

	// Function to load gallery items
	function loadGallery(items) {
		const gallery = document.getElementById('gallery');
		gallery.innerHTML = '';

		items.forEach((item, index) => {
			setTimeout(() => {
				const galleryItem = document.createElement('div');
				galleryItem.className = 'gallery-item fade-in';
				galleryItem.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.title}" class="gallery-image">
          <div class="gallery-info hidden">
            <h3 class="text-xl font-semibold">${item.title}</h3>
            <p class="text-sm opacity-75 mt-1">${item.category}</p>
            <p class="mt-2">${item.description}</p>
            <p class="text-sm opacity-75 mt-3">${item.date}</p>
          </div>
        `;
				gallery.appendChild(galleryItem);
			}, index * 100); // Staggered loading effect
		});
	}

	// Initialize gallery
	loadGallery(galleryData);

	// Setup category filtering
	const categoryLinks = document.querySelectorAll('nav a');
	categoryLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			const category = this.textContent;

			// Remove active class from all links
			categoryLinks.forEach(link => link.classList.remove('text-blue-500'));
			// Add active class to clicked link
			this.classList.add('text-blue-500');

			if (category === 'All') {
				loadGallery(galleryData);
			} else {
				const filteredGallery = galleryData.filter(item => item.category === category);
				loadGallery(filteredGallery);
			}
		});
	});

	// Theme toggle functionality
	const themeToggle = document.getElementById('themeToggle');
	const sunIcon = document.querySelector('.sun');
	const moonIcon = document.querySelector('.moon');

	// Check for saved theme preference
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'dark') {
		document.documentElement.classList.add('dark');
		sunIcon.classList.remove('hidden');
		moonIcon.classList.add('hidden');
	}

	themeToggle.addEventListener('click', () => {
		document.documentElement.classList.toggle('dark');
		sunIcon.classList.toggle('hidden');
		moonIcon.classList.toggle('hidden');

		// Save preference
		const isDark = document.documentElement.classList.contains('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	});
});