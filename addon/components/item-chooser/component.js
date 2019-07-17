import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import layout from './template';
import ExportEntity from '@upfluence/ember-upf-utils/export-entity/model';

const KEYS = [13, 9]; // enter / tab

export default Component.extend({
  layout,

  store: service(),

  classNames: ['item-chooser'],

  // Options
  placeholder: 'Pick an item',
  recordType: null,
  createOptionPlaceholder: '#item#',
  multiple: false,
  canCreate: false,
  didCreate: 'defaultCreate',
  optionValuePath: null,
  optionLabelPath: 'name',
  sortField: 'name', // TODO: Rename this to searchField
  onBlur: null,
  recordTypeIsModel: false,
  disabled: false,
  searchTerm: null,
  search: null,

  optionsComponent: null,
  createItemComponent: null,
  selectedItemComponent: null,
  onopen: null,
  groupComponent: null,

  didReceiveAttrs() {
    if (this.canCreate && this.recordTypeIsModel && this.recordType === null) {
      throw new Error('[component][item-chooser] Please provide a recordType');
    }
  },

  _createItemComponent: computed('canCreate', 'searchTerm', function() {
    if (this.canCreate && !isBlank(this.searchTerm)) {
      return this.createItemComponent || 'item-chooser/create-item';
    }

    return null;
  }),

  createElement(extraAttrs = {}) {
    if (isBlank(this.searchTerm)) {
      return;
    }

    let item = null;
    if (this.recordTypeIsModel) {
      item = this.store.createRecord(this.recordType, {
        name: this.searchTerm
      });
    } else {
      item = ExportEntity.create(
        Object.assign({ name: this.searchTerm }, extraAttrs)
      );
    }

    if (this.multiple) {
      this.selection.pushObject(item);
    } else {
      this.set('selection', item);
    }

    if (this.didCreate) {
      this.didCreate(item);
    }
  },

  actions: {
    updateSearchTerm(term) {
      this.set('searchTerm', term);
    },

    defaultCreate() {
      //default action
    },

    keyPress(api, kevent) {
      if (!this.canCreate || !KEYS.includes(kevent.keyCode)) {
        return;
      }

      this.createElement();

      api.actions.close();

      // force clean
      this.set('searchTerm', null);
    },

    createItem(_, extraAttrs, defer) {
      this.createElement(extraAttrs);
      defer.resolve();
    }
  }
});
