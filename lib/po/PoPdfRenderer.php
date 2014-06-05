<?php

namespace NP\po;

use NP\shared\EntityRendererInterface;
use NP\system\ConfigService;
use NP\core\GatewayManager;
use NP\core\AbstractService;

/**
 * PDF renderer for invoices
 *
 * @author Thomas Messier
 */

require_once(__DIR__ . '/../../vendor/phpwkhtmltopdf/WkHtmlToPdf.php');

class PoPdfRenderer extends PoHtmlRenderer implements EntityRendererInterface {
	protected $template      = null;
	protected $templateLabel = '';

	protected $options = [
		'notes'        => false,
		'overageNotes' => false,
		'holdReason'   => false,
		'payments'     => false,
		'history'      => false,
		'forward'      => false,
		'headerCustom' => false,
		'lineCustom'   => false,
		'lineNumbers'  => false,
		'combineSplit' => false,
		'lineItemNum'  => true,
		'lineItemUom'  => true,
		'glCode'       => true,
		'job'          => true,
		'unit'         => true,
		'created'      => false,
		'allImages'    => false,
		'mainImage'    => false
	];

	public function __construct(ConfigService $configService, GatewayManager $gatewayManager, AbstractService $service, $entity_id=null, $options=[]) {
		parent::__construct($configService, $gatewayManager, $service, $entity_id, $options);

		$this->initTemplate();
	}

	public function initTemplate() {
		$templateId = $this->entity['print_template_id'];

		if (!empty($templateId)) {
			$this->template = $this->gatewayManager->get('PrintTemplateGateway')->findSingle(
				'Print_Template_Id = ?',
				[$templateId],
				['print_template_label','Print_Template_Data']
			);

			if (!empty($this->template)) {
				$this->templateLabel = $this->template['print_template_label'];
				$this->template = (array)json_decode($this->template['Print_Template_Data']);

				$defaultSettings = [
					'po_lineitems_display_opts_itemnum'      => 'lineItemNum',
					'po_lineitems_display_opts_uom'          => 'lineItemUom',
					'po_lineitems_display_opts_glcode'       => 'glCode',
					'po_lineitems_display_opts_buildingcode' => 'unit',
					'po_lineitems_display_opts_jobcost'      => 'job',
					'po_lineitems_display_opts_customfields' => 'lineCustom',
					'po_include_attachments'                 => 'allImages'
				];

				if (array_key_exists('TEMPLATE_SETTINGS', $this->template)) {
					$settings = (array)$this->template['TEMPLATE_SETTINGS'];
				} else {
					$settings = [];
				}
				
				foreach ($defaultSettings as $setting=>$option) {
					$this->options[$option] = (array_key_exists($setting, $settings) && $settings[$setting] == 'on');
				}
			}
		}

		// This is the default template in case no template is specified or the template set isn't found
		if (empty($this->template)) {
			$this->template = $this->getDefaultTemplate();
		}
	}

