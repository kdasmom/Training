<?php

namespace NP\report\renderer;

/**
 * Report Renderer interface
 *
 * @author Thomas Messier
 */
interface ReportRendererInterface {
	public function __construct($configService, \NP\report\ReportInterface $report, $data);
	public function render();
}

?>