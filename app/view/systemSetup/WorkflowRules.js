Ext.define('NP.view.systemSetup.WorkflowRules', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.workflowrules',

    requires: ['NP.lib.core.Translator'],
    
    title: 'Workflow Manager',

    layout: 'fit',

    initComponent: function() {
    	this.title = NP.Translator.translate(this.title);
    	this.callParent(arguments);
    }
});