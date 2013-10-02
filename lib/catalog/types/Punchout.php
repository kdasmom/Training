<?php

namespace NP\catalog\types;

/**
 * Punchout catalog implementation
 *
 * @author Thomas Messier
 */
class Punchout extends AbstractCatalog {

	public function getAssignmentFields() {
		return array('categories','vendors','properties');
	}

}