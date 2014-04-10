/**
 * 
 */
Ext.define('NP.lib.print.renderer.AbstractRenderer', {
    /**
     * @cfg {String} baseCls 
     * The base CSS class applied to the document body.
     * Defaults to 'ux-printer'
     */
    baseCls: 'x-print',
    /**
    * @cfg {Array} defaultStyleSheets
    * @property defaultStyleSheets
    * @type Array
    * The default stylesheets that will be included for every generation.
    * Defaults to ['css/printer.css']
    */
    styleSheets: ['resources/print.css'],
    /**
    * @cfg {String} docType
    * The full html doctype tag. 
    * Defaults to strict.
    */
    docType: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
        //'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',

    closeOnPrint: false,

    /**
     * @private
    * Generates the HTML Markup which wraps whatever this.generateBody produces
    * @param {Ext.Component} component The component to generate HTML for
    * @return {String} An HTML fragment to be placed inside the print window
    */
    generateHTML: function(component) {
        var me         = this,
            styleLinks = '',
            tpl        = '<link href="{0}" rel="stylesheet" type="text/css" media="screen,print" />',
            ss         = Ext.Array.from(me.styleSheets),
            i          = 0;
            
        for (; i < ss.length; i++) {
            styleLinks += Ext.String.format(tpl, ss[i]);
        }
        
        return me.docType +
            '<html>' +
                '<head>' +
                    '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />' +
                    styleLinks +
                    '<title>' + me.getTitle(component) + '</title>' +
                '</head>' +
                '<body class="' + me.baseCls + '">' +
                    '<div id="csscheck"></div>' +
                    me.generateBody(component) +
                '</body>' +
            '</html>';
    },

    /**
    * Returns the HTML that will be placed into the print window. This should produce HTML to go inside the
    * <body> element only, as <head> is generated in the print function
    * @param {Ext.Component} component The component to render
    * @return {String} The HTML fragment to place inside the print window's <body> element
    */
    generateBody: Ext.emptyFn,
    
    /**
    * Returns the title to give to the print window
    * @param {Ext.Component} component The component to be printed
    * @return {String} The window title
    */
    getTitle: function(component) {
        var me = this;

        if (me.title) {
            return me.title;
        } else {
            // Precaution to avoid unexpected infinite loop
            var maxIteration = 15,
                iteration    = 0;

            // Try going up the component chain to see if there's a title we can use
            while (component && iteration < 15) {
                if (component.title && !Ext.isEmpty(component.title)) {
                    return component.title;
                } else {
                    component = component.ownerCt;
                }
                iteration++;
            }
        }

        return 'Print Page';
    },
    
    /**
    * Prints the component
    * @param {Ext.Component} component The component to print
    */
    print: function(component) {
        var me   = this,
            html = me.generateHTML(component);
            
        me.showPrintWindow(html);
    },

    showPrintWindow: function(html) {
        var me  = this,
            win = window.open('');
            
        if (!win){ return; }
        
        win.document.open();
        win.document.write(html);

        // gecko looses its document after document.close(). but fortunally waits with printing till css is loaded itself
        if (Ext.isGecko) {
            win.print();
            if (me.closeOnPrint) {
                win.close();
            } else {
                win.document.close();
            }
            return;
        }
        
        win.document.close();
        
        Ext.defer(this.doPrintOnStylesheetLoad, 10, this, [win]);
    },

    /**
     * @private
     * Check if style is loaded and do print afterwards
     * @param {window} win
     */
    doPrintOnStylesheetLoad: function(win) {
        var me   = this,
            el   = win.document.getElementById('csscheck'),
            comp = el.currentStyle || getComputedStyle(el, null);
        
        if (comp.display !== "none") {
            Ext.defer(me.doPrintOnStylesheetLoad,10, me, [win]);
            return;
        }
        win.print();
        
        if (me.closeOnPrint) {
            win.close();
        }
    }
});