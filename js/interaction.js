/**
 * Drag and drop for Solitaire built on Pointer Events, so it behaves the same with a mouse,
 * a finger or a pen (native HTML5 drag and drop is unreliable on touch screens and some setups).
 *  - the card follows the pointer as a floating copy,
 *  - the pile under the pointer is highlighted,
 *  - on release the pile's own drop handler from solitario.js runs, so the rules live in one place,
 *  - a move that is not allowed shakes the pile and explains why.
 */
(function () {
  const piles = ["sobrantes", "receptor1", "receptor2", "receptor3", "receptor4"].map((id) =>
    document.getElementById(id)
  );
  const hint = document.querySelector(".hint");
  const defaultHint = hint.textContent;
  let hintTimer = null;
  let drag = null; // { card, ghost, pointerId, offsetX, offsetY, startX, startY, moved }

  function showHint(text, isError) {
    hint.textContent = text;
    hint.classList.toggle("hint--error", Boolean(isError));
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      hint.textContent = defaultHint;
      hint.classList.remove("hint--error");
    }, 2800);
  }

  function rejectionMessage(pile, card) {
    if (pile.id === "sobrantes") {
      return card.dataset.tapete === "sobrantes"
        ? "That card is already on the discard pile: move it to a foundation."
        : "That card could not be placed on the discard pile.";
    }
    const cards = pile.querySelectorAll("img");
    if (cards.length === 0) return "An empty foundation only takes a 12.";
    const top = cards[cards.length - 1];
    return `On a ${top.dataset.numero} you can only place a ${top.dataset.numero - 1} of the other colour.`;
  }

  function pileAt(x, y) {
    const hidden = drag && drag.ghost;
    if (hidden) hidden.style.display = "none";
    const el = document.elementFromPoint(x, y);
    if (hidden) hidden.style.display = "";
    return el ? piles.find((pile) => pile.contains(el)) : undefined;
  }

  function highlight(pile) {
    piles.forEach((p) => p.classList.toggle("is-over", p === pile));
  }

  // The native drag would compete with the pointer-based one.
  document.addEventListener("dragstart", (e) => {
    if (e.target.closest && e.target.closest(".tapete")) e.preventDefault();
  });

  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const card = e.target.closest(".tapete img");
    if (!card || card.getAttribute("draggable") !== "true") return;
    e.preventDefault();
    const rect = card.getBoundingClientRect();
    drag = {
      card,
      ghost: null,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
  });

  document.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < 4) return;
    e.preventDefault();
    if (!drag.moved) {
      drag.moved = true;
      drag.ghost = drag.card.cloneNode();
      drag.ghost.removeAttribute("id");
      drag.ghost.className = "drag-ghost";
      drag.ghost.style.width = `${drag.width}px`;
      document.body.appendChild(drag.ghost);
      drag.card.classList.add("is-dragging");
    }
    drag.ghost.style.left = `${e.clientX - drag.offsetX}px`;
    drag.ghost.style.top = `${e.clientY - drag.offsetY}px`;
    highlight(pileAt(e.clientX, e.clientY));
  });

  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const { card, ghost, moved } = drag;
    const pile = moved && !cancelled ? pileAt(e.clientX, e.clientY) : undefined;
    if (ghost) ghost.remove();
    card.classList.remove("is-dragging");
    highlight(undefined);
    drag = null;
    if (!pile || typeof pile.ondrop !== "function") return;

    const data = {
      "text/plain/id": card.id,
      "text/plain/numero": card.dataset.numero,
      "text/plain/palo": card.dataset.palo,
      "text/plain/color": card.dataset.color,
      "text/plain/tapete": card.dataset.tapete,
    };
    const movesBefore = movimientos;
    pile.ondrop({ preventDefault() {}, dataTransfer: { getData: (key) => data[key] || "" } });
    if (movimientos === movesBefore) {
      pile.classList.add("is-invalid");
      setTimeout(() => pile.classList.remove("is-invalid"), 450);
      showHint(rejectionMessage(pile, card), true);
    }
  }

  document.addEventListener("pointerup", (e) => endDrag(e, false));
  document.addEventListener("pointercancel", (e) => endDrag(e, true));
})();