	public function getDefaultTemplate() {
		$poprint = $this->gatewayManager->get('ClientGateway')->findSingle(null, [], ['poprint_header','poprint_footer','poprint_additional_text']);

		$this->options['lineItemNum'] = true;
		$this->options['lineItemUom'] = true;

		$template = [
			'template_logo_left'    => [],
			'template_logo_center'  => ['po_items_logo'],
			'template_logo_right'   => [],
			'template_header_left'  => [],
			'template_header_right' => [
				'po_items_date',
				'po_items_number'
			],
			'template_header'       => ['po_items_vendor','po_items_billto','po_items_shipto'],
			'TEMPLATE_HEADER_TEXT'  => $poprint['poprint_header'],
			'template_body'         => [],
			'TEMPLATE_ADDITIONAL_TEXT' => $poprint['poprint_additional_text'],
			'template_footer'       => ['po_items_additionaltext'],
			'template_footer_left'  => ['po_items_pofootertext'],
			'template_footer_right' => ['po_items_pagenumber'],
			'TEMPLATE_FOOTER_TEXT'  => $poprint['poprint_footer']
		];

		if ($this->options['created']) {
			$template['template_header_left'][] = 'po_items_createdby';
		}
		$template['template_header_left'][] = 'po_items_status';

		if ($this->options['headerCustom']) {
			$template['template_body'][] = 'po_items_headercustomfields';
		}
		array_push($template['template_body'], 'po_items_poheadertext', 'po_items_lineitemdetails');
		
		if ($this->options['notes']) {
			$template['template_body'][] = 'po_items_notes';
		}

		if ($this->options['overageNotes']) {
			$template['template_body'][] = 'po_items_overagenotes';
		}

		if ($this->options['history']) {
			$template['template_body'][] = 'po_items_history';
		}

		if ($this->options['forward']) {
			array_push($template['template_body'], 'po_items_poforwards', 'po_items_posenttovendor');
		}

		return $template;
	}

	public function getTemplate() {
		return $this->template;
	}

	public function save($filename) {
		// Get a PDF
		$pdf = $this->generatePdf();
		
		// Save the PDF
		$pdf->saveAs($filename);

		if ($pdf->getError() !== null) {
			echo $pdf->getError();
		}
	}

	public function render() {
		// Get a PDF
		$pdf = $this->generatePdf();

		// Output the PDF headers
		$pdf->send('po.pdf');

		if ($pdf->getError() !== null) {
			echo $pdf->getError();
		}
	}

	/**
	 * Generate the PDF and get an object
	 */
	protected function generatePdf() {
		ob_start();
		
		echo '<!DOCTYPE HTML>' .
			'<html>' .
			'<head>';

		$this->renderCssTag();

		echo '</head>' .
			'<body>';

		$this->renderHtml();

		echo '</body></html>';

		$html = ob_get_clean();

		$pdf = new \WkHtmlToPdf([
			'header-html'       => $this->configService->getLoginUrl() . "/lib/po/header.php?purchaseorder_id={$this->entity_id}",
			'footer-html'       => $this->configService->getLoginUrl() . "/lib/po/footer.php?purchaseorder_id={$this->entity_id}",
			'binPath'           => $this->configService->getConfig('reportServer')['wkhtmltopdfPath'],
			'tmp'               => $this->configService->getConfig('reportServer')['tempDir'],
			'orientation'       => 'portrait',
			'margin-bottom'     => 12,
			'footer-spacing'    => 5,
			'disable-javascript'
		]);
		$pdf->addPage($html);

		return $pdf;
	}

	public function renderHtml() {
		echo '<table width="100%">';

		$this->renderLogo();
		$this->renderHeader();

		echo '</table>';

		$this->renderBody();
		$this->renderFooter();
	}

	public function renderLogo() {
		$logo = $this->getLogo();

		echo '<tr id="poLogo">';

		if (
			array_key_exists('template_logo_left', $this->template)
			&& count($this->template['template_logo_left'])
			&& $this->template['template_logo_left'][0] == 'po_items_logo'
		) {
			echo '<td align="left" colspan="2">' .
					$this->getTemplateValue('po_items_logo') .
				'</td>';
				'<td align="right">' .
					'<span style="font-size:24px;color:##999;padding-top:5px;">' . 
						$this->templateLabel .
					'</span>' .
				'</td>';
		} else if (
			array_key_exists('template_logo_center', $this->template)
			&& count($this->template['template_logo_center'])
			&& $this->template['template_logo_center'][0] == 'po_items_logo'
		) {
			echo '<td align="center" colspan="3">' .
					"{$this->getTemplateValue('po_items_logo')}<br />" .
					'<span style="font-size:14px">' . $this->templateLabel . '</span>' .
				'</td>';
		} else if (
			array_key_exists('template_logo_right', $this->template)
			&& count($this->template['template_logo_right'])
			&& $this->template['template_logo_right'][0] == 'po_items_logo'
		) {
			echo '<td><span style="font-size:14px">' . $this->templateLabel . '</span></td>' .
				'<td align="right" colspan="2">' .
					$this->getTemplateValue('po_items_logo') .
				'</td>';
		}

		echo '</tr>';
	}

