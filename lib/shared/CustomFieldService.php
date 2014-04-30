<?php

namespace NP\shared;

use NP\core\AbstractService;

/**
 * Service class for operations related to Custom Fields
 *
 * @author Thomas Messier
 */
class CustomFieldService extends AbstractService {
	protected $securityService;

    public function setSecurityService(\NP\security\SecurityService $securityService) {
        $this->securityService = $securityService;
    }

	/**
	 * Saves custom field data for any item that has them
	 */
	public function saveCustomFieldData($customfield_pn_type, $customfielddata_table_id, $data) {
		$userprofile_id = $this->securityService->getUserId();

		$customFields = $this->pnCustomFieldsGateway->findCustomFieldData($customfield_pn_type, $customfielddata_table_id);
		foreach ($customFields as $field) {
			$formFieldName = $field['customfield_name'];

			// If the field doesn't have data, ignore it
			if (array_key_exists($formFieldName, $data)) {
				// Build the data array
				$fieldData = array(
					'customfielddata_id'           => $field['customfielddata_id'],
					'customfield_id'               => $field['customfield_id'],
					'customfielddata_table_id'     => $customfielddata_table_id,
					'customfielddata_value'        => $data[$formFieldName]
				);

				// Figure out which user field to update
				$userField = ($field['customfielddata_id'] === null) ? 'customfielddata_createdby' : 'customfielddata_lastupdateby';

				$fieldData[$userField] = $userprofile_id;

				// Save the custom field data
				$this->pnCustomFieldDataGateway->save($fieldData);
			}
		}
	}
}

?>