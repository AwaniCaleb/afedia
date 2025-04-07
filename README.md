# The Lense of Afedia

A modern, responsive, and customizable photography portfolio site built with Vite, TailwindCSS, and vanilla JavaScript. This portfolio features dynamic content loading, dark/light theme toggle, and smooth animations.

## Features

- 🖼️ Dynamic image gallery with staggered loading animations
- 🌓 Light/dark theme toggle with local storage persistence
- 📱 Fully responsive design for all devices
- ⚡ Fast loading with optimized assets
- 🎨 Easily customizable accent color
- 👤 Personal sections: About Me
- 🔗 Social media integration

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone this repository:
```bash
git clone https://github.com/awanicaleb/afedia.git
cd afedia
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to http://localhost:3000

## Project Structure

```
afedia/
├── public/              # Static assets
│   └── images/          # Image files
├── src/
│   ├── styles/          # CSS styles
│   ├── main.js          # Main JavaScript entry
│   └── index.html       # HTML template
└── package.json         # Project dependencies
```

## Customization

### Modifying Gallery Content

Edit the `galleryData` array in `src/main.js` to update the gallery items.

### Changing Theme Colors

To modify the accent color, edit the `--accent-color` CSS variables in the `:root` selector in `src/styles.css`.

### Adding New Sections

The project is structured to make adding new sections easy. Create your section markup and add it to the main layout in `src/index.html`.

## Deployment

### Vercel

This project is optimized for deployment on Vercel:

1. Push your repository to GitHub
2. Import the project in Vercel dashboard
3. Deploy!

### Other Platforms

To build for production:

```bash
npm run build
# or
yarn build
```

This will generate optimized assets in the `dist` directory that can be deployed to any static hosting service.

## License

GNU General Public License - see LICENSE file for details.

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Heroicons](https://heroicons.com/)