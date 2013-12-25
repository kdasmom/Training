<?php
namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;

class WFRuleScopeGateway extends AbstractGateway {
    protected $table = 'wfrulescope';

    public function copy($ruleid, $targetid) {
        $select = Select::get()
            ->columns([
                new \NP\core\db\Expression($ruleid),
                'table_name',
                'tablekey_id'
            ])
            ->from('wfrulescope')
            ->where(
                Where::get()
                    ->equals('wfrule_id', $targetid)
            )
        ;
        $insert = \NP\core\db\Insert::get()
            ->into('wfrulescope')
            ->columns([
                'wfrule_id',
		'table_name',
                'tablekey_id'
            ])
            ->values($select)
        ;
        $this->adapter->query($insert);
    }
}