	public function renderHeader() {
		if (array_key_exists('template_header', $this->template)) {
			echo '<tr id="poHeader">' .
					'<td colspan="3">';

			$headers = $this->template['template_header'];
			foreach ($headers as $i=>$item) {
				$colType = $this->getHeaderColType($headers, $i);
				if ($colType == 'left') {
					echo '<span style="float:left; padding-bottom:20px; padding-right: 45px; font-size:13px !important; width:180px; height: auto;">' .
							$this->getTemplateValue($item) .
						'</span>';
				} else if ($colType == 'right') {
					echo '<span style="float:left;padding-bottom:20px;font-size:13px !important; width:180px;">' .
							$this->getTemplateValue($item) .
						'</span>' .
						'<div class="cleared"></div>';
				} else {
					$borderStyle = ($i == (count($headers) - 1)) ? 'border-right:1px solid ##666;' : '';
					echo '<span style="' . $borderStyle . '" class="po_data ">' .
							$this->getTemplateValue($item) .
						'</span>';
				}
			}

			echo 	'</td>' .
				'</tr>';
		}
	}

	private function getHeaderColType($headers, $i) {
		if (
			$this->isHeaderItemVendorOrShipBill($headers[$i])
			&& $i < (count($headers)-1)
			&& $this->isHeaderItemVendorOrShipBill($headers[$i+1])
		) {
			return 'left';
		} else if (
			$this->isHeaderItemVendorOrShipBill($headers[$i])
			&& (
				($i < (count($headers)-1) && $this->isHeaderItemVendorOrShipBill($headers[$i+1]))
				|| $i == (count($headers)-1)
			)
		) {
			return 'right';
		}

		return 'none';
	}

	private function isHeaderItemVendorOrShipBill($headerItem) {
		return (in_array($headerItem, ['po_items_vendor','po_items_shipto','po_items_billto']));
	}

	public function renderBody() {
		if (array_key_exists('template_body', $this->template)) {
			foreach ($this->template['template_body'] as $item) {
				echo '<div class="infoblock">' . 
						$this->getTemplateValue($item) .
						'<div class="cleared"></div>' .
					'</div>';
			}
		}
	}

	public function renderFooter() {
		if (array_key_exists('template_footer', $this->template)) {
			foreach ($this->template['template_footer'] as $item) {
				echo $this->getTemplateValue($item) .
					'<div class="cleared"></div>';
			}
		}
	}

	public function getTemplateValue($item) {
		switch ($item) {
			case 'po_items_logo':
				return $this->getLogo();
				break;
			case 'po_items_createdby':
				return $this->getCreatedBy();
				break;
			case 'po_items_lastapprover':
				return $this->getLastApprover();
				break;
			case 'po_items_status':
				return $this->getPoStatus();
				break;
			case 'po_items_date':
				return $this->getCreatedDate();
				break;
			case 'po_items_number':
				return $this->getPoNumber();
				break;
			case 'po_items_poheadertext':
				return $this->getHeaderText();
				break;
			case 'po_items_pofootertext':
				return $this->getFooterText();
				break;
			case 'po_items_initials':
				return $this->getInitials();
				break;
			case 'po_items_vendor':
				return $this->getVendor();
				break;
			case 'po_items_headercustomfields':
				return $this->getHeaderCustomFields();
				break;
			case 'po_items_lineitemdetails':
				return $this->getLineDetails();
				break;
			case 'po_items_notes':
				return $this->getNotes();
				break;
			case 'po_items_overagenotes':
				return $this->getOverageNotes();
				break;
			case 'po_items_history':
				return $this->getHistory();
				break;
			case 'po_items_poforwards':
				return $this->getForwards();
				break;
			case 'po_items_posenttovendor':
				return $this->getVendorForwards();
				break;
			case 'po_items_billto':
				return $this->getBillToShipTo('bill');
				break;
			case 'po_items_shipto':
				return $this->getBillToShipTo('ship');
				break;
			case 'po_items_additionaltext':
				return $this->getAdditionalText();
				break;
			case 'po_items_pagenumber':
				return $this->getPageNumber();
				break;
		}
	}

