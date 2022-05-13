import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import EventsServiceMock from '@upfluence/hyperevents/test-support/services/events-service';

import sinon from 'sinon';

module('Unit | Service | activity-watcher', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:events-service", EventsServiceMock);

    this.eventService = this.owner.lookup("service:events-service");
    this.activityWatcher = this.owner.lookup('service:activity-watcher');
  });

  test('it does nothing if not watching', function(assert) {
    const toastInfoStub = sinon.stub(this.owner.lookup('service:toast'), 'info').returnsThis();
    const toastErrorStub = sinon.stub(this.owner.lookup('service:toast'), 'error').returnsThis();

    this.eventService.dispatch({resource: '/notification/some-uu-id'});

    assert.true(toastErrorStub.notCalled);
    assert.true(toastInfoStub.notCalled);
  });

  module('watching for events', function (hooks) {
    hooks.beforeEach(function () {
      this.activityWatcher.watch();
    });

    const eventTypesTestCases = [
      {
        notification: {
          notification_type: 'mailing_email_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            entity_url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: `<img class=\"toast-title__avatar\" src=\"https://avatar.com/is-a-bad-movie\" />
     <i class=\"toast-title__icon upf-icon upf-icon--messages\"></i>`,
        wantInfoMessage: `Email from <b>bozito</b>
          <a href=\"https://entity.url.com\" target=\"_blank\">Reply</a>`,
      },
      {
        notification: {
          notification_type: 'conversation_email_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            entity_url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: `<img class=\"toast-title__avatar\" src=\"https://avatar.com/is-a-bad-movie\" />
     <i class=\"toast-title__icon upf-icon upf-icon--messages\"></i>`,
        wantInfoMessage: `Email from <b>bozito</b>
           <a href=\"https://entity.url.com\" target=\"_blank\">Reply</a>`,
      },
      {
        notification: {
          notification_type: 'direct_message_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            entity_url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: `<img class=\"toast-title__avatar\" src=\"https://avatar.com/is-a-bad-movie\" />
     <i class=\"toast-title__icon upf-icon upf-icon--messages\"></i>`,
        wantInfoMessage: `Message from <b>bozito</b>
           <a href=\"https://entity.url.com\" target=\"_blank\">Reply</a>`,
      },
      {
        notification: {
          notification_type: 'publishr_application_received',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            campaign_name: 'bozocampaign',
            url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: `<img class=\"toast-title__avatar\" src=\"https://avatar.com/is-a-bad-movie\" />
     <i class=\"toast-title__icon upf-icon upf-icon--messages\"></i>`,
        wantInfoMessage: `Application from <b>bozito</b> in <b>bozocampaign</b>
           <a href=\"https://entity.url.com\" target=\"_blank\">See application</a>`,
      },
      {
        notification: {
          notification_type: 'publishr_draft_created',
          timestamp: 123458,
          data: {
            influencer_name: 'bozito',
            influencer_avatar: 'https://avatar.com/is-a-bad-movie',
            campaign_name: 'bozocampaign',
            url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: `<img class=\"toast-title__avatar\" src=\"https://avatar.com/is-a-bad-movie\" />
     <i class=\"toast-title__icon upf-icon upf-icon--messages\"></i>`,
        wantInfoMessage: `Draft by <b>bozito</b> in <b>bozocampaign</b>
           <a href=\"https://entity.url.com\" target=\"_blank\">Review</a>`,
      },
      {
        notification: {
          notification_type: 'list_recommendation',
          timestamp: 123458,
          data: {
            count: 20,
            list_name: 'bozolist',
            url: 'https://entity.url.com'
          }
        },
        wantInfoTitle: "<i class=\"toast-title__icon upf-icon upf-icon--messages\"></i>",
        wantInfoMessage: `You have <b>20</b> new recommendations for your <b>bozolist</b> list
           <a href=\"https://entity.url.com\" target=\"_blank\">View</a>`,
      },
      {
        notification: {
          notification_type: 'thread_failure_summary',
          timestamp: 123458,
          data: {
            mailing_url: 'https://entity.url.com'
          }
        },
        wantErrorTitle: "<i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i>",
        wantErrorMessage: `<b>Mailing error.</b> We ran into a problem with one of your Mailings.
          <a href="https://entity.url.com" target="_blank"><b>View my mailing</b></a>`
      },
      {
        notification: {
          notification_type: 'credential_disconnected',
          timestamp: 123458,
          data: {
            integration_name: 'woop',
            integration_url: 'https://inte-gration.com'
          }
        },
        wantErrorTitle: "<i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i>",
        wantErrorMessage: `<b>Your woop has been disconnected.</b> Please check your integration.
          settings and reconnect it to avoid any issues. <a href="https://inte-gration.com" target="_blank"><b>Reconnect</b></a>`
      },
    ];

    eventTypesTestCases.forEach((testCase: any) => {
      test('it dispatches events for' + testCase.notification.notification_type, function(assert) {
        const infoStub = sinon.stub(this.owner.lookup('service:toast'), 'info').callsFake((message: string, title: string) => {
          assert.equal(trimAll(message), trimAll(testCase.wantInfoMessage));
          assert.equal(trimAll(title), trimAll(testCase.wantInfoTitle));
        });
        const errorStub = sinon.stub(this.owner.lookup('service:toast'), 'error').callsFake((message: string, title: string) => {
          assert.equal(trimAll(message), trimAll(testCase.wantErrorMessage));
          assert.equal(trimAll(title), trimAll(testCase.wantErrorTitle));
        });

        this.eventService.dispatch({
          resource: '/notification/some-uu-id',
          payload: testCase.notification,
        });

        if (testCase.wantErrorTitle || testCase.wantErrorMessage) {
          assert.true(errorStub.calledOnce);
        }

        if (testCase.wantInfoTitle || testCase.wantInfoMessage) {
          assert.true(infoStub.calledOnce);
        }
      });
    });
  });
});


function trimAll(str: string): string {
  //@ts-ignore
  return str.replaceAll(' ', '');
}
