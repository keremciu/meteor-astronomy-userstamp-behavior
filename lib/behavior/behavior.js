import { Behavior } from 'meteor/jagi:astronomy';

Behavior.create({
  name: 'userstamp',
  options: {
    hasCreatedByField: true,
    createdByFieldName: 'createdBy',
    hasUpdatedByField: true,
    updatedByFieldName: 'updatedBy'
  },
  createClassDefinition() {
    let definition = {
      fields: {},
      events: {
        beforeInsert: (e) => {
          var doc = e.currentTarget;
          this.setCreatedBy(doc);
        },
        beforeUpdate: (e) => {
          var doc = e.currentTarget;
          this.setModifiedBy(doc);
        }
      }
    };

    if (this.options.hasCreatedByField) {
      // Add a field for storing a user who creates.
      definition.fields[this.options.createdByFieldName] = {
        type: String,
        immutable: true,
        optional: !Meteor.isServer
      };
    }

    if (this.options.hasUpdatedByField) {
      // Add a field for storing a user who updates.
      definition.fields[this.options.updatedByFieldName] = {
        type: [ String ],
        optional: true
      };
    }

    return definition;
  },
  apply(Class) {
    Class.extend(this.createClassDefinition(), [ 'fields', 'events' ]);
  },
  setCreatedBy(doc) {
    // Get current userid.
    let userid = Meteor.userId();

    // If the "hasCreatedField" option is set.
    if (this.options.hasCreatedByField) {
      // Set value for created field.
      doc[this.options.createdByFieldName] = userid;
    }

    // If the "hasUpdatedByField" option is set.
    if (this.options.hasUpdatedByField) {
      // Set value for the "updatedBy" field.
      var updatedArray = [];
      updatedArray.unshift(Meteor.userId());
      doc[this.options.updatedByFieldName] = updatedArray;
    }
  },
  setModifiedBy(doc) {
    // Get current userid.
    let userid = Meteor.userId();

    // If the "hasUpdatedByField" option is set.
    if (this.options.hasUpdatedByField) {
      // Set value for the "updatedBy" field.
      var updatedArray = doc[this.options.updatedByFieldName];

      if (updatedArray.indexOf(userid) === -1) {
        updatedArray.unshift(userid);
        doc[this.options.updatedByFieldName] = updatedArray;
      }

    }
  }
});
