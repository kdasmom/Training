/**
 * Import/Export Utility > Overview tab
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.overview',

    title: 'Overview',
    bodyPadding: 8,
    html: '<b>Overview</b><br>'+
    'The Import/Export tool allows you to easily import and export key information in and from the NexusPayables system. '+
    'This tool will enable you to easily upload setup information to help you quickly get started in using the system as well'+
    'as upload additional values to these sections as your setup changes. Please note, edits to these uploaded values must be made'+
    'in the respective administration management and setup areas.',
    
    initComponent: function() {
	    this.callParent(arguments);
    }
});