/**
 * Uploader component.
 * Uploadify is used as basis.
 * 
 * Component should be used as follows:
 *  Ext.create('NP.lib.ui.Uploader', {
 *      params: {
 *          form: {
 *              action:  <server side method>,
 *              service: <server side service>
 *          },
 *          files: {
 *              extensions: <list of acceptable file extensions>,
 *              description: <description of these file extensions>
 *          },
 *          service: <path to ajax server side script>
 *      }
 *  }).show();
 * 
 * All parameters(except params.form.action and params.form.service) are optional. 
 * Default values (look at parameters() method) will be set if parameters are not
 * passed.
 * 
 * Any form data which should be sent to the server could be set at params.form section.
 */
Ext.define('NP.lib.ui.Uploader', {
    extend: 'Ext.window.Window',
    alias:  'widget.uploader',

    /**
     * Set default values for all required parameters.
     */
    parameters: function() {
        this.params = this.params || {};

        this.params.form = this.params.form || {};
        this.params.files = this.params.files || {};
        this.params.service = this.params.service || 'ajax.php';
        this.params.listeners = this.params.listeners || {};

        this.params.files.extensions = this.params.files.extensions || '*.*';
        this.params.files.description = this.params.files.description || 'All files';
    },

    initComponent: function() {
        this.parameters();

        this.modal = true;
        this.title = 'Upload files';

        this.width = 600;
        this.height = 400;
        this.layout = 'fit';

        var self = this;

        this.items = [
            {
                xtype:  'panel',
                border: 0,
                layout: 'border',

                items: [
                    {
                        xtype:     'panel',
                        border:    0,
                        region:    'center',
                        overflowY: 'scroll',
                        html:      '<div id="uploadqueue"></div>'
                    },
                    {
                        xtype:  'panel',
                        layout: 'border',
                        border: 0,
                        region: 'south',
                        height: 45,

                        items: [
                            {
                                xtype:  'panel',
                                border: 0,
                                region: 'center',
                                //html:   '<button id="file_upload" />'
                                html: '<input id="file_upload" type="file" name="file_upload" />'
                            },
                            {
                                xtype:  'panel',
                                border: 0,
                                region: 'east',
                                width:   300,
                                bodyStyle: 'text-align: center',

                                items:[
                                    {
                                        xtype: 'button',
                                        text:  'Upload Files',
                                        width: 120,
                                        height: 30,

                                        handler: function(){
                                            // Uploadify will pass all data from params.form
                                            // and all selected files to the server.
                                            if (self.isUploadifiveSupported()) {
                                                $('#file_upload').uploadifive('upload');
                                            } else {
                                                $('#file_upload').uploadify('upload', '*');
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        this.listeners = this.params.listeners;

        var self = this;
        this.listeners.afterrender = function(){
            if (this.isUploadifiveSupported()) {
                $("#file_upload").uploadifive({
                    auto:   false,
                    dnd:    true,
                    multi:  true,

                    queueID:    'uploadqueue',

                    onQueueComplete: function(uploads) {
                        self.params.listeners.onUploadComplete(uploads);
                    },

                    uploadScript:   this.params.service,
                    formData:       this.params.form,
                    simUploadLimit: 25
                });
            } else {
                // After component is displayed, uploadify should be notified what field it
                // should use for file selection
                $("#file_upload").uploadify({
                    height: 30,
                    width:  120,

                    auto:       false,
                    multi:      true,
                    queueID:    'uploadqueue',
                    swf:        '/vendor/jquery-uploadify/uploadify.swf',

                    onQueueComplete: function(uploads) {
                        self.params.listeners.onUploadComplete(uploads);
                    },

                    uploader:       this.params.service,
                    fileTypeExts:   this.params.files.extensions,
                    fileTypeDesc:   this.params.files.description,
                    formData:       this.params.form,
                    simUploadLimit: 25
                });
            }
        };

        this.callParent(arguments);
    },

    isUploadifiveSupported: function() {
        return window.File && window.FileReader && window.FileList && window.Blob;
    }
});