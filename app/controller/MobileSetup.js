/**
 * @author Baranov A.V.
 * @date 9/30/13
 */


Ext.define('NP.controller.MobileSetup', {
    extend: 'NP.lib.core.AbstractController',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Net',
        'NP.lib.core.Util',
    ],

//  for localization
    saveSuccessText      : 'Your changes were saved.',
    deleteDialogTitleText: 'Delete mobile info?',
    deleteDialogText     : 'Are you sure you want to delete this mobile info?',
    deleteSuccessText    : 'Mobile info successfully deleted',
    deleteFailureText    : 'There was an error deleting the mobile info. Please try again.',
    errorDialogTitleText : 'Error',

    /**
     * Init
     */
    init: function(){

        var app = this.application;


    },

    /**
     * show budget overage grid
     */
    showMobileInfoGrid: function() {
        // Create the view
        var grid = this.setView('NP.view.mobileSetup.MobileGrid');

        // Load the store
        grid.reloadFirstPage();
    }
});
