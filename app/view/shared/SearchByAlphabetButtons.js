/**
 * Created by rnixx on 10/15/13.
 */

Ext.define('NP.view.shared.SearchByAlphabetButtons', {
    extend: 'Ext.container.Container',
    alias: 'widget.shared.searchbyalphabetbuttons',

    initComponent: function() {
        this. layout = 'hbox';
        this.padding = '5';
        this.defaults = {
            margin: '0 10 5 0',
            handler: this.onButton
        };
        this.items = [
            {
                xtype: 'button',
                text: '0-9',
                name: 'digitsStartBtn'
            },
            {
                xtype: 'button',
                text: 'A',
                name: 'startAbtn'
            },
            {
                xtype: 'button',
                text: 'B',
                name: 'startBbtn'
            },
            {
                xtype: 'button',
                text: 'C',
                name: 'startCbtn'
            },
            {
                xtype: 'button',
                text: 'D',
                name: 'startDbtn'
            },
            {
                xtype: 'button',
                text: 'E',
                name: 'startEbtn'
            },
            {
                xtype: 'button',
                text: 'F',
                name: 'startFbtn'
            },
            {
                xtype: 'button',
                text: 'G',
                name: 'startGbtn'
            },
            {
                xtype: 'button',
                text: 'H',
                name: 'startHbtn'
            },
            {
                xtype: 'button',
                text: 'I',
                name: 'startIbtn'
            },
            {
                xtype: 'button',
                text: 'J',
                name: 'startJbtn'
            },
            {
                xtype: 'button',
                text: 'K',
                name: 'startKbtn'
            },
            {
                xtype: 'button',
                text: 'L',
                name: 'startLbtn'
            },
            {
                xtype: 'button',
                text: 'M',
                name: 'startMbtn'
            },
            {
                xtype: 'button',
                text: 'N',
                name: 'startNbtn'
            },
            {
                xtype: 'button',
                text: 'O',
                name: 'startObtn'
            },
            {
                xtype: 'button',
                text: 'P',
                name: 'startPbtn'
            },
            {
                xtype: 'button',
                text: 'Q',
                name: 'startQbtn'
            },
            {
                xtype: 'button',
                text: 'R',
                name: 'startRbtn'
            },
            {
                xtype: 'button',
                text: 'S',
                name: 'startSbtn'
            },
            {
                xtype: 'button',
                text: 'T',
                name: 'startTbtn'
            },
            {
                xtype: 'button',
                text: 'U',
                name: 'startUbtn'
            },
            {
                xtype: 'button',
                text: 'V',
                name: 'startVbtn'
            },
            {
                xtype: 'button',
                text: 'W',
                name: 'startWbtn'
            },
            {
                xtype: 'button',
                text: 'X',
                name: 'startXbtn'
            },
            {
                xtype: 'button',
                text: 'Y',
                name: 'startYbtn'
            },
            {
                xtype: 'button',
                text: 'Z',
                name: 'startZbtn'
            }
        ];

        this.callParent(arguments);
    }
});