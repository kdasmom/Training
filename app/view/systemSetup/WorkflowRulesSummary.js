Ext.define('NP.view.systemSetup.WorkflowRulesSummary', {
	extend: 'Ext.panel.Panel',
	alias:  'widget.systemsetup.workflowrulessummary',

	requires: ['Ext.form.FieldSet'],

	initComponent: function() {
		this.border = false;

		this.fieldLabelWidth = 150;
		this.fieldPadding    = '0 0';

		this.items = [
			{
				xtype: 'fieldset',
				title: NP.Translator.translate('Rule Summary'),
				defaultType: 'textfield',
				padding: '8',
				items: this.getRuleSummaryItems()
			}
		];

		this.callParent(arguments);
	},


	getRuleSummaryItems: function() {
		var items = [];

		if (!this.data) {
			return [
				{
					xtype: 'component',
					border: false,
					html: NP.Translator.translate('No Rules Applied')
				}
			];
		}

		items.push(
			{
				xtype     : 'displayfield',
				fieldLabel: NP.Translator.translate('Rule Name'),
				value     : this.data.rule.wfrule_name,
				labelWidth: this.fieldLabelWidth,
				padding   : this.fieldPadding
			}
		);

		if (this.data.rule.wfrule_id != -1 && this.data.rule.wfrule_status != 'new') {
			items.push(
				{
					xtype     : 'displayfield',
					fieldLabel: NP.Translator.translate('Applied to Properties'),
					value     : this.data.rule.allProperties ? NP.Translator.translate('ALL') : NP.Translator.translate('SPECIFIC'),
					labelWidth: this.fieldLabelWidth,
					padding   : this.fieldPadding
				},
				{
					xtype     : 'displayfield',
					fieldLabel: NP.Translator.translate('Rule Type'),
					value     : this.data.rule.wfruletype_name,
					labelWidth: this.fieldLabelWidth,
					padding   : this.fieldPadding
				}
			);

			var condition = this.getRuleCondition(this.data);
			if (condition) {
				items.push(
					{
						xtype     : 'displayfield',
						fieldLabel: NP.Translator.translate('If Amount'),
						value     : condition,
						labelWidth: this.fieldLabelWidth,
						padding   : this.fieldPadding
					}
				);
			}

//			items.push(
//				{
//					xtype: 'displayfield',
//					fieldLabel: NP.Translator.translate('Originates From'),
//					value: this.getRuleOriginates(this.data),
//					labelWidth: this.fieldLabelWidth,
//					padding: this.fieldPadding
//				}
//			);
		}

		return items;
	},

	getRuleCondition: function(data) {
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

		return condition;
	},

	getRuleOriginates: function(data) {
		var originator = data.rule.originator;

		if (data.rule.originator && data.rule.originator.length && data.rule.onames.length) {
			originator += ': ' + data.rule.onames
		}

		return originator;
	}
});