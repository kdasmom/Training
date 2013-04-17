<?php

namespace NP\catalog;

use NP\core\AbstractGateway;

/**
 * Gateway for the VC table
 *
 * @author Thomas Messier
 */
class VcGateway extends AbstractGateway {

	public function findRegister($vc_status=null, $pageSize=null, $page=1, $sort='vc_vendorname') {
		$select = new sql\VcSelect();

		$select->columns(array('vc_id','vc_vendorname','vc_catalogname','vc_catalogtype','vc_createdby','vc_createdt','vc_lastupdateby','vc_lastupdatedt','vc_status'))
				->columnNumberOfItems()
				->joinCreator(array('creator_userprofile_username'=>'userprofile_username'))
				->joinUpdater(array('updater_userprofile_username'=>'userprofile_username'))
				->order($sort);

		$params = array();
		if ($vc_status !== null) {
			$status_list = explode(',', $vc_status);

			// If more than one status was specified, use IN operator
			if (count($status_list) > 1) {
				$placeHolders = implode(',', array_fill(0, count($status_list), '?'));
				$select->where("v.vc_status IN ({$placeHolders})");
				$params = $status_list;
			} else {
				$select->where('v.vc_status = ?');
				$params = array($vc_status);
			}
		}
		
		return $this->adapter->query($select, $params);
	}

}

?>