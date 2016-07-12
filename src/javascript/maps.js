$(document).ready(function () {
    $('#all_sensors').click(function () {
        //cleaner function
        var istsosContainer = new istsos.IstSOS();
        var db = new istsos.Database('istsos', 'localhost', 'postgres', 'postgres', 5432);
        var server = new istsos.Server('istsos', 'http://istsos.org/istsos/', db);
        var c = document.getElementById('service_list').children;
        for (i = 0; i < c.length; i++) {
            new istsos.Service(c[i].innerHTML, server);

        }
        var services = server.getServicesProperty();
        services[0].getFeatureCollection(3857);
        istsos.on(istsos.events.EventType.GEOJSON, function (evt) {
            $('#generate_map').click(function () {
                document.getElementById('preview_container').innerHTML = '';
                document.getElementById('code_container').innerHTML = '';
                var geo = evt.getData()["features"];
                var centerX = 0;
                var centerY = 0;
                var points = [];
                var pointsParam = [];
                geo.forEach(function(f) {
                    centerX += f["geometry"]["coordinates"][0];
                    centerY += f["geometry"]["coordinates"][1];
                    pointsParam.push(f["geometry"]["coordinates"][0]);
                    pointsParam.push(f["geometry"]["coordinates"][1]);
                    points.push(new ol.Feature({geometry: new ol.geom.Point([f["geometry"]["coordinates"][0],f["geometry"]["coordinates"][1]])}))
                });
                centerX = centerX/geo.length;
                centerY = centerY/geo.length;
                var map = new ol.Map({
                    target: 'preview_container',
                    layers: [new ol.layer.Tile({
                        'source': new ol.source.OSM()
                    })],
                    view: new ol.View({
                        center: [centerX, centerY]
                    })
                });
                var point_source = new ol.source.Vector({
                    features: new ol.Collection(points)
                });

                var cluster_source = new ol.source.Cluster({
                    distance: 40,
                    source: point_source
                });
                var feat_color = document.getElementById('color').value;
                var styleCache = {};
                var point_layer = new ol.layer.Vector({
                    source: cluster_source,
                    style: function(feature) {
                        var size = feature.get('features').length;
                        var style = styleCache[size];
                        if (!style) {
                            style = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 13,
                                    stroke: new ol.style.Stroke({
                                        color: feat_color
                                    }),
                                    fill: new ol.style.Fill({
                                        color: feat_color
                                    })
                                }),
                                text: new ol.style.Text({
                                    text: size.toString(),
                                    fill: new ol.style.Fill({
                                        color: 'white'
                                    }),
                                    font: '12px Montserrat'
                                })
                            });
                            styleCache[size] = style;
                        }
                        return style;
                    }
                });

                map.addLayer(point_layer);
                var extent = point_source.getExtent();
                map.getView().fit(extent, map.getSize());

                var map_height = document.getElementById('map_height').value;
                var map_width = document.getElementById('map_width').value;
                var h5 = document.createElement('h5');
                h5.innerHTML = 'EMBEDDED CODE';
                h5.style.color='white';
                h5.style.backgroundColor = '#175D7D';
                h5.style.textAlign = 'center';
                h5.style.padding = '5px';
                h5.style.borderRadius = '5px';
                var code_text = document.createTextNode('<iframe src="http://localhost:63342/web-widget-creator/widget.html?map=all&centerX=' + centerX +
                '&centerY=' + centerY + '&points=' + pointsParam.toString() + '&color=' + feat_color.substring(1) +
                '&height=' + map_height + '&width=' + map_width + '" height=' + map_height + ' width=' + map_width
                + 'sandbox="allow-same-origin allow-scripts"></iframe>');
                document.getElementById('code_container').appendChild(h5);
                document.getElementById('code_container').appendChild(code_text);
                $('#code_container').fadeIn('fast');


            });

        });


    });
});