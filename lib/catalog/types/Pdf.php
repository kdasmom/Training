<?php

namespace NP\catalog\types;

/**
 * Pdf catalog implementation
 *
 * @author Thomas Messier
 */
class Pdf extends AbstractCatalog {

	public function getAssignmentFields() {
		return array('categories');
	}

	public function afterSave() {
		$errors = array();

		// Only try the upload if the catalog is new or if a new file was selected
		if ($this->data['vc']['vc_id'] === null || $_FILES['catalog_file']['name'] != '') {
			$destDir = "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/web/exim_uploads/catalog/";
			$fileName = "vc_{$this->vc->vc_id}.pdf";

			// If destination directory doesn't exist, create it
			if (!is_dir($destDir)) {
				mkdir($destDir, 0777, true);
			}

			// File upload only required if no file currently exists
			$required = (file_exists($destDir . $fileName)) ? false : true;

			// Create the upload object
			$fileUpload = new \NP\core\io\FileUpload(
				'catalog_file', 
				$destDir, 
				array(
					'required'     => $required,
					'fileName'     => $fileName,
					'allowedTypes' => array('application/pdf')
				)
			);

			// Do the file upload
			if (!$fileUpload->upload()) {
				$fileErrors = $fileUpload->getErrors();
				foreach ($fileErrors as $error) {
					$this->validator->addError($errors, 'catalog_file', $error);
				}
			}
		}

		return $errors;
	}

}