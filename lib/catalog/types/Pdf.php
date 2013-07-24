<?php

namespace NP\catalog\types;

/**
 * Pdf catalog implementation
 *
 * @author Thomas Messier
 */
class Pdf extends AbstractCatalog {

	protected function getAssignmentFields() {
		return array('categories');
	}

	public function afterSave() {
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
		$errors = array();
		if (!$fileUpload->upload()) {
			$fileErrors = $fileUpload->getErrors();
			foreach ($fileErrors as $error) {
				$errors[] = array('field'=>'catalog_file', 'msg'=>$this->localizationService->getMessage($error), 'extra'=>null);
			}
		}

		return $errors;
	}

}