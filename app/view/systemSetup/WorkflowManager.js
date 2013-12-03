/**
 * System Setup: Workflow Manager section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.WorkflowManager', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.systemsetup.workflowmanager',

    requires: ['NP.lib.core.Translator'],
    
    title: 'Workflow Manager',

    html: 'Coming soon...',

    initComponent: function() {
    	this.title = NP.Translator.translate(this.title);

    	this.callParent(arguments);
    }
});