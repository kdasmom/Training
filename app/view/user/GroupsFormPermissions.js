/**
 * User Manager > Groups tab > Form > Info Tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.GroupsFormPermissions', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.user.groupsformpermissions',
    
    // For locatization
	title             : 'Responsibilities',
	expandAllBtnText  : 'Expand All',
	collapseAllBtnText: 'Collapse All',

	rootVisible: false,
	useArrows  : true,
	bodyPadding: 4,
	frame      : false,
	border     : false,
	displayField: 'module_name',
	
    initComponent: function() {
    	var that = this;

    	var bar = [
    		{ text: this.expandAllBtnText, handler: function() { that.expandAll(); } },
    		{ text: this.collapseAllBtnText, handler: function() { that.collapseAll(); } }
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
	    });
    }
});