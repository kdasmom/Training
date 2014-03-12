<?php

namespace NP\report;

/**
 * Base report class
 *
 * @author Thomas Messier
 */
class ReportColumn {
	
	public $name, $field, $width, $alignment, $renderer, $link;
	
	public function __construct($name, $field, $width=75, $dataType='string', $alignment='left', $renderer=null, $linker=null) {
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