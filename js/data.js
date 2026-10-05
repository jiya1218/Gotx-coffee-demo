/* ==========================================================================
   Gotx Coffee — menu data
   Edit prices, names and descriptions here and every page updates.
   group: classics | tonics | fruit | energy
   ========================================================================== */
window.GOTX = {
  whatsapp: '917046820753',

  menu: [
    {
      id: 'espresso-short', name: 'Espresso Short', group: 'classics', tag: 'Espresso', price: 99,
      desc: 'A concentrated single shot. Bold, clean and quick.',
      kind: 'cup',
      img: 'assets/drinks/espresso-short.jpg'
    },
    {
      id: 'iced-americano', name: 'Iced Americano', group: 'classics', tag: 'Iced', price: 149,
      desc: 'Espresso over chilled water and ice. Smooth and refreshing.',
      img: 'assets/drinks/iced-americano.jpg'
    },
    {
      id: 'espresso-tonic', name: 'Espresso Tonic', group: 'tonics', tag: 'House favourite', price: 189,
      desc: 'Bold espresso meets sparkling tonic over ice.',
      img: 'assets/drinks/hero-espresso-tonic.jpg',
      g: { garnish: { o: '#C87820', i: '#E8A348' } }
    },
    {
      id: 'espresso-ginger-ale', name: 'Espresso & Ginger Ale', group: 'tonics', tag: 'Sparkling', price: 189,
      desc: 'Espresso lifted with spicy-sweet ginger ale fizz.',
      img: 'assets/drinks/espresso-ginger-ale.jpg',
      g: { top: '#E8C782', bottom: '#9E6723', bubbles: 14 }
    },
    {
      id: 'cranberry-tonic', name: 'Cranberry Tonic', group: 'fruit', tag: 'Fruit tonic', price: 240,
      desc: 'Our espresso tonic with a tart cranberry twist.',
      img: 'assets/drinks/cranberry-tonic.jpg',
      g: { fruit: '#8C182A', garnish: { o: '#8C182A', i: '#D04E63' } }
    },
    {
      id: 'passion-fruit-tonic', name: 'Passion Fruit Tonic', group: 'fruit', tag: 'Fruit tonic', price: 240,
      desc: 'Tropical passion fruit over sparkling espresso tonic.',
      img: 'assets/drinks/passion-fruit-tonic.jpg',
      g: { fruit: '#D47A1B', garnish: { o: '#D47A1B', i: '#F0AD48' } }
    },
    {
      id: 'strawberry-tonic', name: 'Strawberry Tonic', group: 'fruit', tag: 'Fruit tonic', price: 240,
      desc: 'Sweet strawberry folded into bright espresso tonic.',
      img: 'assets/drinks/strawberry-tonic.jpg',
      g: { fruit: '#B52B46', garnish: { o: '#B52B46', i: '#E26D85' } }
    },
    {
      id: 'green-apple-tonic', name: 'Green Apple Tonic', group: 'fruit', tag: 'Fruit tonic', price: 240,
      desc: 'Crisp green apple over bright espresso tonic.',
      img: 'assets/drinks/green-apple-tonic.jpg',
      g: { fruit: '#788523', garnish: { o: '#788523', i: '#BAC94D' } }
    },
    {
      id: 'kiwi-tonic', name: 'Kiwi Tonic', group: 'fruit', tag: 'Fruit tonic', price: 240,
      desc: 'Tangy-sweet kiwi over bright espresso tonic.',
      img: 'assets/drinks/kiwi-tonic.jpg',
      g: { fruit: '#556B24', garnish: { o: '#556B24', i: '#95AF4D' } }
    },
    {
      id: 'yuzu-tonic', name: 'Yuzu Tonic', group: 'fruit', tag: 'Fruit tonic', price: 260,
      desc: 'Zesty Japanese yuzu over bright espresso tonic.',
      img: 'assets/drinks/yuzu-tonic.jpg',
      g: { fruit: '#CCA025', garnish: { o: '#CCA025', i: '#E8CA58' } }
    },
    {
      id: 'espresso-red-bull', name: 'Espresso Red Bull', group: 'energy', tag: 'Energy', price: 299,
      desc: 'Espresso poured over chilled Red Bull. A bold energy kick.',
      img: 'assets/drinks/espresso-red-bull.jpg',
      g: { top: '#E8B964', bottom: '#9C621E', bubbles: 14 }
    }
  ],

  // Shown on the home page "favourites" scroller, in this order
  favourites: ['espresso-tonic', 'iced-americano', 'yuzu-tonic', 'strawberry-tonic', 'kiwi-tonic', 'espresso-red-bull', 'cranberry-tonic', 'passion-fruit-tonic', 'green-apple-tonic'],

  soon: [
    { name: 'Cold Brew', desc: 'An 18-hour slow steep. Smooth, mellow and low in acidity.' },
    { name: 'Hot Espresso', desc: 'For the purists. A hot, fresh-pulled shot served simple.' },
    { name: 'Espresso Latte', desc: 'Silky steamed milk poured over a bold double shot.' },
    { name: 'Seasonal Specials', desc: "Rotating limited drinks you'll only catch here." },
    { name: 'Matcha Latte', desc: 'Stone-ground matcha whisked with silky steamed milk.' }
  ]
};
