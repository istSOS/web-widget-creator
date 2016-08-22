goog.provide("istsos.widget");
goog.provide("istsos.widget.Widget");

istsos.widget.TYPE_MAP = 'Map';
istsos.widget.TYPE_CHART = 'Chart';
istsos.widget.TYPE_BOX = 'Box';

istsos.widget.TYPES = {};

istsos.widget.TYPES[istsos.widget.TYPE_MAP] = {
    "description": "",
    "class": "istsos.widget.Map"
};

istsos.widget.TYPES[istsos.widget.TYPE_CHART] = {
    "description": "",
    "class": "istsos.widget.Chart"
};

istsos.widget.TYPES[istsos.widget.TYPE_BOX] = {
    "description": "",
    "class": "istsos.widget.Box"
};

/**
 * @param {String} dt1
 * @param {String} dt2
 * @returns {String}
 */
istsos.widget.newerDate = function(dt1, dt2) {
    var dateTime1 = new Date(dt1);
    var dateTime2 = new Date(dt2);
    
    if ((dateTime1.getTime() - dateTime2.getTime()) >= 0) {
        return dateTime1.toISOString();
    } else {
        return dateTime2.toISOString();
    }
};

/**
 * @param {String} dt1
 * @param {String} dt2
 * @returns {String}
 */
istsos.widget.olderDate = function(dt1, dt2) {
    var dateTime1 = new Date(dt1);
    var dateTime2 = new Date(dt2);
    if ((dateTime1.getTime() - dateTime2.getTime()) <= 0) {
        return dateTime1.toISOString();
    } else {
        return dateTime2.toISOString();
    }
};

/** istsos.widget.Map class */
/**
 * @constructor
 */
istsos.widget.Widget = function() {
    this.service = null;
    this.type = null;
    this.width = null;
    this.height = null;
    this.cssClass = null;
    this.elementId = null;

};

istsos.widget.Widget.prototype = {
    /**
     * @param {String} serviceName
     */
    setService: function(serviceName) {
        this.service = serviceName;
    },
    /**
     * @returns {String}
     */
    getService: function() {
        return this.service;
    },
    /**
     * @param {String} type
     */
    setType: function(type) {
        this.type = type;
    },
    /**
     * @returns {String}
     */
    getType: function() {
        return this.type;
    },
    /**
     * @param {String} id
     */
    setElementId: function(id) {
        this.elementId = id;
    },
    /**
     * @returns {String}
     */
    getElementId: function() {
        return this.elementId;
    },
    /**
     * @param {String} cssClass
     */
    setCssClass: function(cssClass) {
        this.cssClass = cssClass;
    },
    /**
     * @returns {String}
     */
    getCssClass: function() {
        return this.cssClass;
    },
    /**
     * @param {String} width
     */
    setWidth: function(width) {
        this.width = width;
    },
    /**
     * @returns {String}
     */
    getWidth: function() {
        return this.width;
    },
    /**
     * @param {String} height
     */
    setHeight: function(height) {
        this.height = height;
    },
    /**
     * @returns {String}
     */
    getHeight: function() {
        return this.height;
    },
    build: function() {
        throw "getWidget function shall be overwritten";
    },
    getConfig: function() {
        throw "getConfig function shall be overwritten";
    }
};

/**
 * @returns {String}
 */
istsos.widget.getCode = function(config) {
    return "<script src=\"http://localhost/web-widget-creator/src/compiled/istsos-widget.js\"></script>\n" +
        "<script>\n" +
        "istsos.widget.build(" + JSON.stringify(config) + ");\n" +
        "</script>";
};

/**
 * @param {istsos.widget.Map|istsos.widget.Chart|istsos.widget.Box} widget
 */
