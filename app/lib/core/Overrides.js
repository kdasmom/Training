/**
 * This has all the overrides needed for our app
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.Overrides', function() {
	// Fixes current bug with ExtJS where suspendEvents() doesn't affect events set by the controller
	// in Controller.control() method
	Ext.define('Ext.override.app.EventBus', {
		override: 'Ext.app.EventBus',

		constructor: function()
		{
			var me = this;
			me.callParent(arguments);
			// Queue für pausierte Events pro Component-ID
			me.eventQueue = {};

			Ext.override(Ext.Component, {
				// bei resumeEvents wird nur continueFireEvent für die Queue-Elemente aufgerufen,
				// sodass wir hier nochmal selbst dispatch aufrufen müssen
				resumeEvents: function()
				{
					// ACHTUNG: this ist die Component
					Ext.util.Observable.prototype.resumeEvents.apply(this, arguments);
					if (!this.eventsSuspended)
						me.resumeQueuedEvents(this);
				}
			});
		},
		dispatch: function(ev, target, args)
		{
			// Events nicht dispatchen, wenn pausiert
			if (target.eventsSuspended)
			{
				// Events in die Queue packen, wenn target.suspendEvents(true) aufgerufen wurde
				if (!!target.eventQueue)
				{
					var id = target.getId();
					this.eventQueue[id] = this.eventQueue[id] || [];
					this.eventQueue[id].push([ev, target, args]);
				}
				return true;
			}
			return this.callParent(arguments);
		},
		/**
		 * Funktion wird bei resumeEvents einer Component aufgerufen
		 * -> alle gequeueten Events jetzt auslösen
		 * @private
		 */
		resumeQueuedEvents: function(target)
		{
			var me = this,
				id = target.getId(),
				queue = me.eventQueue[id],
				i = 0,
				len;
			if (queue)
				for (len = queue.length; i < len; i++)
					me.dispatch.apply(me, queue[i]);
			delete me.eventQueue[id];
		}
	});

	// Override the default format used by Ext to encode dates
	Ext.JSON.encodeDate = function(d) {
		return Ext.Date.format(d, '"Y-m-d H:i:s.u"');
	};

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
	        	if (c instanceof Ext.tab.Panel || c instanceof NP.lib.ui.VerticalTabPanel) {
	        		c.setActiveTab(me);
	        		return false;
	        	} else {
		            if (p = c.ownerCt) {
		                if (p instanceof Ext.tab.Panel || p instanceof NP.lib.ui.VerticalTabPanel) {
		                	p.setActiveTab(c);
		                	return false;
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
		digits: function(config, value) {
			return value.search(/^-?\d+$/) != -1;
		},

		numeric: function(config, value) {
			return value.search(/^-?((\d+(\.\d+)?)|(\.?\d+))$/) != -1;
		},

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