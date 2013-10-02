<?php

namespace NP\gl;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Update;
use NP\core\db\Expression;
use NP\locale\LocalizationService;
use NP\system\ConfigService;

use NP\core\db\Adapter;

/**
 * Gateway for the GL Account table
 *
 * @author Thomas Messier
 */
class GLAccountGateway extends AbstractGateway
{

    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;

    protected $localizationService;

    /**
     * Setter function required by DI to set the config service via setter injection
     * @param \NP\system\ConfigService $configService
     */
    public function setConfigService(\NP\system\ConfigService $configService)
    {
        $this->configService = $configService;
    }

    public function setLocalizationService(LocalizationService $localizationService)
    {
        $this->localizationService = $localizationService;
    }

    /**
     * Gets all GL accounts that belong to a specified integration package
     *
     * @param  int $integration_package_id The integration package to get GL accounts for
     * @return array                         Array of GL account records
     */
    public function findByIntegrationPackage($integration_package_id)
    {
        $order = ($this->configService->get('PN.Budget.GLDisplayOrder') == 'Name') ? 'glaccount_name' : 'glaccount_number';
        $select = new Select();
        $select->from('glaccount')
            ->whereEquals('integration_package_id', '?')
            ->whereEquals('glaccount_usable', '?')
            ->whereEquals('glaccount_status', '?')
            ->whereIsNotNull('glaccounttype_id')
            ->order($order);

        return $this->adapter->query($select, array($integration_package_id, 'Y', 'active'));
    }

    /**
     * @param  int $vendorsite_id
     * @param  int $property_id
     * @param  string $glaccount_keyword
     * @return array
     */
    public function findForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword = '')
    {
        $usePropGL = $this->configService->get('CP.PROPERTYGLACCOUNT_USE', 0);
        $glaccount_keyword .= '%';
        $params = array($vendorsite_id, $glaccount_keyword, $glaccount_keyword);

        $select = new Select();
        $select->from(array('g' => 'glaccount'))
            ->join(array('gt' => 'glaccounttype'),
                'gt.glaccounttype_id = g.glaccounttype_id',
                array())
            ->join(array('vg' => 'vendorglaccounts'),
                'vg.glaccount_id = g.glaccount_id',
                array())
            ->join(array('vs' => 'vendorsite'),
                'vg.vendor_id = vs.vendor_id',
                array())
            ->join(array('v' => 'vendor'),
                'vs.vendor_id = v.vendor_id',
                array());

        $where = "
			g.glaccount_status = 'active'
			AND vs.vendorsite_id = ?
			AND g.integration_package_id = v.integration_package_id
			AND g.glaccounttype_id <> 10
			AND (
				g.glaccount_name LIKE ?
				OR g.glaccount_number LIKE ?
			)
		";

        if ($usePropGL) {
            $select->join(array('pg' => 'propertyglaccount'),
                'g.glaccount_id = pg.glaccount_id',
                array());

            $where .= " AND pg.property_id = ?";
            $params[] = $property_id;
        }

        $select->where($where);

        $sqlStr = $select->toString();

        if ($this->configService->get("PN.Budget.FixedAssetSpecial", 0)) {
            $select = new Select();
            $select->from(array('g' => 'glaccount'))
                ->join(array('i' => 'integrationpackage'),
                    'g.integration_package_id = i.integration_package_id',
                    array())
                ->where("
						g.glaccount_number = (SELECT fixedasset_account FROM property WHERE property_id = ?)
						AND g.glaccount_status = 'active'
						AND (
							g.glaccount_name LIKE ?
							OR g.glaccount_number LIKE ?
						)
					");

            $sqlStr .= ' UNION ' . $select->toString();
            $params[] = $property_id;
            $params[] = $glaccount_keyword;
            $params[] = $glaccount_keyword;
        }

        $sqlStr .= ' ORDER BY gt.glaccounttype_name,' . $this->configService->get("PN.Budget.GLCodeSort", "glaccount_number");

        return $this->adapter->query($sqlStr, $params);
    }

    /**
     * Retrieves GL accounts that a specific user has access to
     *
     * @param  int $userprofile_id
     * @return array
     */
    public function findUserGLAccounts($userprofile_id)
    {
        $select = new Select();
        $select->from(array('g' => 'glaccount'))
            ->where("
					EXISTS (
						SELECT *
						FROM PROPERTYGLACCOUNT pg
							inner join propertyuserprofile pu ON pg.property_id = pu.property_id
						WHERE g.glaccount_id = pg.glaccount_id
							AND pu.userprofile_id = ?
					)
				")
            ->order("g.glaccount_name");

        return $this->adapter->query($select, array($userprofile_id));
    }

    /**
     * Checks if a certain GL category already exists
     *
     * @param  string $glaccount_name
     * @param  int    $integration_package_id
     * @return boolean
     */
    public function getCategoryByName($glaccount_name, $integration_package_id) {
        $select = new Select();
        $select->from(array('g'=>'glaccount'))
                ->join(new sql\join\GlAccountTreeJoin(array('tree_id')))
                ->whereEquals('glaccount_name', '?')
                ->whereEquals('integration_package_id', '?')
                ->whereIsNull('glaccounttype_id');

        $res = $this->adapter->query($select, array($glaccount_name, $integration_package_id));

        return (count($res)) ? $res[0] : null;
    }

    /**
     * Gets the next number in the sequence for the glaccount_order field within a certain tree
     *
     * @param  int $tree_parent
     * @return int
     */
    public function getMaxOrder($tree_parent) {
        $select = new Select();
        $select->column(new Expression("ISNULL(MAX(g.glaccount_order), 1) + 1"), 'max_order')
                ->column(new Expression("COUNT(*) + 1 AS total"))
                ->from(array('g'=>'glaccount'))
                ->join(new sql\join\GlAccountTreeJoin())
                ->whereEquals('tr.tree_parent', '?');

        $res = $this->adapter->query($select, array($tree_parent));

        // Return whichever is bigger, the glaccount_order or the number of records
        return ($res[0]['max_order'] > $res[0]['total']) ? $res[0]['max_order'] : $res[0]['total'];
    }

    public function findByAltIdAndIntegrationPackage($glCode, $integrationPackageId)
    {
        $res = $this->find('glaccount_number = ? AND integration_package_id = ?', array($glCode, $integrationPackageId));

        return $res[0];
        
    }
    
    public function findByAltId($glNumber)
    {
        $res = $this->find('glaccount_number  = ?', array($glNumber));

        return $res[0];
        
    }
}
