goog.provide("istsos.widget.Box");

goog.require("istsos.widget.Widget");

/** istsos.widget.Box class */
/**
 * @constructor
 */
istsos.widget.Box = function() {
    istsos.widget.Widget.call(this);
    this.elementId = null;
    this.box = null;
    this.procedure = null;
    this.observedProperties = [];

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
    build: function() {
        //build box
        //...
        this.box = null;
        function createBoxTable(data) {
            //TABLE ELEMENT
            var table = document.createElement('table');
            table.className = "table table-responsive text-left pull-md-left ";
            table.style.color = "#175D7D";
            table.style.cssFloat = 'left';

            // FIRST ROW ELEMENT
            var first_row = document.createElement('tr');
            var first_op = document.createElement('td');
            var first_val = document.createElement('td');

            //SECOND ROW ELEMENT
            var second_row = document.createElement('tr');
            var second_op = document.createElement('td');
            var second_val = document.createElement('td');

            //THIRD ROW ELEMENT
            var third_row = document.createElement('tr');
            var third_op = document.createElement('td');
            var third_val = document.createElement('td');

            //INSERT DATA
            for (var d = 0; d < data.length; d++) {
                if(d === 0) {
                    first_op.innerHTML = data[d][0] + ": ";
                    first_val.innerHTML = data[d][1];
                }
                if(d === 1) {
                    second_op.innerHTML = data[d][0] + ": ";
                    second_val.innerHTML = data[d][1];
                }
                if(d === 2) {
                    third_op.innerHTML = data[d][0] + ": ";
                    third_val.innerHTML = data[d][1];
                }
            }

            //PARENT-CHILD MANAGEMENT
            table.appendChild(first_row);
            table.appendChild(second_row);
            table.appendChild(third_row);

            first_row.appendChild(first_op);
            first_row.appendChild(first_val);

            second_row.appendChild(second_op);
            second_row.appendChild(second_val);

            third_row.appendChild(third_op);
            third_row.appendChild(third_val);

            return table;
        }
        var preview = document.getElementById('preview');
        if (preview !== null) {
            document.getElementById('preview').innerHTML = "";
        }
        var widget = this;
        istsos.widget.SERVER_PROMISE.done(function(data) {
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
                op_objects.push(new istsos.ObservedProperty(service, name, urn, "", null, null));
            }
            var beginTime = document.getElementById("procedure_list_box").getElementsByTagName('span')[0].getAttribute("name").split(',')[0];
            var endTime = document.getElementById("procedure_list_box").getElementsByTagName('span')[0].getAttribute("name").split(',')[1];
            console.log(proc);
            service.getObservations(off, [proc], op_objects, beginTime, endTime);
            istsos.once(istsos.events.EventType.GETOBSERVATIONS, function(evt) {
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
                    var opname = observedProps[op]["name"]
                    var obj = {
                        "name" : opname,
                        "data" : {
                                "date": lastObs[0],
                                "value": lastObs[op],
                                "unit": observedProps[op]["uom"]
                            }}
                    dataObj.push(obj);
                }

                //CREATE BOX ELEMENTS
                var container = document.createElement('div');
                container.style.background = "white";
                container.style.color = "#175D7D";

                var header = document.createElement('div');
                header.className = "row";
                header.style.border = "1px solid #175D7D"
                container.appendChild(header);

                var procedureDiv = document.createElement('div')
                procedureDiv.className = "col-sm-4";
                procedureDiv.innerHTML = widget.getProcedure();

                var dateDiv = document.createElement('div')
                dateDiv.className = "col-sm-4";
                dateDiv.innerHTML = dataObj[0]["data"]["date"].slice(0, 11);

                var timeDiv = document.createElement('div')
                timeDiv.className = "col-sm-4";
                timeDiv.innerHTML = dataObj[0]["data"]["date"].slice(11, 19);

                header.appendChild(procedureDiv);
                header.appendChild(dateDiv);
                header.appendChild(timeDiv);


                var data = document.createElement('div');
                data.className = "row";
                container.appendChild(data);

                var iconDiv = document.createElement('div');
                iconDiv.className = "col-sm-4";
                iconDiv.innerHTML = "ICON. ICON. ICON. ICON. \nICON. ICON. ICON. ICON.";
                data.appendChild(iconDiv);

                var propertiesDiv = document.createElement('div');
                propertiesDiv.className = "col-sm-8";
                propertiesDiv.style.borderLeft = "1px solid #175D7D";
                data.appendChild(propertiesDiv);

                //INSERT DATA
                var dataPairs = []
                for (var d = 0; d < dataObj.length; d++) {
                    dataPairs.push([dataObj[d]["name"], parseFloat(dataObj[d]["data"]["value"]).toFixed(2).toString() + " " + dataObj[d]["data"]["unit"]]);
                    if(d % 3 === 0 || d === dataObj.length - 1) {
                        var table = createBoxTable(dataPairs);
                        propertiesDiv.appendChild(table);
                        dataPairs = [];
                    }

                }

                preview.appendChild(container);

                
            });

            


        });


    },
    getConfig: function() {
        return {
            "service": this.service,
            "elementId": this.elementId,
            "type": this.type,
            "procedure": this.procedure,
            "observedProperties": this.observedProperties,
            "width": this.width,
            "height": this.height,
            "cssClass": this.cssClass
        };
    }

};