/**
 * My Settings: Email Notification : Alert tabs
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.EmailAlerts', {
    extend: 'Ext.view.View',
    alias: 'widget.mysettings.emailalerts',
    
    autoScroll: true,

    initComponent: function() {
        var that = this;

        var masterStore = Ext.getStore('notification.EmailAlertTypes');

        this.store = masterStore.getCopy();
        this.store.filterBy(function(rec, id) {
            return (rec.get('emailalerttype_function') === that.emailalerttype_function);
        });
        
        var selectOptions = [];
        for (var i=1; i<=15; i++) {
            selectOptions.push('<option value="'+i+'">'+i+'</option>');
        }
        selectOptions = selectOptions.join('');

        this.tpl = new Ext.XTemplate(
            '<table>',
            '<tpl for=".">',
                '<tr class="emailalertrow">',
                    '<td style="height:22px;padding-bottom:3px;">',
                        '<input type="checkbox" id="emailalerttype_id_alt_{emailalerttype_id_alt}" name="emailalerttype_id_alt" value="{emailalerttype_id_alt}" />',
                        ' <label for="emailalerttype_id_{emailalerttype_id}">{emailalerttype_name}</label>',
                        '<tpl if="emailalerttype_showdays == 1">',
                            ' for <select name="days_{emailalerttype_id}">'+selectOptions+'</select> or more days',
                        '</tpl>',
                    '</td>',
                '</tr>',
            '</tpl>',
            '</table>'
        );
        this.itemSelector = '.emailalertrow';
        
        this.callParent(arguments);
    }
});