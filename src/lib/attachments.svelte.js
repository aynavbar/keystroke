import { on } from 'svelte/events'

export function trapFocus(node) {
  const previous = document.activeElement;

  function focusable() {
    return Array.from(node.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"))
  }

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return; // only handle 'Tab' key presses

    const current = document.activeElement;

    const elements = focusable(); // get all focusable children on the attached element
    console.log(elements)
    const first = elements.at(0); // the first focusable child
    const last = elements.at(-1); // the last focusable child

    // the folowing conditional statements make sure the tab behavior gets
    // trapped within the current context
    if (event.shiftKey && current === last) {
      // stops reverse-tab behavior from focusing on whatever is outside the context and
      // focuses on the last focusable element instead
      last.focus();
      event.preventDefault();
    }

    if (!event.shiftKey && current === last) {
      // stops tab behavior from focusing on whatever is outside the context and
      // focuses on the first focusable element instead
      first.focus();
      event.preventDefault();
    }
  }

  focusable()[0]?.focus(); // focus on the first focusable element in the current attachment context

  const off = on(node, "keydown", handleKeyDown)

  return () => {
    off()
    previous?.focus();
  }
}
