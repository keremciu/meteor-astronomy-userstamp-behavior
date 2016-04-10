Package.describe({
  name: 'keremciu:astronomy-userstamp-behavior',
  version: '0.0.1',
  summary: 'Userstamp behavior for Meteor Astronomy',
  git: 'https://github.com/keremciu/meteor-astronomy-userstamp-behavior.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use([
    'ecmascript',
    'es5-shim',
    'jagi:astronomy@2.0.0-rc.8',
    'stevezhu:lodash@4.6.1'
  ], ['client', 'server']);

  api.mainModule('lib/main.js', ['client', 'server']);
});
