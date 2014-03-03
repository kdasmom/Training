<?php

namespace NP\report;

/**
 * Invoice Summary report
 *
 * @author Thomas Messier
 */
class InvoiceSummary extends AbstractReport implements ReportInterface {
	
	public function init() {
		$this->title = 'Invoice Summary Report';

		$this->addCols([
			new ReportColumn('Vendor', 'vendor_name', 0.2),
			new ReportColumn('Property', 'property_name', 0.15)
		]);

		$showUnit = $this->configService->get('pn.InvoiceOptions.AllowUnitAttach', '0');
		if ($showUnit == '1') {
			$this->addCol(new ReportColumn('Unit', 'unit_number', 0.04));
		}

		$this->addCols([
			new ReportColumn('Invoice #', 'invoice_ref', 0.1, 'left', null, [$this, 'invoiceLink']),
			new ReportColumn('Invoice Date', 'invoice_datetm', 0.07, 'left', [$this, 'dateRenderer']),
			new ReportColumn('Post Period', 'invoice_period', 0.07, 'left', [$this, 'periodRenderer']),
			new ReportColumn('Inv Amount', 'invoice_amount', 0.07, 'right', [$this, 'currencyRenderer']),
			new ReportColumn('PO Amount', 'initial_amount', 0.07, 'right', [$this, 'currencyRenderer']),
			new ReportColumn('Created By', 'created_by', 0.07),
			new ReportColumn('Last Approved By', 'approved_by', 0.1),
			new ReportColumn('Status', 'invoice_status', 0.06)
		]);

		$this->addGroups([
			new ReportGroup('vendor_name', ['invoice_amount','initial_amount']),
			new ReportGroup('property_name', ['invoice_amount','initial_amount'])
		]);

		$this->sql = "
		    SELECT
		    	isnull(vot.vendoronetime_id,v.vendor_id) as vendor_id, 
		    	isnull(vot.vendoronetime_name,v.vendor_name) as vendor_name, 
		    	v.vendor_name AS v_name, 
		    	vs.vendorsite_code, 
				i.invoice_ref, 
				i.invoice_datetm, 
				i.invoice_period, 
				i.universal_field1,
				i.reftablekey_id, 
				CASE 
					WHEN PROPERTY.PROPERTY_STATUS = -1 THEN PROPERTY.PROPERTY_NAME + ' (On Hold)'
					WHEN Property.Property_Status = 0 THEN Property.Property_Name + ' (Inactive)' 
					ELSE PROPERTY.PROPERTY_NAME 
				END AS property_name, 
			i.invoice_id, 
			PROPERTY.property_id, 
			SUM(invoiceitem_amount + invoiceitem_salestax + invoiceitem_shipping) AS invoice_amount,
			(
				SELECT TOP 1 p.person_firstname + ' ' + p.person_lastname
				FROM RECAUTHOR ra WITH (NOLOCK) 
				INNER JOIN USERPROFILE u2 ON ra.userprofile_id = u2.userprofile_id 
				INNER JOIN USERPROFILEROLE ur ON u2.userprofile_id = ur.userprofile_id 
				INNER JOIN STAFF s ON ur.tablekey_id = s.staff_id 
				INNER JOIN PERSON p ON s.person_id = p.person_id
				WHERE ra.table_name = 'invoice' 
					AND ra.tablekey_id = i.invoice_id
			) AS created_by,
			(
				SELECT SUM(ix.invoiceitem_amount) + SUM(ix.invoiceitem_salestax) + SUM(ix.invoiceitem_shipping)
				FROM POITEM 
					INNER JOIN INVOICEITEM ix ON ix.invoiceitem_id = POITEM.reftablekey_id
		";

		if ($this->params['onlyCapEx'] == 1) {
			$this->sql .= "INNER JOIN GLACCOUNT ON ix.glaccount_id = GLACCOUNT.glaccount_id";
		}

		$this->sql .= "
			WHERE POITEM.reftable_name = 'invoiceitem'
				--AND POITEM.Property_Id IN ( SELECT p.property_id FROM property p INNER JOIN @propertyTable p2 ON p.property_id = p2.property_id )
				--AND POITEM.Property_Id = 158
				AND ix.Invoice_ID = i.Invoice_Id
		";

		if ($this->params['onlyCapEx'] == 1) {
			$this->sql .= "AND GLACCOUNT.GLACCOUNTType_Id = 1";	
		}
		
		$this->sql .= "
			) AS initial_amount,
			CASE
				WHEN i.invoice_status = 'open' THEN 'In Progress'
				WHEN i.invoice_status = 'forapproval' THEN 'Pending Approval'
				WHEN i.invoice_status = 'approved' THEN 'Approved'
				WHEN i.invoice_status = 'rejected' THEN 'Rejected'
				WHEN i.invoice_status = 'hold' THEN 'On Hold'
				WHEN i.invoice_status = 'saved' THEN 'Completed'
				WHEN i.invoice_status = 'submitted' THEN 'Submitted For Payment'
				WHEN i.invoice_status = 'sent' THEN 'In ' + (
					SELECT TOP 1 it.integration_package_type_display_name
					FROM INTEGRATIONPACAKGETYPE it 
					INNER JOIN INTEGRATIONPACKAGE ip ON it.Integration_Package_Type_Id = ip.integration_package_type_id 
					INNER JOIN PROPERTY p ON ip.integration_package_id = p.integration_package_id
					WHERE p.property_id = property.property_id
				)
				WHEN i.invoice_status = 'posted' THEN 'Posted In ' + (
					SELECT TOP 1 it.integration_package_type_display_name
					FROM INTEGRATIONPACAKGETYPE it 
					INNER JOIN INTEGRATIONPACKAGE ip ON it.Integration_Package_Type_Id = ip.integration_package_type_id 
					INNER JOIN PROPERTY p ON ip.integration_package_id = p.integration_package_id
					WHERE p.property_id = property.property_id
				)
				WHEN i.invoice_status = 'paid' THEN 'Paid'
				WHEN i.invoice_status = 'void' THEN 'Void'
			END AS invoice_status,
			(
				SELECT TOP 1 p.person_firstname+' '+p.person_lastname
				FROM APPROVE a WITH (NOLOCK) 
					INNER JOIN USERPROFILE u2 ON a.userprofile_id = u2.userprofile_id
					INNER JOIN USERPROFILEROLE ur ON u2.userprofile_id = ur.userprofile_id
					INNER JOIN STAFF s ON ur.tablekey_id = s.staff_id
					INNER JOIN PERSON p ON s.person_id = p.person_id
				WHERE a.table_name = 'invoice'
					AND a.tablekey_id = i.invoice_id
					AND a.approvetype_id in (SELECT approvetype_id FROM APPROVETYPE WITH (NOLOCK)  WHERE approvetype_name IN ('self approved','approved'))
				ORDER BY a.approve_id DESC
			) AS approved_by,
			CASE 
				WHEN i.invoice_status = 'paid' THEN (
					SELECT TOP 1
		";

		if ($this->configService->get('PN.Intl.DateFormat') == 'dd/mm/yyyy') {
			$this->sql .= "'(CHK ##' + CONVERT(varchar(50),invpay.invoicepayment_checknum) + ' - ' + CONVERT(varchar(16),DAY(invpay.invoicepayment_datetm))+ '/' + CONVERT(varchar(6),MONTH(invpay.invoicepayment_datetm)) + '/' + CONVERT(varchar(5),YEAR(invpay.invoicepayment_datetm)) +')'";
		} else {
			$this->sql .= "'(CHK ##' + CONVERT(varchar(50),invpay.invoicepayment_checknum) + ' - ' + CONVERT(varchar(6),MONTH(invpay.invoicepayment_datetm)) + '/' + CONVERT(varchar(16),DAY(invpay.invoicepayment_datetm))+ '/'+ CONVERT(varchar(5),YEAR(invpay.invoicepayment_datetm)) +')'";
		}

		$this->sql .= "
					FROM INVOICEPAYMENT invpay 
						INNER JOIN INVOICEPAYMENTSTATUS ON invpay.invoicepayment_status_id = INVOICEPAYMENTSTATUS.invoicepayment_status_id									
					WHERE invpay.invoice_id = i.invoice_id AND INVOICEPAYMENTSTATUS.paid = 1
					ORDER BY invpay.invoicepayment_id desc
				)
				ELSE ''
			END AS Paid_Info
		";

		if ($showUnit == '1') {
			$this->sql .= "
				,(
					SELECT TOP 1 unit_number FROM unit 
					WHERE unit_id = isnull(invoiceitem.unit_id, 0)
				) AS unit_number
			";
		}
		
		$this->sql .= "	
			FROM INVOICE i 
				INNER JOIN VENDORSITE vs ON i.paytablekey_id = vs.vendorsite_id 
				INNER JOIN VENDOR v ON vs.vendor_id = v.vendor_id 
				INNER JOIN INTEGRATIONPACKAGE ip ON ip.integration_package_id = v.integration_package_id 
				INNER JOIN INVOICEITEM ON i.invoice_id = INVOICEITEM.invoice_id 
				INNER JOIN PROPERTY ON INVOICEITEM.property_id = PROPERTY.property_id 
				INNER JOIN GLACCOUNT ON INVOICEITEM.glaccount_id = GLACCOUNT.glaccount_id 
				LEFT OUTER JOIN VENDORONETIME vot ON i.invoice_id = vot.tablekey_id AND vot.table_name = 'invoice'
		";

		if ($showUnit == '1' && $this->params['unit_id'] != '0') {
			$this->sql .= "
				INNER JOIN UNIT ON INVOICEITEM.unit_id = UNIT.unit_id AND UNIT.unit_id = ?
			";
			$this->queryParams[] = $this->params['unit_id'];
		}

		$this->sql .= "
			WHERE i.invoice_status NOT IN ('draft')
				--AND INVOICEITEM.property_id = 158
				--AND INVOICEITEM.property_id IN ( SELECT p.property_id FROM property p INNER JOIN @propertyTable p2 ON p.property_id = p2.property_id )
		";

		if ($this->params['onlyCapEx'] == 1) {
			$this->sql .= "
				AND GLACCOUNT.GLACCOUNTTYPE_ID = 1
			";
		}

		if (!empty($this->params['fromdate']) && !empty($this->params['todate'])) {
			$this->queryParams[] = $this->params['fromdate'];
			$this->queryParams[] = $this->params['todate'];

			if ($this->params['date_type'] == 'period' || $this->params['date_type'] == 'quarter') {
				$this->sql .= "
					AND INVOICEITEM.invoiceitem_period BETWEEN ? AND ?
				";
			} else if ($this->params['date_type'] == 'submitted') {
				$this->sql .= "
					AND i.invoice_submitteddate BETWEEN ? AND ?
				";
			} else if ($this->params['date_type'] == 'approval') {
				$this->sql .= "
					AND (
						SELECT TOP 1 dbo.DateNoTime(a.approve_datetm)
						FROM APPROVE a WITH (NOLOCK) 
							INNER JOIN APPROVETYPE at ON a.approvetype_id = at.approvetype_id
						WHERE a.table_name = 'invoice'
							AND a.tablekey_id = i.invoice_id
							AND at.approvetype_name IN ( 'approved','self approved')
						ORDER BY a.approve_datetm DESC
					) BETWEEN ? AND ?
				";
			} else if ($this->params['date_type'] == 'created') {
				$this->sql .= "AND i.invoice_createddatetm BETWEEN ? AND ?";
			} else if ($this->params['date_type'] == 'checkpaiddate') {
				$this->sql .= "
					AND EXISTS (
						SELECT *
						FROM INVOICEPAYMENT invpay
						WHERE invpay.invoice_id = i.invoice_id
							AND invpay.invoicepayment_datetm BETWEEN ? AND ?
					)
				";
			} else if ($this->params['date_type'] == 'checkpaiddate') {
				$this->sql .= "
					AND i.invoice_datetm BETWEEN ? AND ?
				";
			}
		}

		if ($this->params['onlyWithoutPos'] == 1) {
			$this->sql .= "
				AND INVOICEITEM.invoiceitem_id NOT IN (
					SELECT reftablekey_id 
					FROM poitem 
					WHERE reftable_name = 'invoiceitem'
						--AND property_id IN ( SELECT p.property_id FROM property p INNER JOIN @propertyTable p2 ON p.property_id = p2.property_id )
						--AND property_id = 158
				)
			";
		}

		if ($this->params['vendor_id'] != 0) {
			$this->sql .= "AND (isnull(vot.vendoronetime_id, v.vendor_id) = ?)";
			$this->queryParams[] = $this->params['vendor_id'];
		}

		if ($this->params['invoice_status'] != 0) {
			$placeHolders = array_fill(0, count($this->params['invoice_status']), '?');
			$placeHolders = implode(',', $placeHolders);
			$this->sql .= "AND i.invoice_status IN ({$placeHolders})";

			$this->queryParams = array_merge($this->queryParams, $this->params['invoice_status']);
		}

		if ($this->params['userprofile_id'] != 0) {
			$this->sql .= "
				AND i.invoice_id IN (
					SELECT r.tablekey_id
					FROM RECAUTHOR r WITH (NOLOCK)
					WHERE r.table_name = 'invoice'
						AND r.tablekey_id = i.invoice_id 
						AND r.userprofile_id = ?
				)
			";

			$this->queryParams[] = $this->params['userprofile_id'];
		}

		if ($this->params['approvedby_id'] != 0) {
			$this->sql .= "
				AND i.invoice_id IN (
					SELECT APPROVE.tablekey_id 
					FROM APPROVE 
					WHERE APPROVE.approvetype_id IN (2,8) 
						AND APPROVE.table_name = 'invoice' 
						AND APPROVE.userprofile_id = ?
				)
			";

			$this->queryParams[] = $this->params['approvedby_id'];
		}

		$this->sql .= "GROUP BY i.invoice_id,";

		if ($showUnit == '1') {
			$this->sql .= "isnull(invoiceitem.unit_id, 0),";
		}

		$this->sql .= "
				i.invoice_ref, 
				v.vendor_name, isnull(vot.vendoronetime_name,v.vendor_name), isnull(vot.vendoronetime_id,v.vendor_id), vs.vendorsite_code, 
				i.invoice_datetm, i.invoice_period, i.universal_field1, i.reftablekey_id, 
				PROPERTY.property_name, PROPERTY.property_id, PROPERTY.property_status, i.invoice_status 
			ORDER BY v.vendor_name ASC, PROPERTY_NAME
		";

		$this->sql = "
			SELECT
				TOP 100
				i.*,
				v.vendor_id,
				v.vendor_name,
				p.property_id,
				p.property_name,
				(
					SELECT SUM(ii.invoiceitem_amount + ii.invoiceitem_salestax + ii.invoiceitem_shipping)
					FROM invoiceitem ii
					WHERE i.invoice_id = ii.invoice_id
				) AS invoice_amount,
				0 AS initial_amount,
				'' AS created_by,
				'' AS approved_by,
				'In Progress' AS invoice_status,
				'' AS unit_number,
				'' AS Paid_Info
			FROM invoice i
				INNER JOIN VENDORSITE vs ON i.paytablekey_id = vs.vendorsite_id 
				INNER JOIN VENDOR v ON vs.vendor_id = v.vendor_id 
				INNER JOIN PROPERTY p ON i.property_id = p.property_id
			ORDER BY v.vendor_name, p.property_name
		";
	}

	public function invoiceLink($val, $row, $params) {
		return "javascript:window.parent.location='#Invoice:showView:{$row['invoice_id']}';";
	}
}

?>