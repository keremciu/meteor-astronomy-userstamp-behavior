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
    const definition = {
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
        // Make a field required only on the server.
        optional: true
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
    if (Meteor.users.find().count() === 0) {
      const userid = doc.id;
    } else {
      const userid = Meteor.userId();
    }

    // If the "hasCreatedField" option is set.
    if (this.options.hasCreatedByField) {
      // Set value for created field.
      doc[this.options.createdByFieldName] = userid;
    }

    // If the "hasUpdatedByField" option is set.
    if (this.options.hasUpdatedByField) {
      // Set value for the "updatedBy" field.
      const transporter = [];
      transporter.unshift(Meteor.userId());
      doc[this.options.updatedByFieldName] = transporter;
    }
  },
  setModifiedBy(doc) {
    // Get current userid.
    const userid = Meteor.userId();

    // If the "hasUpdatedByField" option is set.
    if (this.options.hasUpdatedByField) {
      // Set value for the "updatedBy" field.
      const transporter = doc[this.options.updatedByFieldName];

      if (transporter.indexOf(userid) === -1) {
        transporter.unshift(userid);
        doc[this.options.updatedByFieldName] = transporter;
      }

    }
  }
});
