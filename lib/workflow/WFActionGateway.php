<?php
namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;

class WFActionGateway extends AbstractGateway {
    protected $table = 'wfaction';

    public function copy($ruleid, $targetid) {
        $select = Select::get()
            ->columns([
                new \NP\core\db\Expression($ruleid),
                'wfactiontype_id',
		'wfaction_originator_tablename',
		'wfaction_originator_tablekey_id',
		'wfaction_receipient_tablename',
		'wfaction_receipient_tablekey_id',
		'wfaction_nextlevel'
            ])
            ->from('wfaction')
            ->where(
                Where::get()
                    ->equals('wfrule_id', $targetid)
            )
        ;

        $insert = \NP\core\db\Insert::get()
            ->into($this->table)
            ->columns([
		'wfrule_id',
		'wfactiontype_id',
		'wfaction_originator_tablename',
		'wfaction_originator_tablekey_id',
		'wfaction_receipient_tablename',
		'wfaction_receipient_tablekey_id',
		'wfaction_nextlevel'
            ])
            ->values($select)
        ;
        $this->adapter->query($insert);
    }
}