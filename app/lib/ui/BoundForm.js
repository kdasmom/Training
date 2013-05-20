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
	 * @cfg {String}            bind.action (required)  The service action to call to get data to populate the form
	 */
	/**
	 * @cfg {String[]/Object[]} bind.models (required)  Model(s) to bind the form against; this can be specified as a single item or an array of item; each item can be just a string with the model class (omit NP.model part) or an object if you need to specify a prefix (see docs)
	 */
	/**
	 * @cfg {String}            bind.models.class       The class path of the model to bind
	 */
	/**
	 * @cfg {String}            bind.models.prefix      A prefix used by the form field that when added to a model field name makes it match the form field name
	 */
	/**
	 * @cfg {Boolean}           bind.hasUpload=false    Whether or not the form uploads files
	 */
	/**
	 * @cfg {String}            bind.extraParams        Extra parameters to pass to the service action
	 */
	/**
	 * @cfg {Array}             bind.extraFields        Extra field values that are not part of any model but will also be returned
	 */
	/**
	 * @cfg {String}            bind.evt="render"       Event that you want to use to trigger the binding of the form; usually "render" or "show"
	 */
	initComponent: function() {
		var that = this;

		// Add custom event
		this.addEvents('dataloaded');
		
		// Load the parent init function
		this.callParent(arguments);

		// Defaults
		Ext.applyIf(this.bind, {
			evt        : 'render',
			extraParams: {}
		});

		// Check if models is an array or not; if it's not an array, convert it to one
		if ((this.bind.models instanceof Array) == false) this.bind.models = [this.bind.models];

		// Initialize models
		that.bind.modelPointer = {};
		Ext.each(that.bind.models, function(model, idx) {
			// If model is not an object (just a string), make it an object for consistency
			if ((model instanceof Object) == false) {
				model = { class: model, prefix: '' };
				that.bind.models[idx] = model;
			}
			// Create an empty model
			that.bind.models[idx].instance = Ext.create('NP.model.' + model.class);
			that.bind.modelPointer[model.class] = idx;
		});

		// Only run ajax event if service/action has been provided, otherwise just bind the models
		if (!this.bind.service) {
			// Copy the model data to the form fields
			this.updateBoundFields();
		} else {
			// Do the data binding once the form has been shown
			this.on(this.bind.evt, function() {
				// Create a loading mask
				var mask = new Ext.LoadMask(that);

				// Build the request object 
				var req = {
					service    : this.bind.service,
					action     : this.bind.action,
					success    : function(result, deferred) {
						// If data is returned, set the field values on the models
						if (result !== null) {
							that.updateModels(result);
						}
						
						// Copy the model data to the form fields
						that.updateBoundFields();

						// Set the fields that are not part of models if any
						if (that.bind.extraFields) {
							Ext.Array.each(that.bind.extraFields, function(fieldName) {
								var field = that.findField(fieldName);

								// If the field exists and a value was returned for it, set its value too
								if (field && result[fieldName]) {
									field.setValue(result[fieldName]);
								}
							});
						}

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
		}
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
	 * Updates models bound to this form with the appropriate field values
	 */
	updateBoundModels: function() {
		var that = this;
		Ext.each(this.bind.models, function(model) {
			model.instance.fields.each(function(col) {
				var field = that.findField(model.prefix + col.name);
				if (field) {
					var val = (field.getGroupValue) ? field.getGroupValue() : field.getValue();
					model.instance.set(col.name, val);
				}
			});
		});
	},

	/**
	 * Returns a specific model
	 * @param  {String} className The model class to retrieve (same way you declared it in the bind config option)
	 * @return {Ext.data.Model}
	 */
	getModel: function(className) {
		var idx = this.bind.modelPointer[className];

		return this.bind.models[idx].instance;
	},

	/**
	 * Sets a model record as the bound model
	 * @param  {String}         className The model class to retrieve (same way you declared it in the bind config option)
	 * @param  {Ext.data.Model} rec       The record to set as the bound model
	 */
	setModel: function(className, rec) {
		var idx = this.bind.modelPointer[className];

		this.bind.models[idx].instance = rec;
	},

	/**
	 * Saves data from an object into the models associated with the form
	 * @param  {Object} data Data to save to the model
	 */
	updateModels: function(data) {
		var that = this;

		Ext.each(this.bind.models, function(model, idx) {
			// Get our model instance
			var modelObj = that.bind.models[idx].instance;

			// Loop through all the model fields
			modelObj.fields.each(function(col) {
				// Field name must include the prefix
				var fieldName = model.prefix + col.name;

				// If the field is found in the data object, proceed
				if (fieldName in data) {
					// Set the value in the model
					modelObj.set(col.name, data[fieldName]);
				}
			});
		});
	},

	/**
	 * Returns all models bound to this form
	 * @return {Array}
	 */
	getModels: function() {
		return this.bind.models;
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
	 * Runs validation on the form panel
	 * @return {Boolean}
	 */
	isValid: function() {
		var that = this;

		this.updateBoundModels();
		
		var valid = this.getForm().isValid();
		var modelValid = true;
		
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

		var isValid = (valid && modelValid);
		// Make sure the first invalid field is showing on the screen
		if (!isValid) {
			var invalidFields = this.findInvalid();
			if (invalidFields.getCount()) {
				invalidFields.getAt(0).ensureVisible();
			}
		}

		return isValid;
	},

	/**
	 * Use this function to submit a form to a service action passing it all the data from the bound models.
	 * If for any reason you didn't call isValid() before calling this function, make sure you call
	 * updateBoundModels() first to copy the form data to the model objects.
	 * @param  {Object}  options
	 * @param  {String}  options.service             The service to submit the form to
	 * @param  {String}  options.action              The service action to submit the form to
	 * @param  {Object}  [options.extraFields]       Extra fields to send that may not be a part of any bound models
	 * @param  {Object}  [options.extraParams]       Extra parameters to pass to the service action
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

		Ext.apply(options, {
			isUpload: false,
			form    : ''
		});

		// Setup the data object that will get sent with the ajax request
		var data = options.extraParams;

		// Add any extra fields specified to the data object
		var fileFields = [];
		Ext.Object.each(options.extraFields, function(key, val) {
			var field = that.findField(val);
			if (field) {
				if (field.getXType() == 'filefield') {
					fileFields.push(field);
				} else {
					data[key] = field.getValue();
				}
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
			var mask = new Ext.LoadMask(this, { msg: options.maskText });
			mask.show();
		}

		// If dealing with a file upload, add a hiden form element in the body of the HTML document
		if (fileFields.length) {
			options.isUpload = true;
			var time = new Date().getTime();
			options.form = 'fileupload-form-' + time;
			var formEl = Ext.DomHelper.append(Ext.getBody(), '<form id="'+options.form+'" method="POST" enctype="multipart/form-data" class="x-hide-display"></form>');
			Ext.each(fileFields, function(fileField) {
				formEl.appendChild(fileField.extractFileInput());
			});
		}

		// Run ajax request to send the data
		return NP.lib.core.Net.remoteCall({
			method  : 'POST',
			isUpload: options.isUpload,
			form    : options.form,
			requests: {
				service : options.service,
				action  : options.action,
				data    : data,
				success : function(result, deferred) {
					// If save is successful, run success callback
					if (result.success) {
						// Update models if relevant data is returned
						if (result.updatedData) {
							that.updateModels(result.updatedData);
						}
						options.success(result, deferred);
					// If there's a failure, process the errors
					} else {
						// Only try to process results if there's an errors array
						if (result.errors && result.errors instanceof Array) {
							Ext.each(result.errors, function(error) {
								if (error.field == 'global') {
									Ext.MessageBox.alert('Error', error.msg);
									return false;
								} else {
									var field = that.findField(error.field);
									if (field) {
										field.markInvalid(error.msg);
									}
								}
							});
							var invalidFields = that.findInvalid();
							if (invalidFields.getCount()) {
								invalidFields.getAt(0).ensureVisible();
							}
						}
						// Run the failure callback
						options.failure(result, deferred);
					}
					// If mask option is on, remove the mask
					if (options.useMask) {
						mask.destroy();
					}

					// If there was a file upload, remove the form element
					if (fileFields.length) {
						Ext.removeNode(formEl);
					}
				},
				failure: function() {
					Ext.log('Error submitting bound form');
				}
			}
		});
	}
});