istsos.widget.updateData = function(widget) {
    if (widget.getType() === istsos.widget.TYPE_MAP) {

        var data = widget.getDataConfig();
        var serverUrl = data["server"];
        var serviceName = widget.getService();
        var offeringName = widget.getOffering();
        var proceduresList = widget.getProcedures();
        var propertyName = widget.getObservedProperty();

        /*FOR TESTING PURPOSES
        var p;
        if(document.getElementById(widget.getElementId()) !== null) {
            p = document.createElement('p');
            p.innerHTML = "UPDATE PROCESS...";
            document.getElementById(widget.getElementId()).appendChild(p);
            
        }
        */
        console.log("=========== MAP WIDGET - UPDATE ==========");
        data["data"].forEach(function (p) {
            console.log("PROCEDURE: " + p["name"]);
        });
        //DATABASE INSTANCE
        var db = new istsos.Database(data["db"]["dbname"], data["db"]["host"], data["db"]["user"], data["db"]["password"], data["db"]["port"]);

        //SERVER INSTANCE
        var server = new istsos.Server("", serverUrl, db);

        //SERVICE INSTANCE
        var service = new istsos.Service(serviceName, server);

        //OFFERING INSTANCE
        var off = new istsos.Offering(offeringName, "", true, "", service);

        //OBSERVED PROPERTY INSTANCE
        var op = [new istsos.ObservedProperty(service, propertyName, data["property"]["urn"], "lessThan", 9)];

        //PROCEDURES LIST OF INSTANCES - <istsos.Procedure> || <istsos.VirtualProcedure>
        var procs = [];
        data["data"].forEach(function(p) {
            if (p["type"] === "virtual") {
                procs.push(new istsos.VirtualProcedure(service, p["name"], "", "", "foi", 3857, 5, 5, 5, [], "virtual", "", "", {}));
            } else {
                procs.push(new istsos.Procedure(service, p["name"], "", "", "foi", 3857, 5, 5, 5, [], "insitu-fixed-point", ""));
            }
        });

        //EXTRACTING SAMPLING TIME FROM THE DATA COLLECTED BY CALLING getProcedures() ISTSOS-CORE LIBRARY METHOD
        service.getProcedures();
        istsos.once(istsos.events.EventType.PROCEDURES, function(evt) {
            var procedureObj = evt.getData();
            for (var p = 0; p < procedureObj.length; p++) {
                for (var dp = 0; dp < data["data"].length; dp++) {
                    if (procedureObj[p]["name"] === data["data"][dp]["name"]) {
                        data["data"][dp]["samplingTime"] = [moment(procedureObj[p]["samplingTime"]["beginposition"]).utc().format(), moment(procedureObj[p]["samplingTime"]["endposition"]).utc().format()]
                        break;
                    }
                }
            }

            //BEGIN SAMPLING TIME
            var begin = moment(data["data"][0]["samplingTime"][0]).utc().format();

            //END SAMPLING TIME
            var end = moment(data["data"][0]["samplingTime"][1]).utc().format();

            for (var t = 1; t < data["data"].length; t++) {
                begin = istsos.widget.olderDate(begin, data["data"][t]["samplingTime"][0]);
                end = istsos.widget.newerDate(end, data["data"][t]["samplingTime"][1]);
            }

            //GET OBSERVATIONS REQUEST FROM ISTSOS-CORE LIBRARY
            service.getObservations(off, procs, op, begin, end);
            istsos.once(istsos.events.EventType.GETOBSERVATIONS, function(evt) {
                var getPropertiesSpec = $.getJSON('specs/observed_property_spec.json', function(data) {});
                getPropertiesSpec.then(function(spec) {

                    var observations = evt.getData();
                    observations.forEach(function(obs) {
                        data["data"].forEach(function(dt) {
                            if (obs["name"] === dt["name"]) {
                                /* FOR TESTING PURPOSES
                                var obsRandom = (Math.random() * 100).toFixed(2);
                                var year = "20" + (Math.random() * 100).toFixed(0).toString();
                                var month = (Math.random() * 100).toFixed(0).toString();
                                var day = (Math.random() * 100).toFixed(0).toString();
                                var dateRandom = year + "-" + month + "-" + day + "T" + day + ":" + day + ":" + day + "+" + "000Z";
                                    dt["lastObs"] = obsRandom;                                 
                                    dt["lastDate"] = dateRandom;   
                                    */                                
                                dt["lastObs"] = obs["result"]["DataArray"]["values"][obs["result"]["DataArray"]["values"].length - 1][1];
                                dt["lastDate"] = obs["result"]["DataArray"]["values"][obs["result"]["DataArray"]["values"].length - 1][0];

                                spec[data["property"]["urn"]].forEach(function(s) {
                                    if (dt["lastObs"] >= s["from"] && dt["lastObs"] < s["to"]) {
                                        dt["imageSrc"] = s["url"];
                                    }
                                });
                            }
                        });
                    });

                    widget.setDataConfig(data);
                    var source = widget.getMap().getLayers().getArray()[1].getSource().getSource();
                    source.getFeatures().forEach(function(f) {
                        source.removeFeature(f);
                    });
                    data["data"].forEach(function(p) {
                        var feature = new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.transform(p["coords"], "EPSG:4326", "EPSG:3857")),
                            name: p["name"] + '\n\n\n\n\n\n' + parseFloat(p["lastObs"]).toFixed(2).toString() + data["property"]["uom"] + '\n' + 'DATE: ' + p["lastDate"].slice(0, 10) +
                                '\n' + 'TIME: ' + p["lastDate"].slice(11, 19) + ' (UTC)' + '&&' + p["imageSrc"]
                        });
                        source.addFeature(feature);
                    });

                    /* FOR TESTING PURPOSES
                    if(document.getElementById(widget.getElementId()) !== null) {
                        setTimeout(function() {
                            $('#' + widget.getElementId() + ">p").remove();
                        }, 1000);
                    }
                    */
                });
            });
        });
    } else if (widget.getType() === istsos.widget.TYPE_BOX) {
        var data = widget.getDataConfig();
        var serverUrl = data["server"];
        var serviceName = widget.getService();
        var offeringName = widget.getOffering();
        var procedure = widget.getProcedure();
        var properties = widget.getObservedProperties();
        var box = widget.getBox();
        
        /* FOR TESTING PURPOSES 
        var p;
        if(document.getElementById(widget.getElementId()) !== null) {
            p = document.createElement('p');
            p.innerHTML = "UPDATE PROCESS...";
            document.getElementById(widget.getElementId()).appendChild(p);   
        }
        */
        console.log("=========== BOX WIDGET - UPDATE ==========");
        data["data"].forEach(function (op) {
            console.log("PROPERTY: " + op["name"]);
        });

        //DATABASE INSTANCE
        var db = new istsos.Database(data["db"]["dbname"], data["db"]["host"], data["db"]["user"], data["db"]["password"], data["db"]["port"]);

        //SERVER INSTANCE
        var server = new istsos.Server("", serverUrl, db);

        //SERVICE INSTANCE
        var service = new istsos.Service(serviceName, server);

        //OFFERING INSTANCE
        var off = new istsos.Offering(offeringName, "", true, "", service);


        //PROCEDURE || VIRTUAL PROCEDURE INSTANCE
        var proc;
        if (data["procedure"]["type"] === "virtual") {
            proc = new istsos.VirtualProcedure(service, data["procedure"]["name"], "", "", "foi", 3857, 5, 5, 5, [], "virtual", "", "", {});
        } else {
            proc = new istsos.Procedure(service, data["procedure"]["name"], "", "", "foi", 3857, 5, 5, 5, [], "insitu-fixed-point", "");
        }

        //OBSERVED PROPERTIES LIST OF INSTANCES
        var props = []
        data["data"].forEach(function(prop) {
            props.push(new istsos.ObservedProperty(service, prop["name"], prop["urn"], "", "lessThan", 9));
        });

        //EXTRACTING SAMPLING TIME FROM THE DATA COLLECTED BY CALLING getProcedure() ISTSOS-CORE LIBRARY METHOD
        service.getProcedure(proc);
        istsos.once(istsos.events.EventType.PROCEDURE, function(evt) {
            var procedureObj = evt.getData()
            var interval = procedureObj["outputs"][0]["constraint"]["interval"];

            data["procedure"]["from"] = interval[0];
            data["procedure"]["to"] = interval[1];

            //BEGIN SAMPLING TIME
            var begin = moment(interval[0]).utc().format();

            //END SAMPLING TIME
            var end = moment(interval[1]).utc().format();

            //GET OBSERVATIONS REQUEST FROM ISTSOS-CORE LIBRARY
            service.getObservations(off, [proc], props, begin, end);
            istsos.once(istsos.events.EventType.GETOBSERVATIONS, function(evt) {
                var getPropertiesSpec = $.getJSON('specs/observed_property_spec.json', function(data) {});
                getPropertiesSpec.then(function(spec) {
                    var observations = evt.getData()[0]["result"]["DataArray"]["values"];
                    var lastObservations = observations[observations.length - 1];
                    var order = evt.getData()[0]["observedProperty"]["component"];

                    //UPDATING LAST OBSERVATION FOR EVERY OBSERVED PROPERTY
                    for (var i = 1; i < order.length; i += 2) {
                        var lastObs = lastObservations[i];
                        data["data"].forEach(function(op) {
                            if (op["urn"] === order[i]) {
                                /* FOR TESTING PURPOSES
                                    var obsRandom = (Math.random() * 100).toFixed(2);
                                    op["lastObs"] = obsRandom;                                  
                                */
    
                                op["lastObs"] = lastObs;

                            }
                        });
                    }

                    //UPDATING LAST DATE
                    var lastDate = lastObservations[0];
                    /* FOR TESTING PURPOSES
                        var year = "20" + (Math.random() * 100).toFixed(0).toString();
                        var month = (Math.random() * 100).toFixed(0).toString();
                        var day = (Math.random() * 100).toFixed(0).toString();
                        var dateRandom = year + "-" + month + "-" + day + "T" + day + ":" + day + ":" + day  + "+" + "000Z";                                 
                        data["lastDate"] = dateRandom;
                    */        
                    data["lastDate"] = lastDate;

                    //UPDATING ICON URL BASED ON VALUES
                    if (data["data"].length === 1) {
                        specData[data["data"][0]["urn"]].forEach(function(interval) {
                            var obs = parseFloat(data["data"][0]["lastObs"]);
                            if (obs >= interval["from"] && obs < interval["to"]) {
                                data["imageSrc"] = interval["url"];
                            }
                        });
                    } else {
                        /* FOR TESTING
                            data["imageSrc"] = "https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAeNAAAAJDdiNTVlZDA4LTMxMjctNGI1Mi1iZjVjLWJmODBkNmFiYjYyZA.jpg";
                        */
                        //DEFAULT ICON - ISTSOS LOGO
                        data["imageSrc"] = "https://live.osgeo.org/_images/logo-istsos6.png";
                    }

                    //SETTING THE UPDATED DATE AND TIME INTO THE BOX WIDGET
                    box.childNodes[0].childNodes[1].innerHTML = "DATE: <i>" + data["lastDate"].slice(0, 10) + "</i>"
                    box.childNodes[0].childNodes[2].innerHTML = "TIME: <i>" + data["lastDate"].slice(11, 19) + "</i>"

                    //SETTING THE UPDATED ICON URL INTO THE BOX WIDGET
                    console.log(data)
                    box.childNodes[1].childNodes[0].childNodes[0].setAttribute("src", data["imageSrc"])
                    
                    //SETTING THE UPDATED OBSERVATIONS INTO THE BOX WIDGET
                    var ulList = box.childNodes[1].childNodes[1].childNodes;
                    console.log(ulList);
                    for(var u = 0; u < ulList.length; u++) {
                        for (var l = 0; l < ulList[u].childNodes.length; l++) {
                            data["data"].forEach(function(op) {
                                if (ulList[u].childNodes[l].getAttribute("name") === op["name"]) {
                                    ulList[u].childNodes[l].innerHTML = op["showName"] + ": <i>" + parseFloat(op["lastObs"]).toFixed(2).toString() + " " + op["uom"] + "</i>";
                                }
                            })
                        }
                    }
                    if(document.getElementById(widget.getElementId()) !== null) {
                        setTimeout(function() {
                            $('#' + widget.getElementId() + ">p").remove();
                        }, 1000);
                    }

                });
            });
        });
    } else if (widget.getType() === istsos.widget.TYPE_CHART) {
        //...
    } else {
        console.log("Unsupported type of widget!!!")
    }
};

