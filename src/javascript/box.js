goog.provide("istsos.widget.Box");

goog.require("istsos.widget.Widget");

/** istsos.widget.Box class */
/**
 * @constructor
 */
istsos.widget.Box = function() {
    istsos.widget.Widget.call(this);
    this.box = null;
    this.offering = null;
    this.procedure = null;
    this.observedProperties = [];
    this.interval = null;
    this.vertical = false;

    istsos.widget.Widget.prototype.setType.call(this, istsos.widget.TYPE_BOX);

};
goog.inherits(istsos.widget.Box, istsos.widget.Widget);

istsos.widget.Box.prototype = {
    /**
     * INHERITED
     */
    setService: function(serviceName) {
        istsos.widget.Widget.prototype.setService.call(this, serviceName);
    },
    getService: function() {
        return istsos.widget.Widget.prototype.getService.call(this);
    },
    setHeight: function(height) {
        istsos.widget.Widget.prototype.setHeight.call(this, height);
    },
    setWidth: function(width) {
        istsos.widget.Widget.prototype.setWidth.call(this, width);
    },
    setCssClass: function(cssClass) {
        istsos.widget.Widget.prototype.setCssClass.call(this, cssClass);
    },
    getCssClass: function() {
        return istsos.widget.Widget.prototype.getCssClass.call(this);
    },
    /** -------------------------------------------------------------- */
    setElementId: function(id) {
        this.elementId = id;
    },
    getElementId: function() {
        return this.elementId;
    },
    setOffering: function(offering) {
        this.offering = offering;
    },
    getOffering: function() {
        return this.offering;
    },
    setProcedure: function(procedure) {
        this.procedure = procedure;
    },
    getProcedure: function() {
        return this.procedure;
    },
    addObservedProperty: function(observedProperty) {
        this.observedProperties.push(observedProperty);
    },
    setObservedProperties: function(observedPropertiesArray) {
        this.observedProperties = observedPropertiesArray;
    },
    getObservedProperties: function() {
        return this.observedProperties;
    },
    setInterval: function(interval) {
        this.interval = interval;
    },
    getInterval: function() {
        return this.interval;
    },
    setLayout: function(check) {
        this.vertical = check;
    },
    getLayout: function() {
        return this.vertical;
    },
    getCode: function(conf) {
        var boxCode = "<link rel=\"stylesheet\" href=\"http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n" 
        var code = istsos.widget.getCode(conf);
        return boxCode + code;

    },
    build: function() {
        //build box
        //...
        this.box = null;

        function createBoxContainer(data) {
            //UL ELEMENT
            var ul = document.createElement('ul');
            ul.className = "list-group";
            ul.style.cssFloat = "left"
            for (var d = 0; d < data.length; d++) {
                console.log(d);
                var li = document.createElement('li');
                li.className = "list-group-item";
                li.style.margin = "2px 4px 2px 4px";
                li.innerHTML = data[d][0] + ": <i>" + data[d][1] + "</i>";
                console.log(li.innerHTML);
                ul.appendChild(li);

            }
            return ul;
        }
        var preview = document.getElementById('preview');
        if (preview !== null) {
            document.getElementById('preview').innerHTML = "";
        }
        var widget = this;
        istsos.widget.SERVER_PROMISE.then(function(data) {
            var serverConf = data;
            var db = new istsos.Database(serverConf["db"]["dbname"], serverConf["db"]["host"], serverConf["db"]["user"], serverConf["db"]["password"],
                serverConf["db"]["port"]);
            var server = new istsos.Server(serverConf["name"], serverConf["url"], db);
            var service = new istsos.Service(widget.getService(), server);
            var off = new istsos.Offering(widget.getOffering(), "", true, "", service);
            var proc = new istsos.Procedure(service, widget.getProcedure(), "", "", "foi", 3857, 5, 5, 5, [], "insitu-fixed-point", "");
            var op_list = []; //FOR INSERTION
            var op_objects = [];
            for (var opv = 0; opv < widget.getObservedProperties().length; opv++) {
                var name = widget.getObservedProperties()[opv].split('&&')[0];
                var urn = widget.getObservedProperties()[opv].split('&&')[1]
                op_list.push(name);
                op_objects.push(new istsos.ObservedProperty(service, name, urn, "", "lessThan", 9));
            }
            //var beginTime = document.getElementById("procedure_list_box").getElementsByTagName('span')[0].getAttribute("name").split(',')[0];
            //var endTime = document.getElementById("procedure_list_box").getElementsByTagName('span')[0].getAttribute("name").split(',')[1];
            var beginTime = widget.getInterval()[0];
            var endTime = widget.getInterval()[1];
            service.getObservations(off, [proc], op_objects, beginTime, endTime);
            if (preview === null) {
                istsos.once(istsos.events.EventType.GETOBSERVATIONS, function(evt) {
                    boxBuilder(evt);
                });
            } else {
                istsos.once(istsos.events.EventType.GETOBSERVATIONS, function(evt) {
                    boxBuilder(evt);
                });
            }

            function boxBuilder(evt) {
                istsos.widget.OBSERVED_PROPERTIES_NAMES_PROMISE.then(function(evt_names) {


                    // DATA TO BE INSERTED
                    /* 
                {
                    "name": <observed property name>
                    "data": {
                        "date": <date&time of last observation>,
                        "value": <last observation value>,
                        "unit": <unit of measurement>
                    }
                }

                */
                    var dataObj = [];
                    var data = evt.getData()[0];
                    var observedProps = data["result"]["DataArray"]["field"];
                    var values = data["result"]["DataArray"]["values"];
                    var lastObs = values[values.length - 1];
                    for (var op = 1; op < observedProps.length; op += 2) {
                        var opname = evt_names[observedProps[op]["name"]];
                        var obj = {
                            "name": opname,
                            "data": {
                                "date": lastObs[0],
                                "value": lastObs[op],
                                "unit": observedProps[op]["uom"]
                            }
                        }
                        dataObj.push(obj);
                    }
                    var width_box = widget.width;
                    console.log(width_box)
                    var height_box = widget.height;
                    console.log(height_box)
                    //var vertical = document.getElementById('vertical').firstChild;


                    //CREATE BOX ELEMENTS
                    var container = document.createElement('div');
                    container.className = "container";
                    if (width_box !== "") {

                        container.style.maxWidth = width_box + "px";
                    } else {
                        container.style.width = "auto"
                    }
                    if (height_box !== "") {
                        container.style.minHeight = height_box + "px";
                    } else {
                        container.style.height = "auto";
                    }

                    container.style.background = "#DDDDDD";
                    container.style.margin = "auto auto";
                    container.style.borderRadius = "5px";

                    var header = document.createElement('div');
                    header.className = "row text-center";
                    header.style.background = "#008000";
                    header.style.color = "white";
                    header.style.padding = "4px";
                    header.style.fontWeight = "bold";
                    container.appendChild(header);
                    var procedureSpan = document.createElement('span')
                    procedureSpan.className = "col-sm-4 col-xs-12";
                    procedureSpan.innerHTML = "PROCEDURE: <i>" + widget.getProcedure() + "</i>";

                    var dateSpan = document.createElement('span')
                    dateSpan.className = "col-sm-4 col-xs-12";
                    dateSpan.innerHTML = "DATE: <i>" + dataObj[0]["data"]["date"].slice(0, 10) + "</i>";

                    var timeSpan = document.createElement('span')
                    timeSpan.className = "col-sm-4 col-xs-12";
                    timeSpan.innerHTML = "TIME: <i>" + dataObj[0]["data"]["date"].slice(11, 19) + "</i>";

                    header.appendChild(procedureSpan);
                    header.appendChild(dateSpan);
                    header.appendChild(timeSpan);


                    var data = document.createElement('div');
                    data.className = "row";
                    data.style.background = "#DDDDDD"
                    container.appendChild(data);

                    var iconDiv = document.createElement('div');
                    var img = document.createElement('img');
                    img.setAttribute("src", "http://lh3.ggpht.com/jgRxxSNZWjiG9pGQNIoE0F-9Xgn7BzvgeyCXb-55TnR7sixhfOsLStXcZLlMwPheaic");
                    img.setAttribute("height", "150");
                    img.setAttribute("width", "150");

                    iconDiv.className = "col-sm-4 col-xs-12";
                    iconDiv.appendChild(img);
                    iconDiv.style.padding = "10px";
                    iconDiv.style.textAlign = "center";
                    data.appendChild(iconDiv);

                    var propertiesDiv = document.createElement('div');
                    propertiesDiv.className = "col-sm-8 col-xs-12";
                    propertiesDiv.style.color = "#008000";
                    data.appendChild(propertiesDiv);

                    if (widget.getLayout() === true) {
                        procedureSpan.className = "col-xs-12";
                        dateSpan.className = "col-xs-12";
                        timeSpan.className = "col-xs-12";
                        iconDiv.className = "col-xs-12";
                        propertiesDiv.className = "col-xs-12";
                    }

                    var centerDiv = document.createElement('div');
                    centerDiv.style.width = "auto !important";
                    centerDiv.style.margin = "auto auto !important";
                    centerDiv.paddingTop = "10px !important";
                    propertiesDiv.appendChild(centerDiv);

                    //INSERT DATA
                    var dataPairs = []
                    var lists = []
                    for (var d = 0; d < dataObj.length; d++) {
                        dataPairs.push([dataObj[d]["name"], parseFloat(dataObj[d]["data"]["value"]).toFixed(2).toString() + " " + dataObj[d]["data"]["unit"]]);

                        if (((d + 1) % 3 === 0) || d === (dataObj.length - 1)) {
                            var ul = createBoxContainer(dataPairs);
                            lists.push(ul);
                            dataPairs = [];
                        }

                    }

                    for (var list = 0; list < lists.length; list++) {
                        if (lists[list].childNodes.length === 3) {
                            var d = document.createElement('div');
                            centerDiv.appendChild(lists[list]);
                        }
                    }

                    for (var list = 0; list < lists.length; list++) {
                        if (lists[list].childNodes.length === 2) {
                            centerDiv.appendChild(lists[list]);
                        }
                    }

                    for (var list = 0; list < lists.length; list++) {
                        if (lists[list].childNodes.length === 1) {
                            centerDiv.appendChild(lists[list]);
                        }
                    }
                    if (document.getElementById(widget.getElementId()) !== null) {
                        document.getElementById(widget.getElementId()).appendChild(container);
                    }

                    if (preview !== null) {
                        preview.appendChild(container);
                    }

                });

            }
        });
    },
    getConfig: function() {
        return {
            "service": this.service,
            "elementId": this.elementId,
            "type": this.type,
            "offering": this.offering,
            "procedure": this.procedure,
            "interval": this.interval,
            "observedProperties": this.observedProperties,
            "width": this.width,
            "height": this.height,
            "cssClass": this.cssClass,
            "layout": this.vertical

        };
    }

};