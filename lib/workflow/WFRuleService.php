<?php
namespace NP\workflow;

use NP\core\AbstractService;

use NP\system\ConfigService;
use NP\security\SecurityService;

use NP\workflow\WfRuleGateway;

class WFRuleService extends AbstractService {
    protected $configService, $securityService, $wfRuleGateway;

    public function __construct(WfRuleGateway $wfRuleGateway) {
        $this->wfRuleGateway = $wfRuleGateway;
    }

    public function setConfigService(ConfigService $configService) {
        $this->configService = $configService;
    }
    public function setSecurityService(SecurityService $securityService) {
        $this->securityService = $securityService;
    }

    public function get($id) {
        $asp_client_id = $this->configService->getClientId();
        return $this->wfRuleGateway->getRule($id, $asp_client_id);
    }

    public function search($type = 0, $criteria = null, $page = null, $pageSize = null, $order = "wfrule_name") {
        $asp_client_id = $this->configService->getClientId();
        return $this->wfRuleGateway->findRule($asp_client_id, $type, $criteria, $page, $pageSize, $order);
    }
}