# Userstamp behavior for Meteor Astronomy

The `userstamp` behavior adds two fields that store information who created and changed the document.

This package adapted from https://github.com/jagi/meteor-astronomy-timestamp-behavior

If you'd like to use this package you need to use Astronomy v2.

# Documentation

CreatedBy is a String field.
- keeps the userid who created the document.

UpdatedBy is a Array field.
- keeps every (different) userid who changed the document.

You can add the behavior like this:

const Model = Astro.Class.create({
  name: 'Model',
  collection: ...,
  fields: {
    ...
  },
  behaviors: {
    userstamp: {
      hasCreatedByField: true,
      createdByFieldName: 'createdBy',
      hasUpdatedByField: true,
      updatedByFieldName: 'updatedBy'
    },
  },
});

If you would like to use the behavior with the Meteor Accounts, you can fix the problem like this:

Accounts.onCreateUser(function (options, user) {
  ... codes

  Behavior.get('userstamp').definition.setCreatedBy(user);

  ... codes
});
