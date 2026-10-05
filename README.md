# Gotx Coffee: website redesign demo

Plain HTML, CSS and JavaScript. No build step, no installs.

## Open it
- VS Code: install the **Live Server** extension, right-click `index.html`, choose "Open with Live Server".
- Or just double-click `index.html`. Everything works from a file, and an internet connection is only needed for Google Fonts and the map.

## Pages
`index.html` Home · `menu.html` Menu · `about.html` Our story · `order.html` Order · `contact.html` Contact

## Edit common things
- **Menu names, prices, descriptions, colours:** `js/data.js` (the menu page, home favourites and the "Build your crown" tool all read from it).
- **Brand colours and fonts:** the `:root` block at the top of `css/style.css`.
- **Phone, links, opening hours, footer:** search for `70468 20753` and `10 AM` in the HTML files.
- **Real photos / logo:** the drinks are drawn in code (`js/glass.js`) so the demo needs no photography. Swap in the client's logo SVG inside the `.logo` link in each page's header.

## Notes
- Header and footer are repeated in each HTML file, so edit them in all five when you change them.
- Copy is taken from the existing site. The four "how it is made" steps on the home page and the FAQ answers are written for the demo and should be confirmed with the client.
- Respects "reduce motion" system settings and works on mobile.
