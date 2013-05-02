/**
 * A vertical tab panel that works in a similar way to the regular Ext.tab.Panel component, only the tabs can be set
 * on the left or right instead of top or bottom.
 *
 * @author Thomas Messier
 */
Ext.define('Ext.ux.VerticalTabPanel', {
	extend: 'Ext.container.Container',
    alias: 'widget.verticaltabpanel',
	
    /**
     * @cfg {String} tabPosition
     * The position where the tab strip should be rendered. Can be 'left' or 'right'.
     */
    tabPosition : 'left',

    /**
     * @cfg {Number} tabWidth
     * The width of the tab bar. If not specified, will be as wide as the widest tab based on the text in it.
     */
    tabWidth : null,

    /**
     * @cfg {String} activeTab
     * The tab to activate initially. Either an itemId, index, or the tab component itself.
     */
    activeTab : 0,

    /**
     * Returns the item that is currently active inside this VerticalTabPanel.
     * @return {Ext.Component} The currently active item.
     */
    getActiveTab: function() {
    	return this.card.layout.getActiveItem();
    },

    /**
     * Makes the given card active. Makes it the visible card in the TabPanel's CardLayout and highlights the Tab.
     * @param  {String/Number/Ext.Component} newTab The card to make active. Either an ID, index or the component itself.
     * @return {Ext.Component}                      The resulting active child Component. The call may have been vetoed, or otherwise modified by an event listener.
     */
    setActiveTab: function(newTab) {
    	var me = this;

    	// If newTab is a number, assume it's an index
    	if (typeof newTab == 'number') {
    		newTab = this.panels[newTab];
    	// If it's a string, assume it's an itemId
    	} else if (typeof newTab == 'string') {
    		newTab = Ext.getCmp(newTab);
    	}

    	var oldTab = this.getActiveTab();
    	if (newTab !== oldTab) {
    		if (this.fireEvent('beforetabchange', this, newTab, oldTab) !== false) {
	    		Ext.Array.each(this.tabs, function(tab) {
		    		var active = (tab === newTab.tab) ? true : false;
		    		var el = tab.getEl();
					if (active) {
						el.removeCls('x-vertical-tab-inactive');
						el.addCls('x-vertical-tab-active');
					} else {
						el.removeCls('x-vertical-tab-active');
						el.addCls('x-vertical-tab-inactive');
					}	
		    	});

		    	this.card.layout.setActiveItem(newTab);
		    	this.fireEvent('tabchange', this, newTab, oldTab);

		    	return newTab;
		    }
	    }
	    return oldTab;
    },

    initComponent: function() {
    	var me = this;

    	this.layout = {
	    	type: 'hbox',
	    	align: 'stretch'
	    };

    	var tabs = [];
    	var panels = [];
    	
    	Ext.Array.each(this.items, function(panel, idx) {
    		if (!panel.events) {
    			panel = Ext.ComponentManager.create(panel);
    		}
    		
    		if (me.activeTab == idx || me.activeTab == panel.itemId || me.activeTab === panel) {
    			me.activeTab = idx;
    		}

    		var active = (me.activeTab == idx) ? 'active' : 'inactive';
    		var tab = Ext.widget('button', {
				text    : panel.title,
				hidden  : (panel.hidden) ? panel.hidden : false,
				textAlign: (me.tabPosition == 'left') ? 'right' : 'left',
				border: (me.tabPosition == 'left') ? '1 0 1 1' : '1 1 1 0',
				scale: 'medium',
				cls: 'x-vertical-tab x-vertical-tab-' + me.tabPosition + ' x-vertical-tab-' + active,
				handler: function(button) {
					me.setActiveTab(button.panel);
				}
    		});

    		panel.title = '';

    		panel.tab = tab;
    		tab.panel = panel;

    		tabs.push(tab);
    		panels.push(panel);
    	});
    	
    	this.tabs = tabs;
    	this.panels = panels;

    	tabs = Ext.widget('container', {
    		layout: {
    			type: 'vbox',
    			align: 'stretch'
    		},
    		defaults: {
    			margin: '0 0 8 0'
    		},
    		width: this.tabWidth,
    		items: tabs
    	});
    	this.card = Ext.widget('panel', {
    		layout: 'card',
    		activeItem: this.activeTab,
    		border: true,
    		flex: 1,
    		autoScroll: true,
    		defaults: { padding: 8 },
    		items: panels
    	});

    	if (this.tabPosition == 'left') {
    		this.items = [tabs, this.card];
    	} else {
    		this.items = [this.card, tabs];
    	}

    	this.addEvents('beforetabchange','tabchange');

    	this.callParent(arguments);
    	
    }
});