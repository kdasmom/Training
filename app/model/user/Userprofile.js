/**
 * Model for a Userprofile
 *
 * @author 
 */
Ext.define('NP.model.user.Userprofile', {
    extend: 'NP.lib.data.Model',
    
    requires: ['NP.lib.core.Config'],

    idProperty: 'userprofile_id',
    fields: [
        { name: 'userprofile_id', type: 'int' },
        { name: 'asp_client_id', type: 'int' },
        { name: 'userprofile_username' },
        { name: 'userprofile_status' },
        { name: 'userprofile_session' },
        { name: 'oracle_authentication' },
        { name: 'userprofile_startdate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
        { name: 'userprofile_enddate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
        { name: 'userprofile_password' },
        { name: 'userprofile_preferred_property', type: 'int' },
        { name: 'userprofile_default_dashboard', type: 'int' },
        { name: 'userprofile_splitscreen_size', type: 'int' },
        { name: 'userprofile_splitscreen_isHorizontal', type: 'int' },
        { name: 'userprofile_splitscreen_ImageOrder', type: 'int' },
        { name: 'userprofile_splitscreen_LoadWithoutImage', type: 'int' },
        { name: 'userprofile_ADguid' },
        { name: 'userprofile_preferred_region', type: 'int' },
        { name: 'userprofile_updated_by', type: 'int' },
        { name: 'userprofile_updated_datetm', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
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

    validations: [
        { field: 'userprofile_id', type: 'presence' },
        { field: 'asp_client_id', type: 'presence' },
        { field: 'userprofile_username', type: 'length', max: 50 },
        { field: 'userprofile_status', type: 'length', max: 50 },
        { field: 'userprofile_session', type: 'length', max: 100 },
        { field: 'oracle_authentication', type: 'length', max: 1 },
        { field: 'userprofile_password', type: 'length', max: 256 },
        { field: 'userprofile_password', type: 'password' },
        { field: 'userprofile_ADguid', type: 'length', max: 255 },
        { field: 'security_answer1', type: 'length', max: 100 },
        { field: 'security_answer2', type: 'length', max: 100 },
        { field: 'security_answer3', type: 'length', max: 100 },
        { field: 'security_answer4', type: 'length', max: 100 },
        { field: 'security_answer5', type: 'length', max: 100 },
        { field: 'security_answer6', type: 'length', max: 600 }
    ],

    /**
     * Custom validation function for Userprofile
     * @return {Ext.data.Errors}
     */
    validate: function() {
        // Call the default validator
        var errors = this.callParent(arguments);

        // Validate that either none or all security questions are filled
        var blank = [];
        
        for (var i=1; i<=6; i++) {
            var questionField = 'security_question'+i;
            var answerField = 'security_answer'+i;
            var question = this.get(questionField);
            var answer = this.get(answerField);
            
            if (question == null || question == '') {
                blank.push(questionField);
            }
            if (answer == '') {
                blank.push(answerField);
            }
        }

        if (blank.length > 0 && blank.length != 12) {
            Ext.each(blank, function(item) {
                errors.add({
                    field: item,
                    message: 'All security questions and answers must be filled out'
                });
            });
        }
        
        return errors;
    }
});