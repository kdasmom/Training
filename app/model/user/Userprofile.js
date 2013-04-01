/**
 * Model for a Userprofile entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Userprofile', {
	extend: 'NP.lib.data.Model',
	
    idProperty: 'userprofile_id',
    fields: [
        { name: 'userprofile_id', type: 'int' },
        { name: 'userprofile_username', type: 'string' },
        { name: 'userprofile_preferred_property', type: 'int' },
        { name: 'userprofile_default_dashboard', type: 'int' },
        { name: 'userprofile_splitscreen_size', type: 'int' },
        { name: 'userprofile_splitscreen_ishorizontal', type: 'int' },
        { name: 'userprofile_splitscreen_imageorder', type: 'int' },
        { name: 'userprofile_splitscreen_loadwithoutimage', type: 'int' },
        { name: 'userprofile_preferred_region', type: 'int' },
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
        { name: 'security_answer6' }
	],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UserService',
			action: 'get'
		}
    }
});
