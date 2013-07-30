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
		var that = this;

		var context  = NP.Security.getCurrentContext();

		function getUrl(property_id, callback) {
			return NP.lib.core.Net.remoteCall({
				requests: [
					{
						service       : 'CatalogService',
						action        : 'getPunchoutUrl',
						vc_id         : vc.get('vc_id'),
						userprofile_id: NP.Security.getUser().get('userprofile_id'),
						property_id   : property_id,
						success       : callback
					}
				]
			});
		}

		var deferred = getUrl(context['property_id'], function(result, deferred) {
			if (result.success) {
				var view = Ext.create('Ext.container.Container', {
					layout: {
						type : 'vbox',
						align: 'stretch'
					},
					items: [
						{
							xtype: 'container',
							items: [{
								xtype : 'shared.propertycombo',
								store : 'user.Properties',
								value : context['property_id'],
								margin: 8,
								listeners: {
									select: function(combo, recs) {
										getUrl(recs[0].get('property_id'), function(result, deferred) {
											view.query('#punchoutFrame')[0].getEl().set({ src: result['url'] });
										});
									}
								}
							}]
						},{
							xtype: 'container',
							itemId: 'punchoutFrame',
							autoEl: {
								tag: 'iframe',
								src: result['url']
							},
							flex: 1
						}
					]
				});
				
				deferred.resolve(view);
			} else {
				Ext.MessageBox.alert(that.punchoutErrorTitleText, that.punchoutErrorText);
				deferred.reject(that.punchoutErrorText);
			}
		});

		return deferred;
	}

});