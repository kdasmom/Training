<?php

namespace NP\invoice\sql;

use NP\core\SqlSelect;

use Zend\Db\Sql\Expression;

/**
 * A custom Select object for InvoiceItem records with some shortcut methods
 *
 * @author Thomas Messier
 */
class InvoiceItemSelect extends SqlSelect {
	
	public function __construct() {
		parent::__construct();
		$this->from('invoiceitem');
	}
	
	/**
	 * Joins the GLACCOUNT table
	 *
	 * @param  string[] $cols               Columns to retrieve from the table
	 * @return NP\invoice\InvoiceItemSelect Returns caller object for easy chaining
	 */
	public function joinGL($cols=array()) {
		return $this->join(array('g' => 'glaccount'),
						$this->table.'.glaccount_id = g.glaccount_id',
						$cols);
	}
	
	/**
	 * Joins the PROPERTY table
	 *
	 * @param  string[] $cols               Columns to retrieve from the table
	 * @return NP\invoice\InvoiceItemSelect Returns caller object for easy chaining
	 */
	public function joinProperty($cols=array()) {
		return $this->join(array('p' => 'property'),
						$this->table.'.property_id = p.property_id',
						$cols);
	}
	
	/**
	 * Left joins the UTILITYACCOUNT table
	 *
	 * @param  string[] $cols               Columns to retrieve from the table
	 * @return NP\invoice\InvoiceItemSelect Returns caller object for easy chaining
	 */
	public function joinUtil($cols=array()) {
		return $this->join(array('ua' => 'UTILITYACCOUNT'),
							$this->table.".utilityaccount_id = ua.utilityaccount_id",
							array(),
							static::JOIN_LEFT);
	}
	
	/**
	 * Left joins all job costing related tables (JBJOBASSOCIATION, JBCONTRACT, JBCHANGEORDER, JBJOBCODE, JBPHASECODE, AND JBCOSTCODE)
	 *
	 * @param  string[] $contractCols       Columns to retrieve from the JBCONTRACT table
	 * @param  string[] $changeorderCols    Columns to retrieve from the JBCHANGEORDER table
	 * @param  string[] $jobcodeCols        Columns to retrieve from the JBJOBCODE table
	 * @param  string[] $phasecodeCols      Columns to retrieve from the JBPHASECODE table
	 * @param  string[] $costcodeCols       Columns to retrieve from the JBCOSTCODE table
	 * @return NP\invoice\InvoiceItemSelect Returns caller object for easy chaining
	 */
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
	
	/**
	 * Left joins the UNITTYPE_MATERIAL table
	 *
	 * @param  string[] $cols               Columns to retrieve from the table
	 * @return NP\invoice\InvoiceItemSelect Returns caller object for easy chaining
	 */
	public function joinUnitTypeMaterial($cols=array()) {
		return $this->join(array('uma' => 'unittype_material'),
							$this->table.".unittype_material_id = uma.unittype_material_id",
							$cols,
							static::JOIN_LEFT);
	}
	
	/**
	 * Left joins the UNITTYPE_MEAS table
	 *
	 * @param  string[] $cols               Columns to retrieve from the table
	 * @return NP\invoice\InvoiceItemSelect Returns caller object for easy chaining
	 */
	public function joinUnitTypeMeas($cols=array()) {
		return $this->join(array('ume' => 'unittype_meas'),
							$this->table.'.unittype_meas_id = ume.unittype_meas_id',
							$cols,
							static::JOIN_LEFT);
	}
	
}