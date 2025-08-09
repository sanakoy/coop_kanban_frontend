import type { DirectiveBinding, ObjectDirective } from "vue";

type ClickOutsideHandler = (event: MouseEvent) => void;

interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: ClickOutsideHandler;
}

const ClickOutsideDirective: ObjectDirective<ClickOutsideElement> = {
  beforeMount(el, binding: DirectiveBinding<(event: MouseEvent) => void>) {
    el.clickOutsideEvent = function (event: MouseEvent) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };

    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    if (el.clickOutsideEvent) {
      document.removeEventListener("click", el.clickOutsideEvent);
      delete el.clickOutsideEvent;
    }
  },
};

export default ClickOutsideDirective;
