<?php

namespace NP\report\renderer;

use NP\report\ReportInterface;
use NP\core\GatewayManager;
use NP\system\ConfigService;
use NP\security\SecurityService;

/**
 * Report Renderer interface
 *
 * @author Thomas Messier
 */
interface ReportRendererInterface {
	public function __construct(
		ConfigService $configService,
		SecurityService $securityService,
		GatewayManager $gatewayManager,
		ReportInterface $report,
		$data
	);
	
	public function render();
}

?>