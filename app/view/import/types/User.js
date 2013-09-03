/**
 * User type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.User', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_user',

    // For localization
    tabTitle          : 'User',
    entityName        : 'User',
    sectionName       : 'User',
    colTextFirstName  : 'First Name',
    colTextMiddleName : 'Middle Name',
    colTextLastName   : 'Last Name',
    colTextUsername   : 'Username',
    colTextUserGroup  : 'UserGroup',
    colTextAddress1   : 'Address1',
    colTextAddress2   : 'Address2',
    colTextCity       : 'City',
    colTextState      : 'State',
    colTextZip        : 'Zip',
    colTextEmailAddress  : 'Email Address',
    colTextHomePhone  : 'Home Phone',
    colTextWorkPhone  : 'Work Phone',

    getGrid: function() {
        return {
            forceFit: true,
            columns: [
                { text: this.colTextFirstName, dataIndex: 'FirstName', flex: 1 },
                { text: this.colTextMiddleName, dataIndex: 'MiddleName', flex: 1 },
                { text: this.colTextLastName, dataIndex: 'LastName'},
                { text: this.colTextUsername, dataIndex: 'Username'},
                { text: this.colTextUserGroup, dataIndex: 'UserGroup'},
                { text: this.colTextAddress1, dataIndex: 'Address1', flex: 1 },
                { text: this.colTextAddress2, dataIndex: 'Address2', flex: 1 },
                { text: this.colTextCity, dataIndex: 'City', flex: 1 },
                { text: this.colTextState, dataIndex: 'State', flex: 1 },
                { text: this.colTextZip, dataIndex: 'Zip', flex: 1 },
                { text: this.colTextEmailAddress, dataIndex: 'EmailAddress', flex: 1 },
                { text: this.colTextHomePhone, dataIndex: 'HomePhone', flex: 1 },
                { text: this.colTextWorkPhone, dataIndex: 'WorkPhone', flex: 1 }
            ]
        };
    }

});