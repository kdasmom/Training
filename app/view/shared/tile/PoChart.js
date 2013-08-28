/**
 * An abstract component for a tile component. It defines the API for creating new tiles
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.PoChart', function() {
	var data = [],
	p = (Math.random() * 11) + 1,
	i;
	var floor = 20;
	for (i = 0; i < 6; i++) {
		data.push({
			name: Ext.Date.monthNames[i % 12],
			data1: Math.floor(Math.max((Math.random() * 100), floor)),
			data2: Math.floor(Math.max((Math.random() * 100), floor)),
			data3: Math.floor(Math.max((Math.random() * 100), floor)),
			data4: Math.floor(Math.max((Math.random() * 100), floor)),
			data5: Math.floor(Math.max((Math.random() * 100), floor)),
			data6: Math.floor(Math.max((Math.random() * 100), floor)),
			data7: Math.floor(Math.max((Math.random() * 100), floor)),
			data8: Math.floor(Math.max((Math.random() * 100), floor)),
			data9: Math.floor(Math.max((Math.random() * 100), floor))
		});
	}

	data = Ext.create('Ext.data.JsonStore', {
		fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8', 'data9'],
		data: data
	});

	return {
		extend: 'NP.view.shared.tile.AbstractTile',
	    
	    getName: function() {
	    	return 'PO Chart';
	    },
	    
	    getPreview: function() {
	    	return {
	            xtype: 'chart',
	            animate: true,
	            store: data,
	            shadow: true,
	            legend: {
	                position: 'right'
	            },
	            insetPadding: 16,
	            theme: 'Base:gradients',
	            series: [{
	                type: 'pie',
	                field: 'data1',
	                showInLegend: true,
	                donut: false,
	                tips: {
	                  trackMouse: true,
	                  width: 140,
	                  height: 28,
	                  renderer: function(storeItem, item) {
	                    //calculate percentage.
	                    var total = 0;
	                    data.each(function(rec) {
	                        total += rec.get('data1');
	                    });
	                    this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
	                  }
	                },
	                highlight: {
	                  segment: {
	                    margin: 20
	                  }
	                },
	                label: {
	                    field: 'name',
	                    display: 'rotate',
	                    contrast: true,
	                    font: '12px Arial'
	                }
	            }]
	        };
	    },

	    getDashboardPanel: function() {
	    	return this.getPreview();
	    }
	}
});