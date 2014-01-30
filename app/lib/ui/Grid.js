/**
 * The Grid class extends Ext's standard grid panel to provide some additional utility config options specific to NP.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.Grid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.customgrid',

	requires: [
		'Ext.toolbar.Spacer',
		'NP.view.shared.button.Print'
	],
	
	/**
	 * @cfg {Boolean} paging               Whether or not paging will be used for this grid
	 */
	paging: false,
	 /**
	 * @cfg {Array}   pagingToolbarButtons Buttons to add to the paging toolbar (only applies if paging is true)
	 */
	/**
	 * @cfg {Array}   pageSizeOptions      Possible page size values
	 */
	pageSizeOptions     : [25, 50, 100, 200, 500, 1000],
	/**
	 * @cfg {Object}  extraParams If using a grid with a remote store, these are extra parameters you want sent with the ajax request
	 */
	extraParams: {},

	initComponent: function() {
		var that = this;

		if (this.paging === true) {
			this.pageSizeCombo = Ext.create('Ext.form.field.ComboBox',{
				typeAhead     : false,
				triggerAction : 'all',
				forceSelection: true,
				lazyRender    : true,
				editable      : false,
				mode          : 'remote',
				value         : this.store.pageSize,
				width         : 50,
				store         : this.pageSizeOptions,
				listeners     : {
					select: function(combo, value, i){
						that.store.pageSize = value[0].data.field1;
						that.store.loadPage(1);
						that.fireEvent('pagesizechange', combo, value);
					}
				}
			});

			if (this.pagingToolbarButtons) {
				this.pagingToolbarButtons.unshift({ xtype: 'tbspacer', width: 8 }, '-');
			} else {
				this.pagingToolbarButtons = [];
			}
			this.pagingToolbarButtons.unshift(
				'-', {
					xtype  : 'shared.button.print',
					text   : null,
					handler: function() {
						Ext.ux.grid.Printer.stylesheetPath = 'vendor/extjs/ux/grid/gridPrinterCss/print.css';
						Ext.ux.grid.Printer.print(that);
					}
				},
				'-', 
				'Records per page:', this.pageSizeCombo
			);

			var pagingToolbar = Ext.create('Ext.toolbar.Paging', {
				dock       : 'top',
				store      : this.store,
				displayInfo: true,
				items      : this.pagingToolbarButtons
			});

			this.dockedItems = [pagingToolbar];
		}

		this.callParent(arguments);

		this.addEvents('pagesizechange');
		this.addStateEvents('pagesizechange');

		var proxy = this.getStore().getProxy();
		Ext.apply(proxy.extraParams, this.extraParams);
	},

	/**
	 * Adds extra parameters to the grid's store proxy
	 * @param {Object} extraParams
	 */
	addExtraParams: function(extraParams) {
		var proxy = this.getStore().getProxy();
		Ext.apply(proxy.extraParams, extraParams);
	},

	/**
	 * Reloads the grid with whatever parameters are set on it, moving it back to the first page
	 */
	reloadFirstPage: function() {
		this.getStore().removeAll();
		this.getDockedItems('pagingtoolbar')[0].moveFirst();
	},

	/**
	 * Override getState to make sure the state include the page size
	 */
	getState: function() {
		var state = this.callParent();

		state['pageSize'] = this.store.pageSize;

		return state;
	},

	/**
	 * Override applyState to make sure the page size gets properly set
	 */
	applyState: function(state) {
		this.callParent(arguments);

		if (this.pageSizeCombo) {
			if (!state.pageSize) {
				state.pageSize = this.pageSizeOptions[0];
			}
			this.pageSizeCombo.setValue(state.pageSize);
			this.store.pageSize = state.pageSize;
		}
	}
});