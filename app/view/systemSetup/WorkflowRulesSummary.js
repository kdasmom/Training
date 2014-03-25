Ext.define('NP.view.systemSetup.WorkflowRulesSummary', {
	extend: 'Ext.panel.Panel',
	alias:  'widget.systemsetup.workflowrulessummary',

	initComponent: function() {
		this.border = false;

		console.log('this.data', this.data);

		if (!this.data) {
			this.ruleSummaryItems = [
				{
					xtype: 'panel',
					html: NP.Translator.translate('No Rules Applied')
				}
			];
		} else {
			this.ruleSummaryItems = this.getRuleSummaryItems();
		}

		this.items = [
			{
				xtype: 'fieldset',
				title: NP.Translator.translate('Rule Summary'),
				defaultType: 'textfield',
				padding: '8',
				items: this.ruleSummaryItems
			}
		];

		this.callParent(arguments);
	},


	getRuleSummaryItems: function() {
		console.log('sd.data', this.data);

		var items = [
			// Rule Name
			{
				xtype: 'panel',
				border: false,
				layout: {
					type: 'hbox',
					pack: 'start'
				},
				items: this.sectionName(this.data)
			}
		];

		if (this.data.rule.wfrule_id != -1 && this.data.rule.wfrule_status != 'new') {
			items.push(
				// Applied to Properties
				{
					xtype: 'panel',
					border: false,
					layout: {
						type: 'hbox',
						pack: 'start'
					},
					items: this.sectionProperties(this.data)
				},
				// Rule Type
				{
					xtype: 'panel',
					border: false,
					layout: {
						type: 'hbox',
						pack: 'start'
					},
					items: this.sectionType(this.data)
				}
			);

			// Amount
			if (this.data.rule.wfruletype_name.indexOf('delegation') == -1) {
				items.push(
					{
						xtype: 'panel',
						border: false,
						layout: {
							type: 'hbox',
							pack: 'start'
						},
						items: this.sectionAmount(this.data)
					}
				);
			}

			// Originates From
//			items.push(
//				{
//					xtype: 'panel',
//					border: false,
//					layout: {
//						type: 'hbox',
//						pack: 'start'
//					},
//					items: this.sectionOriginates(this.data)
//				}
//			);
		}

		return items;
	},

	sectionName: function(data) {
		return [
			{
				width: 150,
				cls: 'header-text',
				border: false,
				html: NP.Translator.translate('Rule Name') + ':'
			},
			{
				border: false,
				html: data.rule.wfrule_name
			}
		];
	},

	sectionProperties: function(data) {
		return [
			{
				width: 150,
				cls: 'header-text',
				border: false,
				html: NP.Translator.translate('Applied to Properties') + ':'
			},
			{
				border: false,
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
				border: false,
				cls: 'header-text',
				html: NP.Translator.translate('Rule Type') + ':'
			},
			{
				border: false,
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
				border: false,
				html: NP.Translator.translate('If Amount') + ':'
			},
			{
				border: false,
				html: condition
			}
		];
	},

	sectionOriginates: function(data) {
//		console.log('data', data);
		var originator = data.rule.originator;
		if (data.rule.originator && data.rule.originator.length && data.rule.onames.length) {
			originator += ': ' + data.rule.onames
		}

		return [
			{
				width: 150,
				border: false,
				cls: 'header-text',
				html: NP.Translator.translate('Originates From') + ':'
			},
			{
				border: false,
				html: originator
			}
		];
	}
});