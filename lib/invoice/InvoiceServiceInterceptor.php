<?php

namespace NP\invoice;

use NP\security\AbstractServiceInterceptor;

/**
 * Security interceptor for the InvoiceService.
 *
 * @author Thomas Messier
 */
class InvoiceServiceInterceptor extends AbstractServiceInterceptor {
	
	public function secure($action, $params) {
		// Define the methods that require the same type of validation of the user IDs
		$actionsNeedingUserValidation = ['getInvoiceRegister','getInvoicesToApprove','getInvoicesOnHold','getInvoicesCompleted',
										'getInvoicesRejected','getInvoicesByUser'];

		// If dealing with one of the functions requiring user ID validation, run this
		if (in_array($action, $actionsNeedingUserValidation)) {
			// Check if the user ID and delegation ID passed in match the user IDs saved in the secure session
			if ($this->securityService->getUserId() != $params['userprofile_id'] 
					|| $this->securityService->getDelegatedUserId() != $params['delegated_to_userprofile_id']) {
				// If one of the IDs doesn't match, URL has been tampered with, call fails
				return false;
			}
		}
		
		return true;
	}

}

?>