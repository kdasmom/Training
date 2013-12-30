Ext.define('NP.view.systemSetup.WorkflowRulesSummary', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.WorkflowRulesSummary',

    initComponent: function() {
        this.border = 0;

        this.items = [
            {
                xtype: 'panel',
                html: 'Rule Summary',
                baseCls: 'header-highlight'
            }
        ];

        if (!this.data) {
            this.items.push({
                xtype: 'panel',
                html: 'No Rules Applied'
            });
        } else {
            this.items.push(this.markup());
        }

        this.callParent(arguments);
    },

    markup: function() {
        var markup =
            {
                xtype: 'panel',
                layout: 'vbox',
                border: 1,
                bodyPadding: 10,

                defaults: {
                    border: 0
                },

                items: [
                    // Rule Name
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                            pack: 'start'
                        },
                        defaults: {
                            border: 0
                        },
                        items: this.sectionName(this.data)
                    }
                ]
            }
        ;

        if (this.data.rule.wfrule_id != -1 && this.data.rule.wfrule_status != 'new') {
            markup.items.push(
                // Applied to Properties
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        pack: 'start'
                    },
                    defaults: {
                        border: 0
                    },
                    items: this.sectionProperties(this.data)
                },
                // Rule Type
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        pack: 'start'
                    },
                    defaults: {
                        border: 0
                    },
                    items: this.sectionType(this.data)
                }
            );

            if (this.data.rule.wfruletype_name.indexOf('delegation') == -1) {
                markup.items.push(
                    // Amount
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                            pack: 'start'
                        },
                        defaults: {
                            border: 0
                        },
                        items: this.sectionAmount(this.data)
                    }
                );
            }

            markup.items.push(
                // Originates From
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        pack: 'start'
                    },
                    defaults: {
                        border: 0
                    },
                    items: this.sectionOriginates(this.data)
                }
            );
        }

        return markup;
    },

    sectionName: function(data) {
        return [
            {
                width: 150,
                cls: 'header-text',
                html: NP.Translator.translate('Rule Name') + ':'
            },
            {
                html: data.rule.wfrule_name
            }
        ];
    },

    sectionProperties: function(data) {
        return [
            {
                width: 150,
                cls: 'header-text',
                html: NP.Translator.translate('Applied to Properties') + ':'
            },
            {
                html:
                    data.properties.all ?
                        NP.Translator.translate('ALL') :
                        NP.Translator.translate('SPECIFIC')
            }
        ];
    },

    sectionType: function(data) {
        return [
            {
                width: 150,
                cls: 'header-text',
                html: NP.Translator.translate('Rule Type') + ':'
            },
            {
                html: data.rule.wfruletype_name
            }
        ];
    },

    sectionAmount: function(data) {
        var condition = '';
        if (data.rule.wfrule_operand && data.rule.wfrule_operand != '') {
            condition += data.rule.wfrule_operand + ' ';
            if (data.rule.wfrule_string == 'actual') {
                condition += data.rule.wfrule_number;
            } else if (data.rule.wfrule_string == 'percentage') {
                condition += data.rule.wfrule_number + '%';
            } else {
                condition += data.rule.wfrule_string;
            }
        }
        if (data.rule.wfrule_operand && data.rule.wfrule_operand == 'in range') {
            condition += ' to ' + data.rule.wfrule_number_end;
        }

        return [
            {
                width: 150,
                cls: 'header-text',
                html: NP.Translator.translate('If Amount') + ':'
            },
            {
                html: condition
            }
        ];
    },

    sectionOriginates: function(data) {
        var originator = data.rule.originator;
        if (data.rule.originator && data.rule.originator.length && data.rule.onames.length) {
            originator += ': ' + data.rule.onames
        }

        return [
            {
                width: 150,
                cls: 'header-text',
                html: NP.Translator.translate('Originates From') + ':'
            },
            {
                html: originator
            }
        ];
    }
});