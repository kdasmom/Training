/**
 * A custom field that shows two radio buttons, one Yes and the other No
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.YesNoField', {
	extend: 'Ext.form.RadioGroup',
    alias: 'widget.shared.yesnofield',

    requires: ['NP.lib.core.Translator'],

	yesLabel: 'Yes',
	noLabel : 'No',

    columns: [45,45],

    initComponent: function() {
        this.yesLabel = NP.Translator.translate(this.yesLabel);
        this.noLabel  = NP.Translator.translate(this.noLabel);

    	var yesChecked = true,
    	    noChecked  = false;
    	
    	if ('value' in this) {
    		if (this.value == 0) {
    			noChecked = true;
    			yesChecked = false;
    		}
    	}

    	this.defaults = {
    		name: this.name,
    		style: 'white-space: nowrap;margin-right:12px;'
    	};
    	this.items = [
    		{ boxLabel: this.yesLabel, inputValue: 1, checked: yesChecked },
    		{ boxLabel: this.noLabel, inputValue: 0, checked: noChecked }
    	];

        delete this.name;

	    this.callParent(arguments);
    }
});