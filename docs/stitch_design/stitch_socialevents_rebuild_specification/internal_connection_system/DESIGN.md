---
name: Internal Connection System
colors:
  surface: '#faf9ff'
  surface-dim: '#ccdaff'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d8e2ff'
  on-surface: '#051a3e'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3054'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#5700e2'
  on-secondary: '#ffffff'
  secondary-container: '#7034ff'
  on-secondary-container: '#e9dfff'
  tertiary: '#851800'
  on-tertiary: '#ffffff'
  tertiary-container: '#b02300'
  on-tertiary-container: '#ffc6b9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#e8deff'
  secondary-fixed-dim: '#cdbdff'
  on-secondary-fixed: '#20005f'
  on-secondary-fixed-variant: '#5000d0'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a3'
  on-tertiary-fixed: '#3d0600'
  on-tertiary-fixed-variant: '#8b1a00'
  background: '#faf9ff'
  on-background: '#051a3e'
  surface-variant: '#d8e2ff'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin: 24px
---

## Brand & Style

This design system balances corporate reliability with the vibrant energy of community engagement. The visual narrative is built on "Professional Play," where a structured, high-utility framework is punctuated by energetic color accents and soft geometry. 

The aesthetic is **Corporate Modern** with a focus on high-information density that remains breathable. It prioritizes clarity for administrative tasks while using micro-interactions and a diverse secondary palette to signal the "social" nature of the platform. The goal is to make internal event coordination feel like a perk of the job rather than another task on a to-do list.

## Colors

The palette is anchored by a deep "Trust Blue" to maintain professional alignment with enterprise environments. Event-specific categories use high-chroma variants to ensure they stand out in calendar views and list densities.

- **Primary:** Deep Blue for navigation, primary actions, and brand identity.
- **Category Accents:** Vibrant Purple, Orange-Red, and Emerald Green are reserved for event classification and status indicators.
- **Functional Neutrals:** A sophisticated range of grays with slight blue undertones to prevent "muddy" interfaces in dark mode.
- **Semantic Colors:** Standardized Red (Error), Yellow (Warning), and Green (Success) are distinct from the category palette to ensure administrative clarity.

**Dark Mode Strategy:** In dark mode, surface colors transition to deep navy-grays rather than pure black to maintain soft depth. Category colors should increase in luminance by 10% to preserve accessibility contrast.

## Typography

This design system utilizes **Geist** for its exceptional technical precision and modern geometric character. The typeface performs equally well in data-heavy administrative tables and large-scale event promotion banners.

- **Scale:** A tight modular scale ensures that even with significant information density, the hierarchy remains obvious.
- **Weight Usage:** Use Semi-bold (600) for UI headers and Medium (500) for interactive labels to ensure buttons and tabs are easily identifiable.
- **Legibility:** For calendar views where space is premium, use `label-md` for event titles to maintain a clean grid without sacrificing readability.

## Layout & Spacing

The system uses a **4px base unit** to ensure precise alignment in complex calendar layouts. 

- **Grid:** A 12-column fluid grid is used for the main dashboard. In the administrative view, a 280px fixed left navigation is standard.
- **Calendar Density:** Inside calendar cells, use `spacing.xs` for internal padding to maximize the visible text of event titles.
- **Breakpoints:**
  - **Mobile (<600px):** Single column, margins reduced to 16px. Sidebars convert to bottom sheets.
  - **Tablet (600px - 1024px):** 8-column grid. Sidebars collapse to icon-only rails.
  - **Desktop (>1024px):** Full 12-column grid with 24px margins.

## Elevation & Depth

Depth is used sparingly to define interactive surfaces against the structural background.

- **Level 0 (Background):** Used for the main application canvas.
- **Level 1 (Cards/Sheets):** Subtle 1px border in a neutral-soft tint with a very low-opacity ambient shadow (4px blur, 2% opacity).
- **Level 2 (Hover/Dropdowns):** Increased shadow spread (12px blur, 8% opacity) to indicate lift and interactivity.
- **Level 3 (Modals):** High-contrast shadows with a backdrop blur (8px) on the layer below to maintain focus on event creation or editing.

In dark mode, elevation is communicated via **tonal layering**—higher elevation elements are slightly lighter in color rather than relying solely on shadows.

## Shapes

The shape language is "Rounded," utilizing a **8px standard radius** for most containers. This softens the professional layout and makes the tool feel approachable.

- **Standard (8px):** Buttons, input fields, and event cards.
- **Large (16px):** Modals and large feature banners.
- **Pill:** Reserved for status badges (e.g., "Confirmed," "Full") and category chips to distinguish them from actionable buttons.
- **Circular:** Avatars and notification pips.

## Components

- **Calendar Chips:** Compact, pill-shaped markers. Use a subtle background tint of the category color with a high-contrast border and text of the same hue for maximum legibility.
- **Buttons:**
  - *Primary:* Solid Trust Blue with white text.
  - *Secondary:* Ghost style with 1px neutral border.
  - *Social:* High-vibrancy accents used specifically for "Join" or "RSVP" actions.
- **Avatar Stacks:** 32px circular images with a 2px border matching the background color. Overflow count (+X) uses `label-sm` in a neutral gray.
- **Notification Indicators:** 8px solid dots. Use the 'Holiday' orange/red for urgent alerts and 'Primary' blue for social updates.
- **Star Ratings:** Use the 'Game Night' purple for active stars to deviate from the standard yellow, leaning into the playful brand aspect.
- **Input Fields:** 8px radius, 1px border. On focus, use a 2px 'Primary Blue' ring with 20% opacity.
- **Status Badges:** Use lowercase for a friendlier tone (e.g., "in progress" vs "IN PROGRESS") within a pill shape.