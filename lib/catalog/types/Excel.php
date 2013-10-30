<?php

namespace NP\catalog\types;

/**
 * Excel catalog implementation
 *
 * @author Thomas Messier
 */
class Excel extends AbstractCatalog {

	public function getAssignmentFields() {
		return array('categories','vendors','properties');
	}

	public function beforeSave() {
		if ($this->vc->vc_id === null) {
			// If a new Excel catalog, change the status to -2 for "Processing"
			$this->vc->vc_status = '-2';
		}

		return array();
	}

	public function afterSave() {
		$errors = array();

		// Only try the upload if the catalog is new or if a new file was selected
		if ($this->data['vc']['vc_id'] === null || $_FILES['catalog_file']['name'] != '') {
			$destDir = "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/web/exim_uploads/catalog/";
			$fileName = "vc_{$this->vc->vc_id}.xls";

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
					'allowedTypes' => array(
						'application/excel',
						'application/vnd.ms-excel',
						'application/vnd.msexcel',
						'application/octet-stream'
					)
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