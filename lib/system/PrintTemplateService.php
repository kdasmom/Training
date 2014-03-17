<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 2/3/14
 * Time: 9:13 AM
 */

namespace NP\system;


use NP\core\AbstractService;
use NP\core\Exception;
use NP\util\Util;

class PrintTemplateService extends AbstractService {

	/**
	 * @var ConfigService
	 */
	protected $configService;

	/**
	 * @param ConfigService $configService set by Pimple di bootstrap
	 */
	public function setConfigService(ConfigService $configService)
	{
		$this->configService = $configService;
	}

	/**
	 * Retrieve all print templates
	 *
	 * @param int $page
	 * @param int $limit
	 * @param string $sort
	 * @return mixed
	 */
	public function getAll($page = 1, $limit = 25, $sort = 'Print_Template_Name') {
		return $this->printTemplateGateway->getTemplates($page, $limit, $sort);
	}

	/**
	 * Retrieve print template data
	 *
	 * @param null $id
	 * @return array
	 */
	public function get($id = null) {
		if (!$id) {
			return [];
		}

		$result = $this->printTemplateGateway->getTemplateData($id);

		return $result;
	}

	public function saveTemplates($data = []) {
		$printTemplate = new PrintTemplateEntity($data['printtemplate']);
		$errors = [];

		if ($data['templateobj']) {
			$templateobj = json_decode($data['templateobj']);

			if ($templateobj->template_attachment) {
				$templateobj->template_attachment = $this->getUploadPath();
			} else {
				unset($templateobj->template_attachment);
			}
			if ($templateobj->template_settings->print_template_additional_image) {
				$templateobj->template_settings->print_template_additional_image = $this->getUploadPath();
			} else {
				unset($templateobj->template_settings);
			}

			$printTemplate->Print_Template_Data = $data['templateobj'];
		}
		$printTemplate->Print_Template_Type = 'PO';
		$printTemplate->Print_Template_LastUpdateBy = $data['userprofile_id'];
		$printTemplate->Print_Template_LastUpdateDt = \NP\util\Util::formatDateForDB();
		$printTemplate->isActive = !$printTemplate->isActive ? 0 : 1;

		$this->printTemplateGateway->beginTransaction();
		try {
			$template_id = $this->printTemplateGateway->save($printTemplate);
			$this->printTemplateGateway->commit();

			$template_id = !$printTemplate->Print_Template_Id ? $template_id : $printTemplate->Print_Template_Id;

			if (!$this->printTemplateGateway->deletePrintTemplateProperties($template_id)) {
				throw new \NP\core\Exception('Cannot delete template properties.');
			}
			if ($data['property_type'] == 1) {
				$this->printTemplateGateway->savePrintTemplateProperties(-1, $template_id, $data['userprofile_id']);
			} else {
				foreach ($data['properties'] as $property_id) {
					$this->printTemplateGateway->savePrintTemplateProperties($property_id, $template_id, $data['userprofile_id']);
				}
			}

			if (isset($templateobj->template_header_text)) {
				if (!$this->clientGateway->update(['poprint_header' => !$templateobj->template_header_text ? null : "$templateobj->template_header_text"], ['asp_client_id' => '?'], [$this->configService->getClientId()])) {
					throw new \NP\core\Exception('Cannot save client header.');
				}
			}
			if (isset($templateobj->template_footer_text)) {
				if (!$this->clientGateway->update(['poprint_footer' => !$templateobj->template_footer_text ? null : "$templateobj->template_footer_text"], ['asp_client_id' => '?'], [$this->configService->getClientId()])) {
					throw new \NP\core\Exception('Cannot save client footer.');
				}
			}
			if (isset($templateobj->template_additional_text)) {
				if (!$this->clientGateway->update(['poprint_additional_text' => !$templateobj->template_additional_text ? null : "$templateobj->template_additional_text"], ['asp_client_id' => '?'], [$this->configService->getClientId()])) {
					throw new \NP\core\Exception('Cannot save client additional text.');
				}
			}
			if (!$this->configsysGateway->saveConfigValue('PN.POOptions.POPrintCustomFields', $data['poprint_customfields'], $data['userprofile_id'])) {
				throw new \NP\core\Exception('Cannot save settings for poprint customfields.');
			}

		} catch(\Exception $e) {
			$this->printTemplateGateway->rollback();
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		return [
			'success'			=> (count($errors)) ? false : true,
			'errors'			=> $errors
		];
	}

	public function getAssignedProperties($id = null) {
		if (!$id) {
			return [];
		}
		return $this->printTemplateGateway->getAssignedProperties($id);
	}

	public function deleteTemplate($id) {
		if (!$id) {
			return false;
		}
		if (!$this->printTemplateGateway->deletePrintTemplateProperties($id)) {
			throw new \NP\core\Exception('Cannot delete template properties.');
		}
		return $this->printTemplateGateway->delete(['Print_Template_Id' => '?'], [$id]);
	}

	public function saveAttachmentPdf($userprofile_id = null, $id = null) {
		if (!$userprofile_id || !$id) {
			return false;
		};

		$destPath = $this->getUploadPath();

		if (!is_dir($destPath)) {
			mkdir($destPath, 0777, true);
		}
		$fileUpload = new \NP\core\io\FileUpload(
			'pdf_file',
			$destPath,
			array(
				'fileName'=>"poprint_additional_$id.pdf",
				'allowedTypes'=>array('application/pdf')
			)
		);

		$fileUpload->upload();
		$errors = $fileUpload->getErrors();

		if (count($errors) == 0) {
			$template = $this->printTemplateGateway->findById($id);
			$templateData = json_decode($template['Print_Template_Data']);

			$templateData->template_attachment = $destPath;

			$template['Print_Template_Data'] = json_encode($templateData);
			$template['Print_Template_LastUpdateBy'] = $userprofile_id;
			$template['Print_Template_LastUpdateDt'] = Util::formatDateForDB();

			$printTemplate = new PrintTemplateEntity($template);
			if (!$this->printTemplateGateway->save($printTemplate)) {
				throw new \NP\core\Exception('Cannot save print template.');
			}

		}

		return array(
			'success'			=> (count($errors)) ? false : true,
			'errors'			=> $errors,
			'path'				=> $destPath
		);
	}

	public function saveAttachmentImage($userprofile_id = null, $id = null) {
		if (!$userprofile_id || !$id) {
			return false;
		};

		$destPath = $this->getUploadPath();

		if (!is_dir($destPath)) {
			mkdir($destPath, 0777, true);
		}
		$fileUpload = new \NP\core\io\FileUpload(
			'jpeg_file',
			$destPath,
			array(
				'fileName'=>"poprint_additional_image_$id.jpg",
				'allowedTypes'=>array('image/jpeg')
			)
		);

		$fileUpload->upload();
		$errors = $fileUpload->getErrors();

		if (count($errors) == 0) {
			$template = $this->printTemplateGateway->findById($id);
			$templateData = json_decode($template['Print_Template_Data']);

			if (isset($templateData->template_settings)) {
				$templateData->template_settings->print_template_additional_image = $destPath;
			} else {
				$templateData->template_settings['print_template_additional_image']= $destPath;
			}

			$template['Print_Template_Data'] = json_encode($templateData);
			$template['Print_Template_LastUpdateBy'] = $userprofile_id;
			$template['Print_Template_LastUpdateDt'] = Util::formatDateForDB();

			$printTemplate = new PrintTemplateEntity($template);

			if (!$this->printTemplateGateway->save($printTemplate)) {
				throw new \NP\core\Exception('Cannot save print template.');
			}

		}

		return array(
			'success'			=> (count($errors)) ? false : true,
			'errors'			=> $errors
		);
	}

	protected function getUploadPath() {
			return "{$this->configService->getAppRoot()}/clients/{$this->configService->getAppName()}/web/images/print_pdf/";
	}

	public function deleteAttachments($id = false, $image = false) {
		if (!$id) {
			return false;
		}

		$template = $this->printTemplateGateway->findById($id);
		$templateData = json_decode($template['Print_Template_Data']);

		if (!$image) {
			unset($templateData->template_attachment);
		} else {
			unset($templateData->template_settings);
		}

		$template['Print_Template_Data'] = json_encode($templateData);

		$printTemplateEntity = new PrintTemplateEntity($template);
		if (!$this->printTemplateGateway->save($printTemplateEntity)) {
			throw new \NP\core\Exception('Cannot delete template attachment.');
		}
		if ($image) {
			$filename = "poprint_additional_image_$id.jpg";
		} else {
			$filename = "poprint_additional_$id.pdf";
		}
		if (file_exists($this->getUploadPath() . $filename)) {
			unlink($this->getUploadPath() . $filename);
		}

		return true;
	}
} 