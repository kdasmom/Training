<?php

namespace NP\catalog\types;

/**
 * Url catalog implementation
 *
 * @author Thomas Messier
 */
class Url extends AbstractCatalog {

	protected function getAssignmentFields() {
		return array('categories');
	}

}