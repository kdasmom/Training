/**
 * Definition for Punchout catalog type implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.catalog.Punchout', {
    
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

	hasPOSubmit: function() {
		return true;
	}

});