<?php

namespace NP\import;

use NP\core\validation\EntityValidator;

abstract class AbstractImportEntityValidator extends EntityValidator {

    /**
     * Allows to run validation on a collection of entities; this can be useful if some rules depend on
     * multiple related rows of data
     *
     * @param  array $data
     * @return array An array of errors
     */
    public function validateCollection(&$data) {}

}