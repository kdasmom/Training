/**
 * Model for a VendorUtility
 *
 * @author Yura Rodchyn
 */
Ext.define('NP.model.import.Vendor', {
	extend: 'Ext.data.Model',
	
	fields: [
        {name: "VendorID"},
        {name: "Name"},
        {name: "FederalID"},
        {name: "TaxReportName"},
        {name: "Status"},
        {name: "VendorType"},
        {name: "PayPriority"},
        {name: "CreatedDate"},
        {name: "LastUpdateDate"},
        {name: "1099Reportable?"},
        {name: "TermDateBasis"},
        {name: "PayDateBasis"},
        {name: "DefaultGLcode"},
        {name: "Phone"},
        {name: "Fax"},
        {name: "Address1"},
        {name: "Address2"},
        {name: "City"},
        {name: "State"},
        {name: "ZipCode"},
        {name: "ContactLastName"},
        {name: "ContactFirstName"},
        {name: "IntegrationPackage"},
        {name: "validation_status"}
	]
});
