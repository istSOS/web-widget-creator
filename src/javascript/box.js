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
    this.verticalLayout = false;
    this.dataConfig = {};
    this.autoUpdate = {};


    istsos.widget.Widget.prototype.setType.call(this, istsos.widget.TYPE_BOX);

};
goog.inherits(istsos.widget.Box, istsos.widget.Widget);

istsos.widget.Box.prototype = {
    /**
     * @param {String} offering
     */
    setOffering: function(offering) {
        this.offering = offering;
    },
    /**
     * @returns {string}
     */
    getOffering: function() {
        return this.offering;
    },
    /**
     * @param {String} procedure
     */
    setProcedure: function(procedure) {
        this.procedure = procedure;
    },
    /**
     * @returns {string}
     */
    getProcedure: function() {
        return this.procedure;
    },
    /**
     * @param {String} observedProperty
     */
    addObservedProperty: function(observedProperty) {
        this.observedProperties.push(observedProperty);
    },
    /**
     * @param {Array<String>} observedPropertiesArray
     */
    setObservedProperties: function(observedPropertiesArray) {
        this.observedProperties = observedPropertiesArray;
    },
    /**
     * @returns {Array<String>}
     */
    getObservedProperties: function() {
        return this.observedProperties;
    },
    /**
     * @param {Boolean} check
     */
    setLayout: function(check) {
        this.verticalLayout = check;
    },
    /**
     * @returns {Boolean}
     */
    getLayout: function() {
        return this.verticalLayout;
    },
    /**
     * @param {JSON} dataConfig
     */
    setDataConfig: function(dataConfig) {
        this.dataConfig = dataConfig;
    },
    /**
     * @returns {JSON}
     */
    getDataConfig: function() {
        return this.dataConfig;
    },
    /**
     * @param {JSON} conf
     * @returns {string}
     */
    getCode: function(conf) {
        var boxCode = "<link rel=\"stylesheet\" href=\"http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n"
        var code = istsos.widget.getCode(conf);
        return boxCode + code;

    },
    /**
     * @description HTML ELEMENT CONTAINER
     * @param {Object} box
     */
    setBox: function(box) {
        this.box = box;
    },
    /**
     * @description HTML ELEMENT CONTAINER
     * @returns {Object}
     */
    getBox: function() {
        return this.box;
    },
    /**
     * @param {JSON} autoUpdateObj
     */
    setAutoUpdate: function(autoUpdateObj) {
        this.autoUpdate = autoUpdateObj;
    },
    /**
     * @returns {JSON}
     */
    getAutoUpdate: function() {
        return this.autoUpdate;
    },

    //INHERITED FROM istsos.widget.Widget CLASS
    /**
     * @param {String} serviceName
     */
    setService: function(serviceName) {
        istsos.widget.Widget.prototype.setService.call(this, serviceName);
    },
    /**
     * @returns {String}
     */
    getService: function() {
        return istsos.widget.Widget.prototype.getService.call(this);
    },
    /**
     * @param {String} height
     */
    setHeight: function(height) {
        istsos.widget.Widget.prototype.setHeight.call(this, height);
    },
    /**
     * @returns {String}
     */
    getHeight: function() {
        return istsos.widget.Widget.prototype.getHeight.call(this);
    },
    /**
     * @param {String} width
     */
    setWidth: function(width) {
        istsos.widget.Widget.prototype.setWidth.call(this, width);
    },
    /**
     * @returns {String}
     */
    getWidth: function() {
        return istsos.widget.Widget.prototype.getWidth.call(this);
    },
    /**
     * @param {String} cssClass
     */
    setCssClass: function(cssClass) {
        istsos.widget.Widget.prototype.setCssClass.call(this, cssClass);
    },
    /**
     * @returns {String}
     */
    getCssClass: function() {
        return istsos.widget.Widget.prototype.getCssClass.call(this);
    },
    /**
     * @param {String} type
     */
    setType: function(type) {
        this.type = istsos.widget.Widget.prototype.setType.call(this, type);
    },
    /**
     * @returns {String}
     */
    getType: function() {
        return istsos.widget.Widget.prototype.getType.call(this);
    },
    /**
     * @param {string} id
     */
    setElementId: function(id) {
        istsos.widget.Widget.prototype.setElementId.call(this, id);
    },
    /**
     * @returns {String}
     */
    getElementId: function() {
        return istsos.widget.Widget.prototype.getElementId.call(this);
    },

    //METHOD FOR BUILDING THE BOX WIDGET
    /**
     * @returns {istsos.widget.Box}
     */
    build: function() {
        var data = this.getDataConfig();

        //CREATE UNORDERED LIST CONTAINING PROPERTY NAME, LAST OBSERVATION AND UNIT OF MEASURE
        function createBoxContainer(data) {

            var ul = document.createElement('ul');
            ul.className = "list-group";
            ul.style.cssFloat = "left"
            for (var d = 0; d < data.length; d++) {
                var li = document.createElement('li');
                li.className = "list-group-item";
                li.style.margin = "2px 4px 2px 4px";
                li.innerHTML = data[d][0].split("&&")[0] + ": <i>" + data[d][1] + "</i>";
                li.setAttribute('name', data[d][0].split("&&")[1]);
                ul.appendChild(li);
            }
            return ul;
        }

        //BOX WIDGET CONTAINER DIV ELEMENT
        var container = document.createElement('div');
        container.className = "container";
        if (this.getWidth() !== "") {
            container.style.maxWidth = this.getWidth() + "px";
        } else {
            container.style.width = "auto"
        }
        if (this.getHeight() !== "") {
            container.style.minHeight = this.getHeight() + "px";
        } else {
            container.style.height = "auto";
        }
        container.style.background = "#DDDDDD";
        container.style.margin = "auto auto";
        container.style.borderRadius = "5px";

        //HEADER DIV ELEMENT CONTAINING PROCEDURE NAME, LAST OBSERVATION DATE AND TIME
        var header = document.createElement('div');
        header.className = "row text-center";
        header.style.background = "#008000";
        header.style.color = "white";
        header.style.padding = "4px";
        header.style.fontWeight = "bold";

        //PROCEDURE
        var procedureSpan = document.createElement('span')
        procedureSpan.className = "col-sm-4 col-xs-12";
        procedureSpan.innerHTML = "PROCEDURE: <i>" + this.getProcedure() + "</i>";

        //DATE
        var dateSpan = document.createElement('span')
        dateSpan.className = "col-sm-4 col-xs-12";
        dateSpan.innerHTML = "DATE: <i>" + data["lastDate"].slice(0, 10) + "</i>";

        //TIME
        var timeSpan = document.createElement('span')
        timeSpan.className = "col-sm-4 col-xs-12";
        timeSpan.innerHTML = "TIME: <i>" + data["lastDate"].slice(11, 19) + "</i>";

        //APPENDING HEADER CONTAINER TO BOX CONTAINER
        header.appendChild(procedureSpan);
        header.appendChild(dateSpan);
        header.appendChild(timeSpan);
        container.appendChild(header);

        //DATA DIV ELEMENT CONTAINING ICON AND OBSERVED PROPERTIES
        var dataDiv = document.createElement('div');
        dataDiv.className = "row";
        dataDiv.style.background = "#DDDDDD"

        var iconDiv = document.createElement('div');
        iconDiv.className = "col-sm-4 col-xs-12";
        iconDiv.style.padding = "10px";
        iconDiv.style.textAlign = "center";

        var img = document.createElement('img');
        img.setAttribute("src", data["imageSrc"]);
        img.setAttribute("height", "150");
        img.setAttribute("width", "150");
        iconDiv.appendChild(img);

        var propertiesDiv = document.createElement('div');
        propertiesDiv.className = "col-sm-8 col-xs-12";
        propertiesDiv.style.color = "#008000";

        //IF SELECTED LAYOUT IS VERTICAL
        if (this.getLayout() === true) {
            procedureSpan.className = "col-xs-12";
            dateSpan.className = "col-xs-12";
            timeSpan.className = "col-xs-12";
            iconDiv.className = "col-xs-12";
            propertiesDiv.className = "col-xs-12";
        }

        //APPENDING DATA CONTAINER TO BOX CONTAINER       
        dataDiv.appendChild(iconDiv);
        dataDiv.appendChild(propertiesDiv);
        container.appendChild(dataDiv)

        //INSERT DATA
        var lists = []
        var dataPairs = []
        for (var d = 0; d < data["data"].length; d++) {
            dataPairs.push([data["data"][d]["showName"] + "&&" + data["data"][d]["name"], parseFloat(data["data"][d]["lastObs"]).toFixed(2).toString() + " " + data["data"][d]["uom"]]);
            
            if (((d + 1) % 3 === 0) || d === (data["data"].length - 1)) {
                var ul = createBoxContainer(dataPairs);
                lists.push(ul);
                dataPairs = [];
            }

        }

        for (var list = 0; list < lists.length; list++) {
            if (lists[list].childNodes.length === 3) {
                var d = document.createElement('div');
                propertiesDiv.appendChild(lists[list]);
            }
        }

        for (var list = 0; list < lists.length; list++) {
            if (lists[list].childNodes.length === 2) {
                propertiesDiv.appendChild(lists[list]);
            }
        }

        for (var list = 0; list < lists.length; list++) {
            if (lists[list].childNodes.length === 1) {
                propertiesDiv.appendChild(lists[list]);
            }
        }
        if (document.getElementById(this.getElementId()) !== null) {
            document.getElementById(this.getElementId()).appendChild(container);
        }
        var preview = document.getElementById('preview');
        if (preview !== null) {
            preview.appendChild(container);
        }
        this.setBox(container);

        //DATA UPDATE (OBSERVATION, LAST DATE)
        if(document.getElementById('preview') === null) {          
            var widget = this;
            var updt = widget.getAutoUpdate();
            
            if(updt["checked"]) {
                var multiplier;
                switch(updt["unit"]) {
                    case "sec":
                        multiplier = 1000;
                        break;
                    case "min":
                        multiplier = 60000;
                        break;
                    case "hr":
                        multiplier = 3600000;
                        break;
                    default:
                        multiplier = 1000;
                        console.log("Multiplier set to 1000");
                        break;
                }
                setTimeout(function(){ 
                    istsos.widget.updateData(widget);
                    setInterval(function() {
                        istsos.widget.updateData(widget);
                    }, updt["interval"] * multiplier) 
                }, updt["delay"] * multiplier);
            }           
        }
        console.log(container)
        return this;
    },
    /**
     * @returns {JSON}
     */
    getConfig: function() {
        return {
            "service": this.service,
            "elementId": this.elementId,
            "type": this.type,
            "offering": this.offering,
            "procedure": this.procedure,
            "observedProperties": this.observedProperties,
            "width": this.width,
            "height": this.height,
            "cssClass": this.cssClass,
            "layout": this.vertical,
            "dataConfig": this.dataConfig,
            "autoUpdate": this.autoUpdate
        };
    }
};