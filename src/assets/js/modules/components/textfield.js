'use strict';

const cssClasses = {
  container: 'textfield',
  input: 'textfield_input',
  label: 'textfield_label',
  dirty: 'is-dirty',
  focused: 'is-focused'
};

class Textfield {

  constructor($container) {
    this.$container = $container;
    this.$input = this.$container.querySelector(`.${cssClasses.input}`);
    this.$label = this.$container.querySelector(`.${cssClasses.label}`);
    this.$input.addEventListener('focus', this.onFocus.bind(this));
    this.$input.addEventListener('blur', this.onBlur.bind(this));
    this.$input.addEventListener('input', this.onInput.bind(this));
    this.update();
  }

  onFocus() {
    this.$container.classList.add(cssClasses.focused);
  }

  onBlur() {
    this.$container.classList.remove(cssClasses.focused);
  }

  onInput() {
    this.update();
  }

  update() {
    this.updateDirty();
  }

  updateDirty() {
    if (this.$input.value && this.$input.value.length > 0) this.$container.classList.add(cssClasses.dirty);
    else this.$container.classList.remove(cssClasses.dirty);
  }

  static init() {
    [].forEach.call(document.querySelectorAll(`.${cssClasses.container}`), (el) => new Textfield(el));
  }

}

module.exports = Textfield;
