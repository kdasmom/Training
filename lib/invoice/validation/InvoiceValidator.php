<?php
namespace NP\invoice\validation;

use NP\core\validation\AbstractValidator;

/**
 * A class to validate invoice entities
 *
 * This class validates an NP\invoice\Invoice entity. See NP\core\validation\EntityValidator.
 * 
 * @author Thomas Messier
 */
class InvoiceValidator extends AbstractValidator {
	
	protected $rules = array(
		'invoice_id'     => array(),
		'property_id'    => array(
			'required'   => true,
			'displayName'=> 'Property ID',
			'validation' => array('int' => array())
		),
		'invoice_ref',
		'invoice_status' => array(
			'validation' => array(
				'inArray' => array(
					'haystack' => array('open','forapproval','saved','approved','rejected','sent','submitted','posted','paid','hold','draft','void')
				)
			),
		),
		'invoice_amount' => array(
			'validation'   => array('numeric' => array()),
		)
	);

	/**
	 * Validates an invoice data set
	 *
	 * @param  NP\invoice\Invoice $entity The entity to validate
	 * @return array                      An object containing the result of the validation
	 */
	public function validate($dataSet) {
		parent::validate($dataSet);

		if (array_key_exists('lines', $dataSet)) {
			$lineValidator = new InvoiceItemValidator();
			foreach ($dataSet['lines'] as $index=>$line) {
				if (!$lineValidator->validate($line)) {
					$lineErrors = $lineValidator->getErrors();
					foreach ($lineErrors as $error) {
						$this->addError($error['field'].$index, $error['msg']);
					}
				}
			}
		}
		return $this->isValid();
	}
}
?>