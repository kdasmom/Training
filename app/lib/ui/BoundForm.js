/**
 * A Form panel component that extends the base Ext.form.Panel to provide some additional options.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.BoundForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.boundform',
	
	requires: ['NP.lib.core.Net'],

	/**
	 * @cfg {Object}            bind (required)         Bind this form to one or more models
	 */
	/**
	 * @cfg {String}            bind.service (required) The service to call to get data to populate the form
	 */
	/**
	 * @cfg {String}            bind.action (required) The service action to call to get data to populate the form
	 */
	/**
	 * @cfg {String[]/Object[]} bind.models (required) Model(s) to bind the form against; this can be specified as a single item or an array of item; each item can be just a string with the model class (omit NP.model part) or an object if you need to specify a prefix (see docs)
	 */
	/**
	 * @cfg {String}            bind.models.class      The class path of the model to bind
	 */
	/**
	 * @cfg {String}            bind.models.prefix     A prefix used by the form field that when added to a model field name makes it match the form field name
	 */
	/**
	 * @cfg {String}            bind.extraParams       Extra parameters to pass to the service action
	 */
	initComponent: function() {
		var that = this;

		// Add custom event
		this.addEvents('dataloaded');

		// Load the parent init function
		this.callParent(arguments);

		// Defaults
		Ext.applyIf(this.bind, {
			extraParams: {}
		});

		// Check if models is an array or not; if it's not an array, convert it to one
		if ((this.bind.models instanceof Array) == false) this.bind.models = [this.bind.models];

		// Do the data binding once the form has been shown
		this.on('show', function() {
			// Create a loading mask
			var mask = new Ext.LoadMask(that);

			// Build the request object 
			var req = {
				service    : this.bind.service,
				action     : this.bind.action,
				success    : function(result, deferred) {
					// Loop through bound models
					Ext.each(that.bind.models, function(model, idx) {
						// If model is not an object (just a string), make it an object for consistency
						if ((model instanceof Object) == false) {
							model = { class: model, prefix: '' };
							that.bind.models[idx] = model;
						}
						
						// If there's no prefix, we can just create a model using the constructor
						if (model.prefix == '') {
							var modelObj = Ext.create('NP.model.' + model.class, result);
						// Otherwise, we need to populate the model one field at a time
						} else {
							// Create an empty model
							var modelObj = Ext.create('NP.model.' + model.class);
							// Loop through all the model fields
							modelObj.fields.each(function(col) {
								// Field name must include the prefix
								var fieldName = model.prefix + col.name;

								// If the field is found in data received from our ajax request, proceed
								if (result[fieldName]) {
									// Set the value in the model
									modelObj.set(col.name, result[fieldName]);
								}
							});
						}
						// Save the model instance for use in other functions
						that.bind.models[idx].instance = modelObj;
					});
					
					// Copy the model data to the form fields
					that.updateBoundFields();

					// Fire the dataloaded even which signals the data for the bound form is done loading
					that.fireEvent('dataloaded', that, result);

					// Remove the loading mask
					mask.destroy();
				}
			};
			// Add extra parameters to the request if any
			Ext.applyIf(req, this.bind.extraParams);

			// Show the mask
			mask.show();

			// Run the ajax request
			NP.lib.core.Net.remoteCall({
				requests: req
			});
		});
	},

	/**
	 * Updates form fields bound to models with the values from the appropriate model fields
	 */
	updateBoundFields: function() {
		var that = this;
		
		// Loop through bound models
		Ext.each(that.bind.models, function(model) {
			// If there's no prefix, we can just load the model into the form
			if (model.prefix == '') {
				that.loadRecord(model.instance);
			// Otherwise, we need to individually find the fields
			} else {
				// Loop through all the model fields
				model.instance.fields.each(function(col) {
					// Field name must include the prefix
					var field = that.findField(model.prefix + col.name);

					// If the field exists, set its value too
					if (field) {
						field.setValue(model.instance.get(col.name));
					}
				});
			}
		});
	},

	/**
	 * Shortcut for formPanel.getForm().findField()
	 * @param  {String} name Name of the field to get
	 * @return {Ext.form.field.Field}
	 */
	findField: function(name) {
		return this.getForm().findField(name);
	},

	/**
	 * Updates models bound to this form with the appropriate field values
	 */
	updateBoundModels: function() {
		var that = this;
		Ext.each(this.bind.models, function(model) {
			model.instance.fields.each(function(col) {
				var field = that.findField(model.prefix + col.name);
				if (field) {
					model.instance.set(col.name, field.getValue());
				}
			});
		});
	},

	/**
	 * Runs validation on the form panel
	 * @return {Boolean}
	 */
	isValid: function() {
		var that = this;

		var valid = this.getForm().isValid();
		var modelValid = true;

		if (this.bind) {
			this.updateBoundModels();

			Ext.each(this.bind.models, function(model) {
				var errors = model.instance.validate();
				if (!errors.isValid()) {
					modelValid = false;
					errors.each(function(error) {
						var field = that.findField(model.prefix + error.field);
						if (field) {
							field.markInvalid(error.message);
						}
					});
				}
			});
		}

		return (valid && modelValid);
	},

	/**
	 * Use this function to submit a form to a service action passing it all the data from the bound models.
	 * If for any reason you didn't call isValid() before calling this function, make sure you call
	 * updateBoundModels() first to copy the form data to the model objects.
	 * @param  {Object}  options
	 * @param  {String}  options.service             The service to submit the form to
	 * @param  {String}  options.action              The service action to submit the form to
	 * @param  {String}  [options.extraFields]       Extra fields to send that may not be a part of any bound models
	 * @param  {String}  [options.extraParams]       Extra parameters to pass to the service action
	 * @param  {Boolean} [options.useMask=true]      Whether or not to mask the form when saving
	 * @param  {String}  [options.maskText="Saving"] The text for the mask (only applies if useMask is true)
	 * @param  {String}  [options.success]           The callback if submission is successful
	 * @param  {String}  [options.failure]           The callback if submission fails
	 */
	submitWithBindings: function(options) {
		var that = this;

		// Create default options
		Ext.applyIf(options, {
			extraFields: {},
			extraParams: {},
			useMask    : true,
			maskText   : 'Saving',
			success    : Ext.emptyFn,
			failure    : Ext.emptyFn
		});

		// Setup the data object that will get sent with the ajax request
		var data = options.extraParams;

		// Add any extra fields specified to the data object
		Ext.Object.each(options.extraFields, function(key, val) {
			var field = that.findField(val);
			if (field) {
				data[key] = field.getValue();
			}
		});
		
		// Add model fields to the data object
		Ext.each(this.bind.models, function(model) {
			var paramName = model.class.split('.');
			paramName = paramName[paramName.length-1].toLowerCase();
			data[model.prefix + paramName] = model.instance.getData();
		});

		// Create a mask if option is on
		if (options.useMask) {
			var mask = new Ext.LoadMask(this, options.maskText);
			mask.show();
		}

		// Run ajax request to send the data
		return NP.lib.core.Net.remoteCall({
			method  : 'POST',
			requests: {
				service: options.service,
				action : options.action,
				data   : data,
				success: function(result, deferred) {
					// If save is successful, run success callback
					if (result.success) {
						options.success(result, deferred);
					// If there's a failure, process the errors
					} else {
						// Only try to process results if there's an errors array
						if (result.errors && result.errors instanceof Array) {
							Ext.each(result.errors, function(error) {
								if (error.field == 'global') {
									Ext.MessageBox.alert('Error', error.msg);
								} else {
									var field = that.findField(error.field);
									if (field) {
										field.markInvalid(error.msg);
									}
								}
							});
						}
						// Run the failure callback
						options.failure(result, deferred);
					}
					// If mask option is on, remove the mask
					if (options.useMask) {
						mask.destroy();
					}
				},
				failure: function() {
					Ext.log('Error saving user information');
				}
			}
		});
	}
});