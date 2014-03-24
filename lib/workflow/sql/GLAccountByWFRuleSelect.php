<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GLAccountByWFRuleSelect extends Select {
    public function __construct($ruleid, $asp_client_id) {
        parent::__construct();

        $this
            ->columns([
                'glaccount_id',
                'glaccount_name',
                'glaccount_number'
            ])
            ->from('GLACCOUNT')
                ->join('INTEGRATIONPACKAGE', 'GLACCOUNT.integration_package_id = INTEGRATIONPACKAGE.integration_package_id', ['integration_package_name'], Select::JOIN_INNER)
        ;

        $select = new Select();
        $select
            ->columns([])
            ->from(['wr' => 'wfrule'])
                ->join(['w' => 'wfrulescope'], 'wr.wfrule_id = w.wfrule_id', ['tablekey_id'], Select::JOIN_INNER)
            ->where(Where::get()
                ->equals('wr.wfrule_id', $ruleid)
                ->equals('wr.asp_client_id', $asp_client_id)
            )
        ;

        $where = Where::get()
            ->in('GLACCOUNT.GLACCOUNT_ID', $select)
            ->equals('INTEGRATIONPACKAGE.asp_client_id', $asp_client_id)
        ;
        $this->where($where);
    }
}