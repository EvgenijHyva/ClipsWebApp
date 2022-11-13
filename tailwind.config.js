/** @type {import('tailwindcss').Config} */
module.exports = {
	// Purge settings, search files in defined locations. Removes unused classes.
	content: ['./src/**/*.{html,ts}'],  // Boundle size optimizations
	safelist: ['bg-blue-400', 'bg-green-400','bg-red-400',],
	theme: { //tailwind customizing https://tailwindcss.com/docs/font-family#customizing-your-theme
		extend: {},
	},
	plugins: [],
}
