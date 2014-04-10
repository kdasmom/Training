/**
 * A custom container for pick lists
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PickList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shared.picklist',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Util',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Activate',
        'NP.view.shared.button.Inactivate',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.SaveAndAdd',
        'NP.view.shared.button.Cancel'
    ],

    /**
     * Counter for instances of the component, needed because of the radio buttons, do not override this
     * @private
     */
    statics: {
        pickListInstanceId: 0
    },

    /**
     * The layout, do not override this
     * @private
     */
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    /**
     * @cfg {String} entityType (required) The name of the entity this picklist will control
     */
    entityType: null,

    border: false,

    initComponent: function() {
        var that = this;

        // Increment the instance counter and store instance ID for this picklist
        NP.view.shared.PickList.pickListInstanceId++;
        this.pickListInstanceId = NP.view.shared.PickList.pickListInstanceId;

        // Setup the button bar
        var bar = [
            {
                xtype  : 'shared.button.new',
                handler: Ext.bind(that.newHandler, this)
            },{
                xtype   : 'shared.button.activate',
                disabled: true,
                handler : Ext.bind(that.activateHandler, this)
            },{
                xtype   : 'shared.button.inactivate',
                disabled: true,
                handler : Ext.bind(that.inactivateHandler, this)
            }
        ];
        this.tbar = bar;
        this.bbar = bar;

        // Add a status column to the grid so we don't have to do it each time
        var statusCol = Ext.create('Ext.grid.column.Column', {
            text: 'Status',
            dataIndex: 'universal_field_status',
            renderer: function(val) {
                if (val == 1) {
                    return 'Active';
                } else if (val == 2) {
                    return 'Default';
                } else if (val == 0) {
                    return 'Inactive';
                }
            }
        });
        this.grid.headerCt.insert(statusCol);
        
        // Add the status field to the form so we don't have to do it each time
        this.form.add({
            xtype: 'radiogroup',
            fieldLabel: 'Status',
            defaults: { name: 'universal_field_status' + this.pickListInstanceId },
            items: [
                { boxLabel: 'Active', inputValue: 1, checked: true },
                { boxLabel: 'Inactive', inputValue: 0 },
                { boxLabel: 'Default', inputValue: 2 }
            ]
        });

        // Add the toolbar with a save and cancel button so we don't have to do it each time
        this.form.addDocked({
            xtype : 'toolbar',
            dock  : 'top',
            items : [
                {
                    xtype: 'shared.button.save',
                    handler: Ext.bind(that.saveHandler, this, [false])
                },{
                    xtype: 'shared.button.saveandadd',
                    handler: Ext.bind(that.saveHandler, this, [true])
                },{
                    xtype: 'shared.button.cancel',
                    handler: function() {
                        that.form.hide();
                    }
                }
            ]
        });

        // Store the title set on the grid in another variable since we're going to update the title
        // depending on if we're adding or editing
        this.formPanelTitle = this.form.title;

        // Make sure the form is hidden
        this.form.hide();

        // Setup the default store service and action if none have been setup
        if (Ext.ClassManager.getName(this.grid.getStore().getProxy()) != 'Ext.data.proxy.Ajax' && !this.grid.getStore().getCount()) {
            this.grid.getStore().setServiceAndAction('PicklistService', 'getList');
            this.grid.getStore().addExtraParams({ entityType: this.entityType });
            this.grid.getStore().load();
        }

        // Add the grid and form to the container
        this.items = [this.grid, this.form];

        this.callParent();

        // Set some variables for easy references
        this.grid = this.items.getAt(0);
        this.form = this.items.getAt(1);
        this.modelClass = this.form.getModels()[0].classPath;

        // Add some event handlers to the grid
        this.grid.on('selectionchange', Ext.bind(that.changeSelectionHandler, this));
        this.grid.on('itemclick', function(grid, rec, item, index, e) {
            if (e.getTarget().className != 'x-grid-row-checker') {
                that.selectItemHandler(grid, rec, index);
            }
        });
    },

    changeSelectionHandler: function(grid, recs) {
        var activateBtn = this.query('[xtype="shared.button.activate"]')[0];
        var inactivateBtn = this.query('[xtype="shared.button.inactivate"]')[0];
        if (recs.length) {
            activateBtn.enable();
            inactivateBtn.enable();
        } else {
            activateBtn.disable();
            inactivateBtn.disable();
        }
    },

    selectItemHandler: function(grid, rec, index) {
        this.updateForm(rec);
    },

    newHandler: function() {
        this.updateForm(Ext.create('NP.model.' + this.modelClass));
    },

    updateForm: function(rec) {
        Ext.suspendLayouts();

        var title = this.formPanelTitle;

        var idProperty = NP.Util.getIdProperty(this.modelClass);
        var saveAndAddBtn = this.query('[xtype="shared.button.saveandadd"]')[0];
        if (rec.get(idProperty) === null) {
            title = 'New ' + title;
            saveAndAddBtn.setText('Save and Create New');
        } else {
            title = 'Edit ' + title;
            saveAndAddBtn.setText('Save and Edit Next');
        }

        this.form.setTitle(title);

        this.form.setModel(this.modelClass, rec);
        this.updateBoundFields();

        this.form.show();
        Ext.defer(this.focusFirstField, 500, this);

        Ext.resumeLayouts(true);  
    },

    focusFirstField: function() {
        this.form.getForm().getFields().getAt(0).focus();
    },

    saveHandler: function(addAnother, callback) {
        var that = this;

        callback = callback || Ext.emptyFn;

        // Manually update universal_field_status in record because form field uses different name
        var rec = this.form.getModel(this.modelClass);
        rec.set('universal_field_status', this.form.findField('universal_field_status' + this.pickListInstanceId).getGroupValue());

        if (this.form.isValid()) {
            return this.form.submitWithBindings({
                service: 'PicklistService',
                action : 'save',
                extraParams: {
                    entityType: this.entityType
                },
                success: function(result) {
                    var idProperty = NP.Util.getIdProperty(that.modelClass);
                    if (rec.get(idProperty) === null) {
                        that.grid.getStore().add(rec);
                    }
                    rec.set(idProperty, result['id']);

                    // If we updated the record to be the default, need to undefault any record that's default
                    if (rec.get('universal_field_status') == 2) {
                        that.grid.getStore().query('universal_field_status', 2).each(function(gridRec) {
                            if (gridRec.get(idProperty) != rec.get(idProperty)) {
                                gridRec.set('universal_field_status', 1);
                            }
                        });
                    }
                    that.grid.getStore().commitChanges();
                    if (addAnother) {
                        var idx = that.grid.getStore().find(idProperty, rec.get(idProperty));
                        idx++;
                        if (idx == that.grid.getStore().getCount()) {
                            idx = 0;
                        }
                        that.selectItemHandler(that.grid, that.grid.getStore().getAt(idx), idx);
                    }

                    if (!addAnother) {
                        that.form.hide();
                    }

                    // Show info message
                    NP.Util.showFadingWindow({ html: 'Change saved' });
                    callback(rec);
                },
                failure: function(result) {
                    that.grid.getStore().rejectChanges();
                }
            });
        }
    },

    activateHandler: function() {
        this.changeStatus(1);
    },

    inactivateHandler: function() {
        this.changeStatus(0);        
    },

    changeStatus: function(universal_field_status) {
        var that = this;

        var idProperty = NP.Util.getIdProperty(this.modelClass);
        var selected = this.grid.getSelectionModel().getSelection();
        var itemIds = [];
        Ext.Array.each(selected, function(rec) {
            rec.set('universal_field_status', universal_field_status);
            itemIds.push(rec.get(idProperty));
        });
        
        that.form.hide();

        NP.lib.core.Net.remoteCall({
            mask    : this,
            method  : 'POST',
            requests: {
                service               : 'PicklistService',
                action                : 'changeStatus',
                entityType            : that.entityType,
                itemIds               : itemIds,
                universal_field_status: universal_field_status,
                success               : function(result) {
                    if (result.success) {
                        that.grid.getSelectionModel().deselectAll();
                        that.grid.getStore().commitChanges();
                        NP.Util.showFadingWindow({ html: 'Change saved' });
                    } else {
                        that.grid.getStore().rejectChanges();
                        Ext.MessageBox.alert('Error', 'Error activating items.');
                    }
                }
            }
        });
    },

    updateBoundFields: function() {
        this.form.updateBoundFields();

        var rec = this.form.getModel(this.modelClass);

        // Load the universal field status manually since we had to name the field per instance
        this.form.findField('universal_field_status' + this.pickListInstanceId).setValue(rec.get('universal_field_status'));
    }
});