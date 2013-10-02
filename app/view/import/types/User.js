/**
 * User type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.User', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
    fieldName  : 'file_upload_user',

    // For localization
    tabTitle           : 'User',
    entityName         : 'User',
    sectionName        : 'User',
    colTextFirstName   : 'First Name',
    colTextMiddleName  : 'Middle Name',
    colTextLastName    : 'Last Name',
    colTextUsername    : 'Username',
    colTextUserGroup   : 'UserGroup',
    colTextAddress1    : 'Address1',
    colTextAddress2    : 'Address2',
    colTextCity        : 'City',
    colTextState       : 'State',
    colTextZip         : 'Zip',
    colTextEmailAddress: 'Email Address',
    colTextHomePhone   : 'Home Phone',
    colTextWorkPhone   : 'Work Phone',

    getGrid: function() {
        return {
            columns: {
                items: [
                    { text: this.colTextFirstName, dataIndex: 'person_firstname' },
                    { text: this.colTextMiddleName, dataIndex: 'person_middlename' },
                    { text: this.colTextLastName, dataIndex: 'person_lastname' },
                    { text: this.colTextUsername, dataIndex: 'userprofile_username' },
                    { text: this.colTextUserGroup, dataIndex: 'role_name' },
                    { text: this.colTextAddress1, dataIndex: 'address_line1' },
                    { text: this.colTextAddress2, dataIndex: 'address_line2' },
                    { text: this.colTextCity, dataIndex: 'address_city' },
                    { text: this.colTextState, dataIndex: 'address_state' },
                    { text: this.colTextZip, dataIndex: 'address_zip' },
                    { text: this.colTextEmailAddress, dataIndex: 'email_address' },
                    { text: this.colTextHomePhone, dataIndex: 'home_phone_number' },
                    { text: this.colTextWorkPhone, dataIndex: 'work_phone_number' }
                ]
            }
        };
    }

});