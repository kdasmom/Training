<?php
return 
'<ItemOut quantity="' . $poitem_quantity .'" lineNumber="' . $lineNumber . '">
				<ItemID>
					<SupplierPartID>' . $vcitem_number . '</SupplierPartID>
					<SupplierPartAuxiliaryID>' . $vcorder_aux_part_id . '</SupplierPartAuxiliaryID>
				</ItemID>
				<ItemDetail>
					<UnitPrice>
						<Money currency="USD">' . $poitem_unitprice . '</Money>
					</UnitPrice>
					<Description xml:lang="en">' . $poitem_description . '</Description>
					<UnitOfMeasure>' . $vcitem_uom . '</UnitOfMeasure>
					<Extrinsic name="ExtDescription">' . $poitem_description_alt . '</Extrinsic>
				</ItemDetail>
			</ItemOut>';

?>