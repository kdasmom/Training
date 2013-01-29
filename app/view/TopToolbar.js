Ext.define('NP.view.TopToolbar', function () {
	return {
        extend: 'Ext.panel.Panel',
        alias: 'widget.toptoolbar',
        
        requires: ['NP.core.Config','NP.core.Security'],

        border: false,
        style: 'background-color: #DFE8F6',
        bodyStyle: 'background-color: #DFE8F6',

        padding: '4 0 4 8',

        html: 'You are signed on as: ' + NP.core.Security.getUser().get('userprofile_username')
    }
});