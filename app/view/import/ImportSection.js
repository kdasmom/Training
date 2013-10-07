/**
 * Import/Export Utility > Generic import tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.ImportSection', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.importsection',
   
    requires: [
      'NP.lib.ui.VerticalTabPanel'
    ],
           
    title: null, // This needs to be set when instantiatiating the component
    tabs : [],   // This needs to be set when instantiating the component

    layout: 'fit',

    initComponent: function() {
      var subTabs = [];
      Ext.each(this.tabs, function(tab) {
        var importItem = Ext.create('NP.view.import.types.' + tab);

        subTabs.push({
          xtype: 'panel',
          itemId: tab + 'Panel',
          title: importItem.tabTitle,
          layout: 'fit',
          border: false,
          items: []
        });
      });

      if (subTabs.length > 1) {
        this.items = [{
          xtype : 'verticaltabpanel',
          border: false,
          items : subTabs
        }];
      } else {
        delete subTabs[0].title;
        this.items = [subTabs[0]];
      }

    	this.callParent(arguments);
    }
});