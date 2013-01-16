<?php

namespace NP\invoice;

use NP\core\SqlSelect;

use Zend\Db\Sql\Expression;

class InvoiceItemSelect extends SqlSelect {
	
	public function __construct() {
		parent::__construct();
		$this->from('invoiceitem');
	}
	
	public function joinGL($cols=array()) {
		return $this->join(array('g' => 'glaccount'),
						$this->table.'.glaccount_id = g.glaccount_id',
						$cols);
	}
	
	public function joinProperty($cols=array()) {
		return $this->join(array('p' => 'property'),
						$this->table.'.property_id = p.property_id',
						$cols);
	}
	
	public function joinUtil($cols=array()) {
		return $this->join(array('ua' => 'UTILITYACCOUNT'),
							$this->table.".utilityaccount_id = ua.utilityaccount_id",
							array());
	}
	
	public function joinJobcost($contractCols=array(), $changeorderCols=array(), $jobcodeCols=array(), $phasecodeCols=array(), $costcodeCols=array()) {
		return $this->join(array('jba' => 'JBJOBASSOCIATION'),
							new Expression($this->table.".invoiceitem_id = jba.tablekey_id AND jba.table_name = 'invoiceitem'"),
							array(),
							static::JOIN_LEFT)
					->join(array('jbct' => 'jbcontract'),
							"jba.jbcontract_id = jbct.jbcontract_id",
							$contractCols,
							static::JOIN_LEFT)
					->join(array('jbco' => 'jbchangeorder'),
							"jba.jbchangeorder_id = jbco.jbchangeorder_id",
							$changeorderCols,
							static::JOIN_LEFT)
					->join(array('jbj' => 'jbjobcode'),
							"jba.jbjobcode_id = jbj.jbjobcode_id",
							$jobcodeCols,
							static::JOIN_LEFT)
					->join(array('jbpc' => 'jbphasecode'),
							"jba.jbphasecode_id = jbpc.jbphasecode_id",
							$phasecodeCols,
							static::JOIN_LEFT)
					->join(array('jbcd' => 'jbcostcode'),
							"jba.jbcostcode_id = jbcd.jbcostcode_id",
							$costcodeCols,
							static::JOIN_LEFT);
	}
	
	public function joinUnitTypeMaterial($cols=array()) {
		return $this->join(array('uma' => 'unittype_material'),
							$this->table.".unittype_material_id = uma.unittype_material_id",
							$cols,
							static::JOIN_LEFT);
	}
	
	public function joinUnitTypeMeas($cols=array()) {
		return $this->join(array('ume' => 'unittype_meas'),
							$this->table.'.unittype_meas_id = ume.unittype_meas_id',
							$cols,
							static::JOIN_LEFT);
	}
	
}