/**
 * A vertical tab panel that works in a similar way to the regular Ext.tab.Panel component, only the tabs can be set
 * on the left or right instead of top or bottom.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.VerticalTabPanel', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.verticaltabpanel',
	
    /**
     * @cfg {String} tabPosition="left"
     * The position where the tab strip should be rendered. Can be 'left' or 'right'.
     */
    tabPosition : 'left',

    /**
     * @cfg {Number} tabWidth
     * The width of the tab bar. If not specified, will be as wide as the widest tab based on the text in it.
     */
    tabWidth : null,

    /**
     * @cfg {"small"/"medium"/"large"} tabSize="medium"
     * The size of the tabs. Can be set to 'small', 'medium', or 'large' (the available options for 'scale' on buttons)
     */
    tabSize: 'medium',

    /**
     * @cfg {String} activeTab
     * The tab to activate initially. Either an itemId, index, or the tab component itself.
     */
    activeTab : 0,

    /**
     * @cfg {Boolean} deferredRender
     * Whether or not to use deferredRender on the card
     */
    deferredRender: true,

    /**
     * @cfg {Object} layout
     * Optional configuration object for the internal card layout. If present, this is passed straight through to the layout's constructor
     */
    layout: {},

    /**
     * @cfg {String} barConfig
     * Additional configurations to be passed to the tab bar 
     */
    barConfig: {},

    /**
     * Returns the item that is currently active inside this VerticalTabPanel.
     * @return {Ext.Component} The currently active item.
     */
    getActiveTab: function() {
    	return this.layout.getActiveItem();
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

                this.layout.setActiveItem(newTab);
                this.fireEvent('tabchange', this, newTab, oldTab);

                return newTab;
            }
        }
        return oldTab;
    },

    initComponent: function() {
        var me = this;

        this.layout = new Ext.layout.container.Card(Ext.apply({
            owner: me,
            deferredRender: this.deferredRender,
            activeItem: this.activeTab
        }, this.layout));

        this.tabs = [];
        this.panels = [];
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
                scale: me.tabSize,
                cls: 'x-vertical-tab x-vertical-tab-' + me.tabPosition + ' x-vertical-tab-' + active,
                handler: function(button) {
                    me.setActiveTab(button.panel);
                }
            });

            panel.title = '';

            panel.tab = tab;
            tab.panel = panel;

            me.tabs.push(tab);
            me.panels.push(panel);
        });
        
        this.items = me.panels;

        // Add the dock that will hold the tabs on the left or right
        this.dockedItems = {
            xtype: 'toolbar',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            dock : this.tabPosition,
            width: this.tabWidth,
            items: this.tabs
        };

        // Apply any custom config the user set for the style
        Ext.applyIf(this.dockedItems, this.barConfig);

        // Apply some more defaults in the even that the user didn't alreay set them
        Ext.applyIf(this.dockedItems, {
            padding: (this.tabPosition == 'left') ? '3 0 3 3' : '3 3 3 0',
            defaults: {
                margin: '8 0 0 0'
            }
        });

    	this.addEvents('beforetabchange','tabchange');

    	this.callParent(arguments);
    	
    }
});