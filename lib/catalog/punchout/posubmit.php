<?php
return 
'<?xml version="1.0" encoding="UTF-8" ?> 
<cXML version="1.2.014" payloadID="' . $payloadID . '@payablesnexus.com" timestamp="' . $timestamp . '" xml:lang="en">
	<Header>
		<From>
			<Credential domain="duns">
				<Identity>' . $vc_posubmit_from_duns . '</Identity> 
			</Credential>
		</From>
		<To>
			<Credential domain="duns">
				<Identity>' . $vc_posubmit_to_duns . '</Identity> 
			</Credential>
		</To>
		<Sender>
			<Credential domain="AribaNetworkUserId">
				<Identity>' . $vc_posubmit_username . '</Identity> 
				<SharedSecret>' . $vc_posubmit_pwd . '</SharedSecret> 
			</Credential>
			<UserAgent>Nexus Systems Catalog Module</UserAgent>
		</Sender>
	</Header>
	<Request deploymentMode="' . $deploymentMode . '">
		<OrderRequest>
			<OrderRequestHeader orderID="' . $purchaseorder_ref . '" orderDate="' . $timestamp . '" type="new">
				<Total>
					<Money currency="USD">' . $total_amount . '</Money>
				</Total>
				<BillTo>
					<Address isoCountryCode="US" addressID="' . $property_id_alt . '">
						<Name xml:lang="en">' . $property_name . '</Name>
						<PostalAddress name="default">
							<DeliverTo>' . $person_firstname . ' ' . $person_lastname . '</DeliverTo>
							<Street>' . $bill_address_street . '</Street>
							<City>' . $address_city . '</City>
							<State>' . $address_state . '</State>
							<PostalCode>' . $bill_zip . '</PostalCode>
							<Country isoCountryCode="US">United States</Country>
						</PostalAddress>
						<Email name="default">' . $email_address . '</Email>
						<Phone name="work">
							<TelephoneNumber>
								<CountryCode isoCountryCode="US">1</CountryCode>
								<AreaOrCityCode>' . $phone_area . '</AreaOrCityCode>
								<Number>' . $phone . '</Number>
							</TelephoneNumber>
						</Phone>
					</Address>
				</BillTo>
				<ShipTo>
					<Address isoCountryCode="US" addressID="' . $ship_property_id_alt . '">
						<Name xml:lang="en">' . $ship_property_name . '</Name>
						<PostalAddress name="default">
							<DeliverTo>' . $person_firstname . ' ' . $person_lastname . '</DeliverTo>
							<Street>' . $ship_address_street . '</Street>
							<City>' . $ship_address_city . '</City>
							<State>' . $ship_address_state . '</State>
							<PostalCode>' . $ship_zip . '</PostalCode>
							<Country isoCountryCode="US">United States</Country>
						</PostalAddress>
						<Email name="default">' . $email_address . '</Email>
						<Phone name="work">
							<TelephoneNumber>
								<CountryCode isoCountryCode="US">1</CountryCode>
								<AreaOrCityCode>' . $phone_area . '</AreaOrCityCode>
								<Number>' . $phone . '</Number>
							</TelephoneNumber>
						</Phone>
					</Address>
				</ShipTo>
				<Shipping>
					<Money currency="USD">' . $ship_amount . '</Money>
				</Shipping>
				<Tax>
					<Money currency="USD">' . $tax_amount . '</Money>
				</Tax>
				<Extrinsic name="ClientName">' . $client_short_name . '</Extrinsic>
			</OrderRequestHeader>
			' . $itemXml . '
		</OrderRequest>
	</Request>
</cXML>';

?>