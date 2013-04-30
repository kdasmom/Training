/**
 * This has all the overrides needed for our app
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.Overrides', function() {
	// Override ItemSelector so we can use templates in them
	Ext.override(Ext.ux.form.ItemSelector, {
		createList: function(title){
	        var me = this;

	        var cfg = {
	            submitValue: false,
	            flex: 1,
	            dragGroup: me.ddGroup,
	            dropGroup: me.ddGroup,
	            tpl: me.tpl,
	            title: title,
	            store: {
	                model: me.store.model,
	                data: []
	            },
	            displayField: me.displayField,
	            disabled: me.disabled,
	            listeners: {
	                boundList: {
	                    scope: me,
	                    itemdblclick: me.onItemDblClick,
	                    drop: me.syncValue
	                }
	            }
	        };

	        if (me.tpl) {
	            cfg.listConfig = { tpl: me.tpl };
	        }

	        return Ext.create('Ext.ux.form.MultiSelect', cfg);
	    }
	});

	// Add a findInvalid() method to form panel
	Ext.override(Ext.form.Panel, {
		findInvalid: function() {
		    var form = this.getForm();
		    
		    var invalid = form.getFields().filterBy(function(field) {
		        return (field.getActiveErrors().length) ? true : false;
		    });
		    
		    return invalid;
		}
	});

	// Makes sure a component is visible (for example, if you want to make sure a field's tab is active)
	Ext.override(Ext.Component, {
	    ensureVisible: function(stopAt) {
	        var p, me = this;
	        this.ownerCt.bubble(function(c) {
	        	if (c instanceof Ext.tab.Panel) {
	        		c.setActiveTab(me);
	        	} else {
		            if (p = c.ownerCt) {
		                if (p instanceof Ext.tab.Panel) {
		                    p.setActiveTab(c);
		                }
		            }
		        }
	            return (c !== stopAt);
	        });
	        
	        return this;
	    }
	});
	
	// Override default location or validation messages
	Ext.override(Ext.form.field.Base, {
		msgTarget: 'under'
	});

	// Override useNull in data fields
	Ext.override(Ext.data.Field, {
		useNull: true
	});

	// Add a capitalize formatting function
	Ext.apply(Ext.util.Format, {
		capitalize: function(val) {
		    var re = /(^|[^\w])([a-z])/g,
		        fn = function(m, a, b) {
		            return a + b.toUpperCase();
		        };
		    return val.toLowerCase().replace(re, fn);
		}
	});

	// Override Model's validate() function so that blank/null values are only validated if not blank
	// (presence validation rule should take care of values that shouldn't be blank)
	Ext.override(Ext.data.Model, {
		validate: function() {
	        var errors      = new Ext.data.Errors(),
	            validations = this.validations,
	            validators  = Ext.data.validations,
	            length, validation, field, valid, type, i;

	        if (validations) {
	            length = validations.length;

	            for (i = 0; i < length; i++) {
	                validation = validations[i];
	                field = validation.field || validation.name;
	                type  = validation.type;
	                
	                // Only validate non blank/null values with rules other than presence
	                if (type && (type == 'presence' || (this.get(field) !== '' && this.get(field) !== null))) {
	                	valid = validators[type](validation, this.get(field), this);

		                if (!valid) {
		                    errors.add({
		                        field  : field,
		                        message: validation.message || validators[type + 'Message']
		                    });
		                }
		            }
	            }
	        }

	        return errors;
	    }
	});
	
	// Add validation types for Models
	Ext.override(Ext.data.validations, {
		password: function(config, value) {
			return (/\d/.test(value) && /[a-z]/i.test(value) && /[!@#$%&*?]/.test(value) && value.length >= 6);
		},

		presence: function(config, value, rec) {
	        // No configs read, so allow just value to be passed
	        if (arguments.length === 1) {
	            value = config;
	        }
	        
	        // Only proceed with more validation checks if the value is blank or null
	        if (value === '' || value === null) {
	        	if (config.dependency || config.groupFields) {
		        	// If a dependency has been defined
		        	if (config.dependency) {
		        		var val = rec.get(config.dependency);
						if (Ext.Array.contains(config.values, val)) {
							return false;
						}
		        	}
		        	
		        	// If a group has been defined
		        	if (config.groupFields) {
		        		for (var i=0; i<config.groupFields.length; i++) {
							var val = rec.get(config.groupFields[i]);
							
							if (val !== null && val !== '') {
								return false;
							}
						}
		        	}
		        } else {
		        	return false;
		        }
	        }

	        return true;
	    }
	});

	return {
		singleton: true
	}
});