# Tony's Pizza Delivery

A simple, accessible pizza ordering website built with basic HTML, CSS, and JavaScript.

## Features
- Responsive layout with mobile menu
- Menu browsing by category and sorting (name, price, calories)
- Cart with quantity controls, delivery fee, and totals
- Order contact modal with keyboard focus trap and Esc to close
- Order confirmation modal
- Contact form with validation and success message
- Accessibility: skip link, visible focus, aria-live cart updates, semantic landmarks
- Persistence: cart saved to localStorage

## Getting Started
1. Open `index.html` in your browser (no build step required).
2. Navigate to `Order` to add pizzas and test checkout flow.
3. Try mobile view to see the hamburger menu.

## Notes
- All assets are local except the homepage hero image (Unsplash).
- Scripts are loaded with `defer` for better performance.
- Basic SEO meta descriptions added per page. Favicon included.

## Lighthouse Suggestions
- Optionally compress/minify CSS/JS for production.
- Consider self-hosting images and using `width`/`height` + `loading="lazy"`.

## Accessibility Checklist
- [x] Skip to content link
- [x] Keyboard accessible nav and modals
- [x] Visible focus outlines
- [x] Live announcement for cart updates

## License
This project is for educational purposes.
