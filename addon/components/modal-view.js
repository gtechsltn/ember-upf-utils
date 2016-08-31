import Ember from 'ember';
import layout from '../templates/components/modal-view';

export default Ember.Component.extend({
  layout,
  classNames: ['modal', 'fade'],

  didInsertElement() {
    this.$(this.element).modal({keyboard: false, backdrop: 'static'});
  },
  willDestroyElement() {
    this.$(this.element).modal('hide');
  }
});
