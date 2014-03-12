<?php

namespace NP\report;

use NP\system\ConfigService;
use NP\security\SecurityService;
use NP\core\GatewayManager;

/**
 * Report interface
 *
 * @author Thomas Messier
 */
interface ReportInterface {
	
	public function __construct(
		ConfigService $configService,
		SecurityService $securityService,
		GatewayManager $gatewayManager,
		ReportOptions $options,
		$extraParams
	);

	public function getTitle();

	public function getCols();

	public function getGroups();

	public function getData();

	public function getOptions();

	public function getExtraParams();
}

?>