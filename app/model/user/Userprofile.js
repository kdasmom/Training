/**
 * Model for a Userprofile
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Userprofile', {
    extend: 'Ext.data.Model',
    
    requires: [
        'NP.lib.core.Config',
        'NP.model.user.Userprofilerole',
        'NP.lib.data.JsonFlat'
    ],

    idProperty: 'userprofile_id',
    fields: [
        { name: 'userprofile_id', type: 'int' },
        { name: 'asp_client_id', type: 'int' },
        { name: 'userprofile_username' },
        { name: 'userprofile_status', defaultValue: 'active' },
        { name: 'userprofile_session' },
        { name: 'oracle_authentication' },
        { name: 'userprofile_startdate', type: 'date' },
        { name: 'userprofile_enddate', type: 'date' },
        { name: 'userprofile_password' },
        { name: 'userprofile_preferred_property', type: 'int' },
        { name: 'userprofile_default_dashboard', type: 'int' },
        { name: 'userprofile_splitscreen_size', type: 'int', defaultValue: 50 },
        { name: 'userprofile_splitscreen_isHorizontal', type: 'int', defaultValue: 0 },
        { name: 'userprofile_splitscreen_ImageOrder', type: 'int', defaultValue: 0 },
        { name: 'userprofile_splitscreen_LoadWithoutImage', type: 'int', defaultValue: 0 },
        { name: 'userprofile_preferred_region', type: 'int' },
        { name: 'userprofile_updated_by', type: 'int' },
        { name: 'userprofile_updated_datetm', type: 'date' },
        { name: 'security_question1', type: 'int' },
        { name: 'security_answer1' },
        { name: 'security_question2', type: 'int' },
        { name: 'security_answer2' },
        { name: 'security_question3', type: 'int' },
        { name: 'security_answer3' },
        { name: 'security_question4', type: 'int' },
        { name: 'security_answer4' },
        { name: 'security_question5', type: 'int' },
        { name: 'security_answer5' },
        { name: 'security_question6', type: 'int' },
        { name: 'security_answer6' },
        { name: 'userprofile_dashboard_layout' },

        // These fields are not DB columns in the USERPROFILE table
        { name: 'userprofilerole_id', type: 'int' },
        { name: 'role_id', type: 'int' },
        { name: 'role_name' },
        { name: 'staff_id', type: 'int' },
        { name: 'person_id', type: 'int' },
        { name: 'person_firstname' },
        { name: 'person_lastname' },
        { name: 'updated_by_userprofile_username' },
        { name: 'email_address' },

        // Calculated field that doesn't exist in the DB
        {
            name: 'display_name',
            convert: function(v, rec) {
                var fName = rec.get('person_firstname'),
                    lName = rec.get('person_lastname');

                if (fName !== null && lName !== null) {
                    return lName + ', ' + fName + ' (' + rec.get('userprofile_username') + ')';
                }
                
                return rec.get('userprofile_username');
            }
        }
    ]
});