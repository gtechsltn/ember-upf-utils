import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

export default Component.extend({
  layout,

  uploaderHeaders: {
    'Scope': 'publishr_admin'
  },

  uploaderExtra: {
    'privacy': 'public'
  },

  actions: {
    onContentChange(text) {
      this.set('item.body', text);
    }
  }
});
