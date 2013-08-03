<?php

namespace NP\exim;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\system\ConfigService;
use NP\core\db\Adapter;

/**
 * Gateway for the EXIM GL Account table
 *
 * @author Aliaksandr Zubik
 */
class EximGLAccountGateway extends AbstractGateway {

	/**
	 * @var \NP\system\ConfigService The config service singleton
	 */
	protected $configService;
	
        protected $table = 'exim_glaccount';
	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	/**
	 * Retrieves All EXIM GL accounts
	 *
	 * @return array
	 */
	public function getEximGLAccounts() {
		$select = new Select();
		$select->from(array('g'=>'exim_glaccount'))
                        ->order("g.glaccount_name");
		return $this->adapter->query($select);
	}
	
}

?>