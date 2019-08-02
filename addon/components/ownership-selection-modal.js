import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, observer } from '@ember/object';

export default Component.extend({
  classNames: ['ownership-selection'],
  
  ownershipUpdater: service(),
  toast: service(),
  currentUser: service(),

  selectedUsers: null,
  ownership: null,
  disabledClassicSharing: false,
  disabledCompositeSharing: false,

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  header: 'Share with',
  cta: 'Share',

  setDisabled: observer('selectedUsers', 'ownership', function() {
    if (this.selectedUsers) {
      if (this.selectedUsers.length == 0) {
        this.set('disabledClassicSharing', false);
      } else {
        this.set('disabledClassicSharing', true);
      }
    }

    if (this.ownership) {
      this.set('disabledCompositeSharing', true);
    } else {
      this.set('disabledCompositeSharing', false);
    }
  }),

  items: computed('searchTerm', function() {
    let members;

    return this.currentUser.fetchColleagues().then(( { users }) => {
      members = users.filter((user) => { 
        return user.active;
      });

      return members.filter((user) => {
        const { first_name, last_name, email } = user;
        return email.includes(this.searchTerm) ||
        (first_name || '').includes(this.searchTerm) ||
        (last_name || '').includes(this.searchTerm);
      });
    });
  }),

  actions: {
    searchEntities(text) {
      this.set('searchTerm', text);
    },

    performCloseModal() {
      this.sendAction('closeModal');
      this.get('toast').success(
        this.get('successfulSharing'),
        'Sharing Success',
        this._toastConfig
      );
    },

    updateOwnership() {
      if (this.selectedUsers && this.selectedUsers.length > 0) {
        this.currentUser.createCompositeGroup(this.selectedUsers).then(() => {
          this.send('performCloseModal');
        });
      } else {
        this.get('ownershipUpdater').update(
          this.get('modelType'),
          this.get('model.id'),
          this.get('model.ownedBy')
        ).then(() => {
          this.send('performCloseModal');
        });
      }
    }
  }
});
