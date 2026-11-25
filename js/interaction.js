/**
 * Interaction layer on top of solitario.js:
 *  - touch drag and drop (HTML5 drag and drop does not fire on phones and tablets),
 *  - highlight of the pile under the card while dragging,
 *  - feedback when a move is not allowed, instead of the card silently going back.
 * It reuses the game's own drop handlers, so the rules live in one place.
 */
(function () {
  const piles = ["sobrantes", "receptor1", "receptor2", "receptor3", "receptor4"].map((id) =>
    document.getElementById(id)
  );
  const hint = document.querySelector(".hint");
  const defaultHint = hint.textContent;
  let movesBefore = 0;
  let hintTimer = null;

  function showHint(text, isError) {
    hint.textContent = text;
    hint.classList.toggle("hint--error", Boolean(isError));
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      hint.textContent = defaultHint;
      hint.classList.remove("hint--error");
    }, 2600);
  }

  function rejectionMessage(pile, card) {
    if (pile.id === "sobrantes") {
      return "Cards from the discard pile can only go to a foundation.";
    }
    const cards = pile.querySelectorAll("img");
    if (cards.length === 0) {
      return "An empty foundation only takes a 12.";
    }
    const top = cards[cards.length - 1];
    return `On a ${top.dataset.numero} you can only place a ${top.dataset.numero - 1} of the other colour.`;
  }

  /** Called after the game's own drop handler: tell the player when nothing moved. */
  function afterDrop(pile, card) {
    pile.classList.remove("is-over");
    if (movimientos === movesBefore && card) {
      pile.classList.add("is-invalid");
      setTimeout(() => pile.classList.remove("is-invalid"), 450);
      showHint(rejectionMessage(pile, card), true);
    }
  }

  // Mouse: HTML5 drag and drop (the game sets the data in its dragstart handlers).
  let draggedCard = null;
  document.addEventListener("dragstart", (e) => {
    draggedCard = e.target.closest("img");
    movesBefore = movimientos;
  });
  document.addEventListener("dragend", () => {
    piles.forEach((pile) => pile.classList.remove("is-over"));
  });
  piles.forEach((pile) => {
    pile.addEventListener("dragenter", () => pile.classList.add("is-over"));
    pile.addEventListener("dragleave", (e) => {
      if (!pile.contains(e.relatedTarget)) pile.classList.remove("is-over");
    });
    pile.addEventListener("drop", () => afterDrop(pile, draggedCard));
  });

  // Touch: follow the finger with a ghost card and reuse the pile's ondrop handler.
  let ghost = null;
  let touchCard = null;

  function pileAt(x, y) {
    const el = document.elementFromPoint(x, y);
    return el ? piles.find((pile) => pile.contains(el)) : undefined;
  }

  document.addEventListener(
    "touchstart",
    (e) => {
      const card = e.target.closest(".tapete img");
      if (!card || card.getAttribute("draggable") !== "true") return;
      e.preventDefault();
      touchCard = card;
      movesBefore = movimientos;
      const rect = card.getBoundingClientRect();
      ghost = card.cloneNode();
      ghost.removeAttribute("id");
      ghost.className = "drag-ghost";
      ghost.style.width = `${rect.width}px`;
      document.body.appendChild(ghost);
      moveGhost(e.touches[0]);
      card.style.opacity = "0.35";
    },
    { passive: false }
  );

  function moveGhost(touch) {
    ghost.style.left = `${touch.clientX}px`;
    ghost.style.top = `${touch.clientY}px`;
    piles.forEach((pile) => pile.classList.toggle("is-over", pile === pileAt(touch.clientX, touch.clientY)));
  }

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!ghost) return;
      e.preventDefault();
      moveGhost(e.touches[0]);
    },
    { passive: false }
  );

  document.addEventListener("touchend", (e) => {
    if (!ghost) return;
    const touch = e.changedTouches[0];
    const pile = pileAt(touch.clientX, touch.clientY);
    ghost.remove();
    ghost = null;
    touchCard.style.opacity = "";
    if (pile && typeof pile.ondrop === "function") {
      const data = {
        "text/plain/id": touchCard.id,
        "text/plain/numero": touchCard.dataset.numero,
        "text/plain/palo": touchCard.dataset.palo,
        "text/plain/color": touchCard.dataset.color,
        "text/plain/tapete": touchCard.dataset.tapete,
      };
      pile.ondrop({ preventDefault() {}, dataTransfer: { getData: (key) => data[key] || "" } });
      afterDrop(pile, touchCard);
    }
    piles.forEach((p) => p.classList.remove("is-over"));
    touchCard = null;
  });
})();
