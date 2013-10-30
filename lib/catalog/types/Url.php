<?php

namespace NP\catalog\types;

/**
 * Url catalog implementation
 *
 * @author Thomas Messier
 */
class Url extends AbstractCatalog {

	public function getAssignmentFields() {
		return array('categories');
	}

}