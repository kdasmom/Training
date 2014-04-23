<?php
namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;

class WfRuleHourGateway extends AbstractGateway {
    protected $table = 'wfrulehour';

    public function copy($ruleid, $targetid) {
        $select = Select::get()
            ->columns([
                new \NP\core\db\Expression($ruleid),
                'runhour'
            ])
            ->from('wfrulehour')
            ->where(
                Where::get()
                    ->equals('wfrule_id', $targetid)
            )
        ;
        $insert = \NP\core\db\Insert::get()
            ->into('wfrulehour')
            ->columns([
                'wfrule_id',
		'runhour'
            ])
            ->values($select)
        ;
        $this->adapter->query($insert);
    }
}