/**
 * @param {JSON} conf
 */
istsos.widget.build = function(conf) {
    var widget = null;
    switch (conf["type"]) {
        case istsos.widget.TYPE_MAP:
            widget = new istsos.widget.Map();
            widget.setElementId(conf["elementId"]);
            widget.setOffering(conf["offering"]);
            widget.setProcedures(conf["procedures"]);
            widget.setObservedProperty(conf["observedProperty"]);
            widget.setDataConfig(conf["dataConfig"]);
            widget.setAutoUpdate(conf["autoUpdate"]);
            break;
        case istsos.widget.TYPE_BOX:
            widget = new istsos.widget.Box();
            widget.setElementId(conf["elementId"]);
            widget.setOffering(conf["offering"]);
            widget.setProcedure(conf["procedure"]);
            widget.setObservedProperties(conf["observedProperties"]);
            widget.setDataConfig(conf["dataConfig"]);
            widget.setAutoUpdate(conf["autoUpdate"]);;
            widget.setLayout(conf["layout"]);
            break;
        case istsos.widget.TYPE_CHART:
            widget = new istsos.widget.Chart();
            widget.setElementId(conf["elementId"]);
            widget.setOffering(conf["offering"]);
            widget.setProcedures(conf["procedures"]);
            widget.setObservedProperties(conf["observedProperties"]);
            widget.setInterval(conf["interval"]);
            widget.setChartTypeConf(conf["chartTypeConf"]);
            break;
        default:
            // Draw the istSOS logo
            break;
    }
    widget.setService(conf["service"]);
    widget.setHeight(conf["height"]);
    widget.setWidth(conf["width"]);
    widget.setCssClass(conf["cssClass"]);
    widget.build();
};