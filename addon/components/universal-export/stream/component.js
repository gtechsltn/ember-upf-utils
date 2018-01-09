import ExternalExport from 'facade-web/components/universal-export/external/component';

export default ExternalExport.extend({
  layoutName: 'components/universal-export/external',

  _model: 'stream',

  placeholder: 'Pick or create a stream',
  createOptionPlaceholder: 'Create <strong>#item#</strong> stream'
});
