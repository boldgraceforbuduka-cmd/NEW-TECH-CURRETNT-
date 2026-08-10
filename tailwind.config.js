/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],

  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',

      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      /* =====================================================
         COLORS
         ===================================================== */

      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        /* Tech Current Gold */
        gold: {
          DEFAULT: 'hsl(var(--gold))',
          foreground: 'hsl(var(--gold-foreground))',
        },
      },

      /* =====================================================
         BORDER RADIUS
         ===================================================== */

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',

        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },

      /* =====================================================
         TYPOGRAPHY
         ===================================================== */

      fontFamily: {
        heading: [
          'var(--font-satoshi)',
          'system-ui',
          'sans-serif',
        ],

        body: [
          'var(--font-inter)',
          'system-ui',
          'sans-serif',
        ],
      },

      /* =====================================================
         SPACING
         ===================================================== */

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },

      /* =====================================================
         SHADOWS
         ===================================================== */

      boxShadow: {
        premium:
          '0 20px 60px -12px rgba(0, 0, 0, 0.4)',

        card:
          '0 4px 24px -4px rgba(0, 0, 0, 0.08)',

        'card-hover':
          '0 12px 48px -8px rgba(0, 0, 0, 0.16)',

        glow:
          '0 0 40px rgba(37, 99, 235, 0.08)',

        'glow-primary':
          '0 0 35px hsl(var(--primary) / 0.12)',

        'glow-gold':
          '0 0 30px hsl(var(--gold) / 0.10)',
      },

      /* =====================================================
         KEYFRAMES
         ===================================================== */

      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },

          to: {
            height:
              'var(--radix-accordion-content-height)',
          },
        },

        'accordion-up': {
          from: {
            height:
              'var(--radix-accordion-content-height)',
          },

          to: {
            height: '0',
          },
        },

        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },

        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px)',
          },

          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },

          '50%': {
            transform: 'translateY(-6px)',
          },
        },

        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.96)',
          },

          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },

        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(12px)',
          },

          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },

      /* =====================================================
         ANIMATIONS
         ===================================================== */

      animation: {
        'accordion-down':
          'accordion-down 0.2s ease-out',

        'accordion-up':
          'accordion-up 0.2s ease-out',

        shimmer:
          'shimmer 2s infinite',

        'fade-in':
          'fade-in 0.3s ease-out',

        'scale-in':
          'scale-in 0.2s ease-out',

        'slide-up':
          'slide-up 0.35s ease-out',

        float:
          'float 6s ease-in-out infinite',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
  ],
};