
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'mono': ['Roboto Mono', 'monospace'],
				'poppins': ['Poppins', 'sans-serif'],
				'orbitron': ['Orbitron', 'monospace'],
				'rajdhani': ['Rajdhani', 'sans-serif'],
				'exo': ['Exo 2', 'sans-serif'],
				'play': ['Play', 'sans-serif'],
				'russo': ['Russo One', 'sans-serif'],
				'audiowide': ['Audiowide', 'sans-serif'],
				'michroma': ['Michroma', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'counter-spin': {
					'0%': { transform: 'rotateY(0deg)', opacity: '1' },
					'50%': { transform: 'rotateY(90deg)', opacity: '0.5' },
					'100%': { transform: 'rotateY(0deg)', opacity: '1' }
				},
				'counter-flip': {
					'0%': { transform: 'rotateX(0deg)' },
					'100%': { transform: 'rotateX(360deg)' }
				},
				'counter-bounce': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				},
				'counter-slide': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'counter-zoom': {
					'0%': { transform: 'scale(0.8)', opacity: '0.5' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'counter-glow': {
					'0%, 100%': { textShadow: '0 0 10px currentColor' },
					'50%': { textShadow: '0 0 20px currentColor, 0 0 30px currentColor' }
				},
				'counter-shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-2px)' },
					'75%': { transform: 'translateX(2px)' }
				},
				'neon-pulse': {
					'0%, 100%': { 
						textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
						filter: 'brightness(1)'
					},
					'50%': { 
						textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
						filter: 'brightness(1.2)'
					}
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100%)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(100%)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'counter-spin': 'counter-spin 0.3s ease-in-out',
				'counter-flip': 'counter-flip 0.5s ease-in-out',
				'counter-bounce': 'counter-bounce 0.4s ease-in-out',
				'counter-slide': 'counter-slide 0.3s ease-out',
				'counter-zoom': 'counter-zoom 0.2s ease-out',
				'counter-glow': 'counter-glow 1s ease-in-out infinite',
				'counter-shake': 'counter-shake 0.1s ease-in-out',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 3s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