	private function getLogo() {
		$imgPath = "{$this->configService->getLoginUrl()}/clients/{$this->configService->getAppName()}/web/images/{$this->configService->get('reports.IMAGES.ReportHeader')}";
		if (
			array_key_exists('print_template_additional_image', $this->template)
			&& file_exists($this->template['print_template_additional_image'])
		) {
			$imgPath = $this->template['print_template_additional_image'];
		}
		return '<div class="cleared">' .
					'<img src="' . $imgPath . '" id="logo" />' .
				'</div>';
	}

	private function getCreatedBy() {
		$created_by = $this->entity['created_by'];
		if (empty($created_by)) {
			$created_by = $this->entity['userprofile_username'];
		}

		return '<div class="heading graybg">CREATED BY</div>' .
				'<div class="content">' .
					$created_by .
				'</div>';
	}

	private function getLastApprover() {
		$approver = '';
		if (!empty($this->entity['last_approved_by']) && !empty($this->entity['last_approved_datetm'])) {
			$approveDate = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $this->entity['last_approved_datetm']);
			$approver = $this->entity['last_approved_by'] . ' on ' .
							$approveDate->format($this->configService->get('PN.Intl.DateFormat', 'm/d/Y'));
		}

		return '<div class="heading graybg">LAST APPROVER</div>' .
				'<div class="content">' .
					$approver . 
				'</div>';
	}

	private function getPoStatus() {
		return '<div class="heading graybg">STATUS</div>' .
				'<div class="content">' . strtoupper($this->getFormattedStatus()) . '</div>';
	}

	private function getFormattedStatus() {
		$status = $this->entity['purchaseorder_status'];

		switch ($status) {
			case 'open':
				return 'In Progress';
				break;
			case 'forapproval':
				return 'Pending Approval';
				break;
			case 'saved':
				return 'Released';
				break;
			case 'closed':
				if (count($this->entity['lines'])) {
					return 'Invoiced';
				} else {
					return 'Cancelled';
				}
				break;
			case 'draft':
				if ($this->entity['property_id'] != 0) {
					return 'Template';
				} else {
					return 'User Template';
				}
				break;
			default:
				return ucfirst($status);
				break;
		}
	}

	private function getCreatedDate() {
		$createdDate = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $this->entity['purchaseorder_created']);
		return '<div class="heading graybg">PO DATE</div>' .
				'<div class="content">' .
					$createdDate->format($this->configService->get('PN.Intl.DateFormat', 'm/d/Y')) .
				'</div>';
	}

	private function getPoNumber() {
		$showSetting = $this->configService->get('CP.DISPLAY_PO_NUMBER_WHEN', 'Created=1; PendingApproval=1; Approved=1');
		$status      = $this->entity['purchaseorder_status'];
		$poNumber    = $this->entity['purchaseorder_ref'];

    	if (
    		(strpos($showSetting, 'Created=1') === false && $status === 'open')
    		|| (strpos($showSetting, 'PendingApproval=1') === false && $status === 'forapproval')
    		|| (strpos($showSetting, 'Approved=1') === false && $status === 'saved')
    	) {
    		$poNumber = strtoupper($this->getFormattedStatus());
    	}

    	return '<div class="heading graybg">PO NUMBER</div>' .
				'<div class="content">' . $poNumber . '</div>';
	}

	private function getHeaderText() {
		if (array_key_exists('TEMPLATE_HEADER_TEXT', $this->template)) {
			return '<div id="clientheader">' .
						$this->template['TEMPLATE_HEADER_TEXT'] .
					'</div>';
		}

		return '';
	}

	private function getFooterText() {
		if (array_key_exists('TEMPLATE_FOOTER_TEXT', $this->template)) {
			return '<div id="clientheader">' .
						$this->template['TEMPLATE_FOOTER_TEXT'] .
					'</div>';
		}

		return '';
	}

	private function getInitials() {
		return '<span>Initial: _____________</span>';
	}

	private function getVendor() {
		return '<table cellpadding="0" cellspacing="0">' .
				'<tr>' .
					'<td valign="top" style="font-size:13px;">' .
						'TO<br />' .
						$this->getVendorHtml() .
					'</td>' .
				'</tr>' .
				'</table>';
	}

	private function getHeaderCustomFields() {
		ob_start();
		echo '<table cellpadding="0" cellspacing="0" style="margin: 0 0;">';

		$this->renderCustomFields($this->entity, 'header');
		
		$html = ob_get_clean();

		if ($this->entity['is_service_vendor']) {
			$html .= $this->getServiceFieldsHtml();
		}

		$html .= '</table>';

		return $html;
	}

	private function getLineDetails() {
		ob_start();
		
		$this->renderLines();
		$this->renderLineFooter();
		
		return ob_get_clean();
	}

	protected function renderCustomField($data, $customField, $type) {
		if ($type == 'line') {
			parent::renderCustomField($data, $customField, $type);
		} else {
			$label = $customField['label'];
			$val   = $data['universal_field' . $customField['fieldNumber']];

			echo '<tr>' .
					'<td nowrap="nowrap" valign="top"><b>' . $label . ':</b></td>' .
					'<td>&nbsp;</td>' .
					'<td valign="top">' . $val . '</td>' .
				'</tr>';
		}
	}

	private function getServiceFieldsHtml() {
		$html = '';

		foreach ($this->entity['service_fields'] as $i=>$field) {
			$html .= '<tr>' .
						'<td nowrap="nowrap" valign="top"><b>' . $field['customfield_label'] . ':</b></td>' .
						'<td>&nbsp;</td>' .
						'<td valign="top">' . $field['customfielddata_value'] . '</td>' .
					'</tr>';
		}

		return $html;
	}

	private function getNotes() {
		ob_start();
		
		$this->renderNotes();

		return ob_get_clean();
	}

	private function getOverageNotes() {
		ob_start();
		
		$this->renderOverageNotes();

		return ob_get_clean();
	}

	private function getHistory() {
		ob_start();
		
		$this->renderHistory();

		return ob_get_clean();
	}

	private function getForwards() {
		ob_start();
		
		$this->renderForwards('purchaseorder');

		return ob_get_clean();
	}

	private function getVendorForwards() {
		ob_start();
		
		$this->renderForwards('povendor');

		return ob_get_clean();
	}

	private function getBillToShipTo($type) {
		$address = str_replace("\n", '<br />', $this->entity["Purchaseorder_{$type}address"]);

		return '<div class="" style="font-size:13px;">' .
					strtoupper($type) . ' TO<br />' .
					'<span style="font-size:10px;">' . $address . '</span>' .
				'</div>';
	}

	private function getAdditionalText() {
		if (array_key_exists('TEMPLATE_ADDITIONAL_TEXT', $this->template)) {
			$text = $this->template['TEMPLATE_ADDITIONAL_TEXT'];
			if (!empty($text)) {
				return '<div class="infoblock">' .
							$text .
						'</div>';
			}
		}

		return '';
	}

	private function getPageNumber() {
		return '<div id="pageNum">Page <b>' . $_REQUEST['page'] . '</b> of <b>' . $_REQUEST['topage'] . '</b></div>';
	}
}

?>