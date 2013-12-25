Ext.define('NP.view.systemSetup.WorkflowRulesSummary', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.WorkflowRulesSummary',

    //title:  'Workflow Management',
    layout: 'fit',

    requires: [
        'NP.view.shared.ExpandableSection'
    ],

    initComponent: function() {
        var me = this;

// ПРОВЕРКА, ЕСЛИ ДАННЫХ НЕТ(ПРИ СОЗДАНИИ) ТО ДОЛЖНО ПОКАЗЫВАТЬСЯ :   No Rules Applied
/*
<div class="titlebar">Rule Summary</div>
<div class="rule_descript">
	<cfif get_wfrule_user.recordcount EQ 0>
		No Rules Applied
	<cfelse>
		<strong>Rule Name:</strong> #get_wfrule_user.wfrule_name#<br />
		<cfif request.wfrule_id neq -1 AND request.wfrule_status NEQ "new">
			<strong>Applied to #propertieslabel#:</strong> <cfif get_wfrule_properties.recordcount EQ get_properties.recordcount>ALL<cfelse>SPECIFIC</cfif><br />  
			<strong>Rule Type:</strong> #convertRuleTypeName(get_wfrule_user.wfruletype_name)#<br />
			<cfif get_wfrule_user.wfruletype_name does not contain "delegation">
				<strong>If Amount: </strong> 
				<cfif get_wfrule_user.wfrule_operand NEQ ''>#get_wfrule_user.wfrule_operand# 
					<cfif get_wfrule_user.wfrule_string EQ 'actual'>#request.udf.currencyFormat(get_wfrule_user.wfrule_number)#
					<cfelseif get_wfrule_user.wfrule_string EQ 'percentage'>#NumberFormat(get_wfrule_user.wfrule_number,'____')#%
					<cfelse>#get_wfrule_user.wfrule_string#</cfif>
				</cfif>
				<cfif get_wfrule_user.wfrule_operand eq "in range"> to #request.udf.currencyFormat(get_wfrule_user.wfrule_number_end)#</cfif>
				<br /> 
			</cfif>
			<strong>Originates From:</strong> #get_wfrule_originator.originator#
			<cfif len(get_wfrule_originator.originator) AND len(get_wfrule_originator.onames)>:</cfif> #get_wfrule_originator.onames#
		</cfif>
	</cfif>
</div>
 */
        /*this.layout = {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        };
        this.defaults = {
            border: 0
        };

        this.autoScroll = true;*/
        this.items = [
            {
                xtype: 'panel',
                html: 'Rule Summary',
                baseCls: 'header-highlight'
            },
            {
                xtype: 'panel',
                layout: 'vbox',
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
                    },
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
                    },
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
                    },
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
                ]
            }
        ]

        this.callParent(arguments);
    },

    sectionName: function(data) {
        return [
            {
                width: 200,
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
                width: 200,
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
                width: 200,
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
                width: 200,
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
                width: 200,
                cls: 'header-text',
                html: NP.Translator.translate('Originates From') + ':'
            },
            {
                html: originator
            }
        ];
    }
});