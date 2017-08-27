import {Widget} from 'Widget';
import {WidgetTypes} from 'WidgetTypes';

export const Box = class Box extends Widget {
   constructor(options) {
      super(options);
      this.box = null;
      this.offering = options.offering || null;
      this.procedure = options.procedure || null;
      this.observedProperties = options.properties || [];
      this.dataConfig = options.data || null;
      this.verticalLayout = (options.layout == 'horizontal') ? false : true;
      this.autoUpdate = {
         active: options.auto_update,
         time_unit: options.time_unit || null,
         start_delay: options.start_delay || null,
         interval: options.interval || null
      };
      super.setType(WidgetTypes.TYPE_MAP);


      this.build = this.build.bind(this);
   }

   /**
    * @param {String} offering
    */
   setOffering(offering) {
      this.offering = offering;
   }

   /**
    * @returns {string}
    */
   getOffering() {
      return this.offering;
   }

   setBox(box) {
      this.box = box;
   }

   getBox() {
      return this.box;
   }

   /**
    * @param {Array<string>} proceduresList
    */
   setProcedure(procedure) {
      this.procedure = procedure;
   }

   /**
    * @returns {Array<String>}
    */
   getProcedure() {
      return this.procedure;
   }

   /**
    * @param {String} observedProperty
    */
   setObservedProperties(observedProperties) {
      this.observedProperties = observedProperties;
   }

   /**
    * @returns {String}
    */
   getObservedProperties() {
      return this.observedProperties;
   }


   /**
    * @param {JSON} dataConfig
    */
   setDataConfig(dataConfig) {
      this.dataConfig = dataConfig;
   }

   /**
    * @returns {JSON}
    */
   getDataConfig() {
      return this.dataConfig;
   }

   /**
    * @param {JSON} autoUpdateObj
    */
   setAutoUpdate(autoUpdateObj) {
      this.autoUpdate = autoUpdateObj;
   }

   /**
    * @returns {JSON}
    */
   getAutoUpdate() {
      return this.autoUpdate;
   }


   //INHERITED FROM istsos.widget.Widget CLASS
   /**
    * @param {String} serviceName
    */
   setService(serviceName) {
      super.setService(serviceName);
   }

   /**
    * @returns {String}
    */
   getService() {
      return super.getService();
   }

   /**
    * @param {String} height
    */
   setHeight(height) {
      super.setHeight(height);
   }

   /**
    * @returns {String}
    */
   getHeight() {
      return super.getHeight();
   }

   /**
    * @param {String} width
    */
   setWidth(width) {
      super.setWidth(width);
   }

   /**
    * @returns {String}
    */
   getWidth() {
      return super.getWidth();
   }

   /**
    * @param {String} cssClass
    */
   setCssClass(cssClass) {
      super.setCssClass(cssClass);
   }

   /**
    * @returns {String}
    */
   getCssClass() {
      return super.getCssClass();
   }

   /**
    * @param {String} type
    */
   setType(type) {
      this.type = super.setType(type);
   }

   /**
    * @returns {String}
    */
   getType() {
      return super.getType();
   }

   /**
    * @param {string} id
    */
   setElementId(id) {
      super.setElementId(id);
   }

   /**
    * @returns {String}
    */
   getElementId() {
      return super.getElementId();
   }

   /**
    * @returns {String}
    */
   getConfig() {
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

   build() {
      let data = this.getDataConfig();

      let container = document.createElement('div');
      container.className = 'container-fluid text-center';

      let headerRow = document.createElement('div');
      headerRow.className = 'row';
      headerRow.style.background = '#19B019';
      headerRow.style.color = 'white';

      let procedureName = document.createElement('div');
      procedureName.className = 'col-sm-3 text-center';
      procedureName.style.fontStyle = 'italic';
      procedureName.style.fontWeight = 'bold';
      procedureName.innerHTML = this.getProcedure();

      let date = document.createElement('div');
      date.className = 'col-sm-3 text-center';
      date.style.fontStyle = 'italic';
      date.innerHTML = 'DATE: ' + data[this.getProcedure()].lastObservation.date.slice(0, 10);

      let time = document.createElement('div');
      time.className = 'col-sm-3 text-center';
      time.style.fontStyle = 'italic';
      time.innerHTML = 'TIME: ' +  data[this.getProcedure()].lastObservation.date.slice(11, 19);

      let gmt = document.createElement('div');
      gmt.className = 'col-sm-3 text-center';
      gmt.style.fontStyle = 'italic';
      gmt.innerHTML = 'GMT ' + data[this.getProcedure()].lastObservation.date.slice(19, 22); 

      headerRow.appendChild(procedureName);
      headerRow.appendChild(date);
      headerRow.appendChild(time);
      headerRow.appendChild(gmt);

      let contentRow = document.createElement('div');
      contentRow.className = 'row';

      container.appendChild(headerRow);
      container.appendChild(contentRow);

      data[this.getProcedure()].observedSpec.forEach((property) => {
         console.log(property.display)
         let itemContainer = document.createElement('div');
         itemContainer.className = 'col-xs-12 col-sm-6 col-md-4 col-lg-4';
         itemContainer.style.padding = '5px';

         let img = document.createElement('img');
         img.style.maxWidth = '100px';
         img.style.maxHeight = '100px';
         img.setAttribute('src', 'https://live.osgeo.org/_images/logo-istsos.png');

         itemContainer.appendChild(img);

         let table = document.createElement('table');
         table.style.margin = 'auto auto';

         let tr = document.createElement('tr');
         
         let propertyCol = document.createElement('td');
         propertyCol.innerHTML = property.display + ': ';

         let valueCol = document.createElement('td');
         valueCol.innerHTML = 'test';

         tr.appendChild(propertyCol);
         tr.appendChild(valueCol);

         table.appendChild(tr);

         itemContainer.appendChild(table);

         contentRow.appendChild(itemContainer);
      });

      // var container = document.createElement('div');
      //   container.className = "container";
      //   if (this.getWidth() !== "") {
      //       container.style.maxWidth = this.getWidth() + "px";
      //   } else {
      //       container.style.width = "auto"
      //   }
      //   if (this.getHeight() !== "") {
      //       container.style.minHeight = this.getHeight() + "px";
      //   } else {
      //       container.style.height = "auto";
      //   }
      //   container.style.background = "#DDDDDD";
      //   container.style.margin = "auto auto";
      //   container.style.borderRadius = "5px";

      //   //HEADER DIV ELEMENT CONTAINING PROCEDURE NAME, LAST OBSERVATION DATE AND TIME
      //   var header = document.createElement('div');
      //   header.className = "row text-center";
      //   header.style.background = "#008000";
      //   header.style.color = "white";
      //   header.style.padding = "4px";
      //   header.style.fontWeight = "bold";

      //   //PROCEDURE
      //   var procedureSpan = document.createElement('span')
      //   procedureSpan.className = "col-sm-4 col-xs-12";
      //   procedureSpan.innerHTML = "PROCEDURE: <i>" + this.getProcedure() + "</i>";

      //   //DATE
      //   var dateSpan = document.createElement('span')
      //   dateSpan.className = "col-sm-4 col-xs-12";
      //   dateSpan.innerHTML = "DATE: <i>" + data["lastDate"].slice(0, 10) + "</i>";

      //   //TIME
      //   var timeSpan = document.createElement('span')
      //   timeSpan.className = "col-sm-4 col-xs-12";
      //   timeSpan.innerHTML = "TIME: <i>" + data["lastDate"].slice(11, 19) + "</i>";

      //   //APPENDING HEADER CONTAINER TO BOX CONTAINER
      //   header.appendChild(procedureSpan);
      //   header.appendChild(dateSpan);
      //   header.appendChild(timeSpan);
      //   container.appendChild(header);

      //   //DATA DIV ELEMENT CONTAINING ICON AND OBSERVED PROPERTIES
      //   var dataDiv = document.createElement('div');
      //   dataDiv.className = "row";
      //   dataDiv.style.background = "#DDDDDD"

      //   var iconDiv = document.createElement('div');
      //   iconDiv.className = "col-sm-4 col-xs-12";
      //   iconDiv.style.padding = "10px";
      //   iconDiv.style.textAlign = "center";

      //   var img = document.createElement('img');
      //   img.setAttribute("src", data["imageSrc"]);
      //   img.setAttribute("height", "150");
      //   img.setAttribute("width", "150");
      //   iconDiv.appendChild(img);

      //   var propertiesDiv = document.createElement('div');
      //   propertiesDiv.className = "col-sm-8 col-xs-12";
      //   propertiesDiv.style.color = "#008000";

      //   //IF SELECTED LAYOUT IS VERTICAL
      //   if (this.getLayout() === true) {
      //       procedureSpan.className = "col-xs-12";
      //       dateSpan.className = "col-xs-12";
      //       timeSpan.className = "col-xs-12";
      //       iconDiv.className = "col-xs-12";
      //       propertiesDiv.className = "col-xs-12";
      //   }

      //   //APPENDING DATA CONTAINER TO BOX CONTAINER       
      //   dataDiv.appendChild(iconDiv);
      //   dataDiv.appendChild(propertiesDiv);
      //   container.appendChild(dataDiv);
      
        if(document.getElementById(this.getElementId())) {
          document.getElementById(this.getElementId()).appendChild(container);
        }

        this.setBox(container);

        return this;
   }

};