/** @type {import('tailwindcss').Config} */
module.exports = {
	// Purge settings, search files in defined locations. Removes unused classes.
	content: ['./src/**/*.{html,ts}'],  // Boundle size optimizations
	safelist: ['bg-blue-400', 'bg-green-400','bg-red-400',],
	theme: { //tailwind customizing https://tailwindcss.com/docs/font-family#customizing-your-theme
		extend: {
			animation: {
				'spin-slow': 'spin 2s linear infinite',
				'spin-clockwise': 'counter-clockwise 1.5s linear infinite',
				'spin-clockwise-slow': 'counter-clockwise 2.6s linear infinite'
			},
			keyframes: {
				'counter-clockwise': {
					from : { transform: 'rotata(0deg)' },
					to: { transform: 'rotate(-360deg)'}
				}
			}
		},
	},
	plugins: [],
}
