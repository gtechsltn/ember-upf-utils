import Ember from 'ember';
import layout from '../templates/components/currency-chooser';
import isoCodes from '../utils/iso-codes';

export default Ember.Component.extend({
  layout,
  isoCodes: isoCodes,

  actions: {
    updateCurrency(currency) {
      this.set('value', currency);
    }
  }
});
