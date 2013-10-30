/**
 * User Manager > Groups tab > Form > Info Tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.GroupsFormPermissions', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.user.groupsformpermissions',
    
    rootVisible: false,
	useArrows  : true,
	bodyPadding: 4,
	frame      : false,
	border     : false,
	displayField: 'module_name',
	
    initComponent: function() {
    	var that = this;

    	that.title = NP.Translator.translate('Responsibilities');

    	var bar = [
    		{ text: NP.Translator.translate('Expand All'), handler: function() { that.expandAll(); } },
    		{ text: NP.Translator.translate('Collapse All'), handler: function() { that.collapseAll(); } }
    	];
	    this.tbar = bar;
	    this.bbar = bar;

    	this.store = Ext.create('Ext.data.TreeStore', {
    		fields: [
    			{ name: 'module_id', type: 'int' },
    			{ name: 'module_name' }
    		],
			autoLoad: true,
			proxy: {
	            type: 'ajax',
	            url : 'ajax.php',
				extraParams: {
					service       : 'SecurityService',
					action        : 'getModuleTree',
					module_id     : 0,
					getAsHierarchy: true
				}
	        },
	        sorters: [{
	            property: 'leaf',
	            direction: 'ASC'
	        },{
	            property: 'text',
	            direction: 'ASC'
	        }]
	    });

	    this.callParent(arguments);

	    this.addEvents('checkchangecascade');

	    // Listener for when a checkbox is toggled
	    this.on('checkchange', function(node, checked) {
	    	// When a box is toggled, also toggle all child nodes
	    	node.cascadeBy(function(n){
	    		n.set('checked', checked);
	    	});

	    	// If a node is checked, make sure to check all parent nodes going up the tree
	    	if (checked) {
		    	var parentNode = node.parentNode;
		    	while (parentNode) {
		    		parentNode.set('checked', checked);
		    		parentNode = parentNode.parentNode;
		    	}
		    }

		    that.fireEvent('checkchangecascade', that, node, checked);
	    });
    }
});