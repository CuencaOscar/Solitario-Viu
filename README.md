<p align="center"><img src="imagenes/logo.png" alt="Solitario VIU" width="140"></p>

# Solitario VIU 🃏

A single-player card game that runs in the browser, built with **HTML5 drag and drop**, **CSS** and
**vanilla JavaScript**, with no frameworks. Developed for the Master's in Web Applications and Services Development
at Universidad Internacional de Valencia (VIU).

**▶ Play it online: [cuencaoscar.github.io/Solitario-Viu](https://cuencaoscar.github.io/Solitario-Viu/)**

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

<p align="center"><img src="docs/demo.gif" alt="Playing the first moves with drag and drop: kings to the foundations, other cards to the discard pile" width="620"></p>

## How to play

The deck has 48 cards: four suits numbered 1 to 12, two orange and two grey. The goal is to move every card to
the four foundation piles, each one built **from 12 down to 1 alternating colours**.

1. Drag the top card of the initial pile to a foundation (a 12 starts an empty pile; otherwise it must be one lower
   than the top card and of the other colour) or to the discard pile. The top card of the discard pile can also be
   played to a foundation.
2. When the initial pile runs out, the discard pile is shuffled back in.
3. You win when the four foundations are complete.

![New game and a game in progress](docs/screenshots.png)

## Features

- Shuffled deck on every game and drag-and-drop card movement.
- Rule validation on each drop.
- Timer and move counter.
- Restart button and victory message.

## Run it

Play it at [cuencaoscar.github.io/Solitario-Viu](https://cuencaoscar.github.io/Solitario-Viu/), or clone the repository and open
`solitario.html` in any modern browser (no build step or dependencies).

```
css/solitario.css   # Board and card styles
js/solitario.js     # Game logic: deck, shuffling, drag and drop, rules, counters
imagenes/baraja/    # Card images
```

## License

[GPL-3.0](LICENSE) © Oscar Cuenca · [LinkedIn](https://www.linkedin.com/in/ocuenca-moreno/)
