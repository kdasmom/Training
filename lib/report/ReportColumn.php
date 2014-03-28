<?php

namespace NP\report;

/**
 * Base report class
 *
 * @author Thomas Messier
 */
class ReportColumn {
	
	/**
	 * This is the text that displays at the top of the column
	 * @var string
	 */
	public $name;

	/**
	 * This is the name of the data field (the database column) for the data in this column
	 * @var string
	 */
	public $field;
	
	/**
	 * The width of the column, should be displayed as a percentage in the form of a decimal (ie. 0.05 is 5%)
	 * @var float
	 */
	public $width;

	/**
	 * How text in the column should be aligned; valid values are "left", "right", and "center"; defaults to "left"
	 * @var string
	 */
	public $alignment;

	/**
	 * An optional renderer for the column, in case the value to display needs to be changed based on
	 * complex conditions. The function will receive 3 arguments: $val (field value), $row (array for
	 * the whole record), $col (ReportColumn object)
	 * @var callable
	 */
	public $renderer;
	
	/**
	 * An optional argument that will return a link for the column, making it so the column is wrapped in
	 * <a href=""></a> tags where href is set to whatever this function returns. The function will receive
	 * 3 arguments: $val (field value), $row (array for the whole record), $col (ReportColumn object)
	 * @var callable
	 */
	public $linker;
	
	public function __construct($name, $field, $width, $dataType='string', $alignment='left', $renderer=null, $linker=null) {
		$validAlignments = ['left','right','center'];
		if (!in_array($alignment, $validAlignments)) {
			throw new \NP\core\Exception("Invalid \$alignment argument '{$alignment}'; valid values are " . implode(',', $validAlignments));
		}

		$this->name      = $name;
		$this->field     = $field;
		$this->dataType  = $dataType;
		$this->width     = $width;
		$this->alignment = $alignment;
		$this->renderer  = $renderer;
		$this->linker    = $linker;
	}
}

?>