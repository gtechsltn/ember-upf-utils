import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  isBlank
} = Ember;

export default Component.extend({
  layout,

  classNames: ['item-chooser'],

  // Options
  placeholder: 'Pick an item',
  recordType: null,
  createOptionPlaceholder: '#item#',
  multiple: false,
  canCreate: false,
  didCreate: '',
  optionValuePath: 'content',
  optionLabelPath: 'name',
  sortField: 'name',
  onBlur: null,
  recordTypeIsModel: false,
  disabled: false,
  searchTerm: null,

  didReceiveAttrs() {
    if (this.get('canCreate') && this.get('recordTypeIsModel') && this.get('recordType') === null) {
      throw new Error('[component][item-chooser] Please provide a recordType');
    }
  },

  createItemComponent: computed('canCreate', 'searchTerm', function() {
    if (this.get('canCreate') && !isBlank(this.get('searchTerm'))) {
      return 'item-chooser/create-item';
    }

    return null;
  }),

  actions: {
    updateSearchTerm(term) {
      this.set('searchTerm', term);
    }
  }
});
