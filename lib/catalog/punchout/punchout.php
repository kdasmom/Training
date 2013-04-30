<?php
return 
'<?xml version="1.0" encoding="UTF-8" ?> 
<cXML version="1.2.014" payloadID="' . $payloadID . '@payablesnexus.com" timestamp="' . $timestamp . '" xml:lang="en">
	<Header>
		<From>
			<Credential domain="duns">
				<Identity>' . $vc_punchout_from_duns . '</Identity> 
			</Credential>
		</From>
		<To>
			<Credential domain="duns">
				<Identity>' . $vc_punchout_to_duns . '</Identity> 
			</Credential>
		</To>
		<Sender>
			<Credential domain="AribaNetworkUserId">
				<Identity>' . $vc_punchout_username . '</Identity> 
				<SharedSecret>' . $vc_punchout_pwd . '</SharedSecret> 
			</Credential>
			<UserAgent>Nexus Systems Catalog Module</UserAgent>
		</Sender>
	</Header>
	<Request deploymentMode="test">
		<PunchOutSetupRequest operation="create">
			<BuyerCookie>' . $vc_id . '_' . $purchaseorder_id . '_' . $asp_client_id .'_' . $userprofile_id . '</BuyerCookie>
			<Extrinsic name="UniqueName">' . $asp_client_id .'_' . $userprofile_id . '</Extrinsic>
			<Extrinsic name="CostCenter">' . $property_id_alt . '</Extrinsic>
			<BrowserFormPost>
				<URL>' . $loginUrl . '/flat/onsite/vc/punchout/vc_punchout_order.cfm</URL>
			</BrowserFormPost>
			<SupplierSetup>
				<URL>' . $vc_punchout_url . '</URL> 
			</SupplierSetup>
			<ShipTo>
				<Address addressID="' . $property_id_alt . '">
					<Name xml:lang="en">' . $property_id_alt . '</Name>
				</Address>
			</ShipTo>
		</PunchOutSetupRequest>
	</Request>
</cXML>';

?>