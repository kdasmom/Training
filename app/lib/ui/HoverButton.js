Ext.define('NP.lib.ui.HoverButton', {
    extend: 'Ext.Button',
    alias: 'widget.hoverButton',
  
    // hide task properties and helpers
    hideTask: null,
    isOver: false,
    hideTaskMs: 250, // timeout in ms
    hideTaskFn: function () {
        if (this.isOver) {
            if(this.hideTask !== null) this.hideTask.cancel();
            return;
        }
        if (this.hideTask !== null) {
            this.hideTask.cancel();
        }
        this.hideTask = new Ext.util.DelayedTask(this.hideMenu, this);
        this.hideTask.delay(this.hideTaskMs);
    },
     
    applyListeners : function(menu, cfg) {
         
        Ext.apply(menu, cfg);
             
        Ext.each(menu.items, function(item, idx, allItems){
            if(item.menu) {
                this.applyListeners(item.menu, cfg);
            }
        }, this);
    },
  
    // extend init props
    initComponent: function () {
  
        // add hide/show, if this is a button with menu
        var config = {}, menuConfig = {};
        if (Ext.isDefined(this.menu)) {
            config = {
                listeners: {
                    mouseover: {
                        fn: function (b) {
                            this.isOver = true;
                            b.showMenu();
                        },
                        scope: this
                    },
                    mouseout: {
                        fn: function (b) {
                            this.isOver = false;
                            this.hideTaskFn();
                        },
                        scope: this
                    }
                }
            };
            // add listeners to see if user is over extended menu list
            menuConfig = {
                listeners: {
                    // if mousing over menu list, disable timeout
                    mouseover: {
                        fn: function (b) {
                            // cancel hide if they went away and came back
                            if (this.hideTask !== null) {
                                this.hideTask.cancel();
                                this.hideTask = null;
                            }
                        },
                        scope: this
                    },
                    // on mousing out of menu list, resume timeout
                    mouseleave: {
                        fn: function (b) {
                            this.hideTaskFn();
                        },
                        scope: this
                    }
                }
            };
             
            //apply mouseover/leave listeners to all submenus recursively
            this.applyListeners(this.menu, menuConfig);  
        }
  
        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        // call parent
        NP.lib.ui.HoverButton.superclass.initComponent.apply(this, arguments);
    }
});