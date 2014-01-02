/**
 * Definition for Punchout catalog type implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.types.Punchout', {
	extend: 'NP.view.catalogMaintenance.types.AbstractCatalog',
	
	requires: 'NP.lib.core.Security',
	
	// For localization
	punchoutErrorTitleText: 'Error',
	punchoutErrorText     : 'Punchout request failed',

    getFields: function() {
		return [
			{ 
				xtype     : 'textfield',
				fieldLabel: 'URL',
				name      : 'vc_punchout_url',
				width     : 450
			},{
				xtype     : 'textfield',
				fieldLabel: 'Username',
				name      : 'vc_punchout_username',
				width     : 450
            },{
				xtype     : 'textfield',
				fieldLabel: 'Password',
				name      : 'vc_punchout_pwd',
				inputType : 'password',
				width     : 450
            },{
				xtype     : 'textfield', 
				fieldLabel: 'From DUNS',
				name      : 'vc_punchout_from_duns',
				width     : 450
            },{
				xtype     : 'textfield',
				fieldLabel: 'To DUNS',
				name      : 'vc_punchout_to_duns',
				width     : 450
            },{
            	xtype: 'checkbox',
            	boxLabel: 'Copy info to Electronic PO Submission',
            	inputValue: '1',
            	listeners: {
            		change: function(checkbox, newValue, oldValue) {
            			var sourceFields = ['vc_punchout_url','vc_punchout_username','vc_punchout_pwd','vc_punchout_from_duns','vc_punchout_to_duns'];
            			var targetFields = ['vc_posubmit_url','vc_posubmit_username','vc_posubmit_pwd','vc_posubmit_from_duns','vc_posubmit_to_duns'];
            			var form = this.up('form');
	            		if (newValue) {
	            			Ext.each(sourceFields, function(sourceField, idx) {
	            				var targetField = form.findField(targetFields[idx]);
	            				targetField.setValue(form.findField(sourceField).getValue());
	            			});
	            		} else {
	            			Ext.each(targetFields, function(fieldName) {
	            				form.findField(fieldName).setValue('');
	            			});
	            		}
	            	}
	            }
            }
		];
	},

	getVisibleTabs: function() {
		return ['categories','properties','vendors','posubmission'];
	},

	getView: function(vc) {
		var me = this;

		var view = Ext.create('Ext.panel.Panel', {
			layout: 'fit',
			height: '100%',
			tbar: [
				{
					xtype       : 'customcombo',
					itemId      : 'punchoutPropertyCombo',
					store       : 'user.Properties',
					displayField: 'property_name',
					valueField  : 'property_id',
					fieldLabel  : NP.Config.getPropertyLabel(),
					value       : NP.Security.getCurrentContext().property_id,
					listeners   : {
						select: function(combo) {
							me.onSelectProperty(combo, vc)
						}
					},
					width: 300
				}
			],
			items: [{
				xtype : 'component',
				itemId: 'punchoutCatalogIFrame',
				width : '100%',
				autoEl: {
					tag: 'iframe',
					src: '',
					width: '100%'
				}
			}],
			listeners: {
				render: function() {
					me.reloadIframe(vc);
				}
			}
		});

		return { view: view };
	},

	onSelectProperty: function(propertyCombo, vc) {
		var me            = this,
			property_id   = propertyCombo.getValue(),
			context       = NP.Security.getCurrentContext();

		if (me.property_id !== property_id) {
			me.reloadIframe(vc);
			me.property_id = property_id;
			NP.Security.setCurrentContext(Ext.apply(context, {
				property_id: property_id
			}));
		}
	},

	reloadIframe: function (vc) {
		var me          = this,
			iFrame      = Ext.ComponentQuery.query('#punchoutCatalogIFrame')[0],
			property_id = Ext.ComponentQuery.query('#punchoutPropertyCombo')[0].getValue()/*,
			mask        = new Ext.LoadMask({target: iFrame})*/;
		
		//mask.show();

		NP.lib.core.Net.remoteCall({
			requests: {
				service       : 'CatalogService',
				action        : 'getPunchoutUrl',
				vc_id         : vc.get('vc_id'),
				property_id   : property_id,
				userprofile_id: NP.Security.getUser().get('userprofile_id'),
				success       : function(success) {
					//mask.destroy();
					if (!success.success) {
						Ext.MessageBox.alert('Error', 'NexusPayables is unable to connect to this vendor at this time. Please try again. If the problem persists, report it to your system administrator for resolution.');
					} else {
						iFrame.el.dom.src = success.url;
					}
				}
			}
		});
	}
});