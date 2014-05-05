<?php

// Bootstrap
require_once("../../bootstrap.php");

$pdf = new \NP\po\PoPdfRenderer($di['ConfigService'], $di['GatewayManager'], $di['PoService'], $_GET['purchaseorder_id'], []);
$template = $pdf->getTemplate();

if (!array_key_exists('template_footer_left', $template)) {
	$template['template_footer_left'] = [];
}
if (!array_key_exists('template_footer_right', $template)) {
	$template['template_footer_right'] = [];
}

?>

<!DOCTYPE html>
<html>
<head>
   <?php $pdf->renderCssTag(); ?>
</head>
<body>
<div class="infoblock">
	<table width="100%">
		<tr valign="top">
			<td width="48%" style="text-align: left" >
				<table>
					<tr>
						<?php foreach ($template['template_footer_left'] as $item) {
							echo '<td style="text-align: left">' . $pdf->getTemplateValue($item) . '</td>';
						} ?>
					</tr>
				</table>
			</td>
			
			<td width="4%">&nbsp;</td>
			
			<td width="48%" align="right">
				<table>
					<tr>
						<?php foreach ($template['template_footer_right'] as $item) {
							echo '<td align="right">' . $pdf->getTemplateValue($item) . '</td>';
						} ?>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</div>
</body>
</html>