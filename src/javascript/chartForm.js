$(document).ready(function() {

    //SETTING THE CHART TYPE LIST WITH CORESPONDING ATTRIBUTES BASED ON JSON SPECIFICATION
    var chartTypesObj = null;
    var getChartTypes = $.getJSON('specs/chart_types.json', function(data) {});
    getChartTypes.then(function(data) {
        chartTypesObj = data;
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select chart type --'; 
        document.getElementById('chart_type').appendChild(defaultOption);
        for (var key in chartTypesObj["chart-types-attr"]) {
            var option = document.createElement('option');
            option.innerHTML = key;
            document.getElementById('chart_type').appendChild(option);
        }
    });

    //GENERATING LIST OF SERVICES RELATED TO THE SERVER SPECIFIED IN server_config.json
    var server;
    var serverUrl;
    var getServerJSON = $.getJSON('specs/server_config.json', function(data) {});
    getServerJSON.then(function(data) {
        document.getElementById('preview').innerHTML = "";
        var serverConf = data;
        var db = new istsos.Database(serverConf["db"]["dbname"], serverConf["db"]["host"], serverConf["db"]["user"], serverConf["db"]["password"],
            serverConf["db"]["port"]);
        server = new istsos.Server(serverConf["name"], serverConf["url"], db);
        serverUrl = serverConf["url"];
        
        //SETTING DEFAULT OPTION FOR THE LIST OF SERVICES
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select service --';
        document.getElementById('service_list_chart').appendChild(defaultOption);

        //GETTING SERVICES USING THE METHOD FROM ISTSOS-CORE LIBRARY
        server.getServices();
        istsos.once(istsos.events.EventType.SERVICES, function(evt) {
            var services_obj = evt.getData();
            for (var i = 0; i < services_obj.length; i++) {
                var option = document.createElement('option');
                option.innerHTML = services_obj[i]["service"];
                document.getElementById('service_list_chart').appendChild(option);
            }
        });
    });

    //GETTING THE LIST OF OFFERINGS BASED ON SELECTED SERVICE
    var serviceName;
    $('#service_list_chart').change(function(evt) {
        document.getElementById('service_list_chart').setAttribute('value', evt.target.value);
        document.getElementById('procedure_list_chart').innerHTML = '<hr/>'
        var service = null;
        serviceName = evt.target.value;
        if (serviceName && serviceName !== "") {
            service = new istsos.Service(serviceName, server);

            //GETTING OFFERINGS USING THE METHOD FROM THE ISTSOS-CORE LIBRARY
            service.getOfferingNames();
            istsos.once(istsos.events.EventType.OFFERING_NAMES, function(evt) {
                document.getElementById('offering_list_chart').innerHTML = "";
                var offering_obj = evt.getData();

                //SETTING DEFAULT OPTION FOR THE LIST OF OFFERINGS
                var defaultOption = document.createElement('option');
                defaultOption.setAttribute('disabled', '');
                defaultOption.setAttribute('selected', '');
                defaultOption.setAttribute('value', '');
                defaultOption.innerHTML = '-- select offering --';
                document.getElementById('offering_list_chart').appendChild(defaultOption);

                //ADDING THE LIST OF OFFERINGS
                for (var i = 0; i < offering_obj.length; i++) {
                    var option = document.createElement('option');
                    option.innerHTML = offering_obj[i]["name"];
                    document.getElementById('offering_list_chart').appendChild(option);
                }
            });
        }
    });

    //GETTING THE LIST OF MEMBER PROCEDURES BASED ON SELECTED OFFERING
    $('#offering_list_chart').change(function(evt) {
        var offering = null;
        var service = new istsos.Service(serviceName, server);
        document.getElementById('op_list_map').innerHTML = '<option>-</option>';
        document.getElementById('offering_list_chart').setAttribute("value", evt.target.value);
        offering = new istsos.Offering(evt.target.value, "", true, "", service);

        //GETTING MEMBER PROCEDURES USING THE METHOD FROM THE ISTSOS-CORE LIBRARY
        offering.getMemberProcedures();
        istsos.once(istsos.events.EventType.MEMBERLIST, function(evt) {
            document.getElementById('procedure_list_chart').innerHTML = "";
            var member_obj = evt.getData();
            console.log(member_obj);

            //ADDING THE LIST OF PROCEDURE CHECKBOXES
            for (var i = 0; i < member_obj.length; i++) {
                var label = document.createElement('label');
                var br = document.createElement('br');
                var input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                label.appendChild(input);
                label.innerHTML += '&nbsp;&nbsp;' + member_obj[i]["name"];
                document.getElementById('procedure_list_chart').appendChild(label);
                document.getElementById('procedure_list_chart').appendChild(br);
            }
        });
    });

    //GETTING THE LIST OF OBSERVED PROPERTIES BASED ON SELECTED PROCEDURE
    var interval = [];
    $('#procedure_list_chart').change(function(evt) {
        var op_list_chart = document.getElementById('op_list_chart');
        op_list_chart.innerHTML = "";
        var checkedList = [];
        var observedPropertiesList = [];
        $('#procedure_list_chart label').children().each(function() {
            if (this.checked) {
                checkedList.push(this.parentNode.innerText.trim());
            } else {
                checkedList.splice($('#procedure_list_chart label').children().index(this), 1);
            }
        });
        $('#procedure_list_chart').attr("value", checkedList);
        var service = new istsos.Service(serviceName, server);

        //GETTING PROCEDURES USING THE METHOD FROM THE ISTSOS-CORE LIBRARY - EXTRACTING SAMPLING TIME FOR SELECTED PROCEDURES
        service.getProcedures();
        istsos.once(istsos.events.EventType.PROCEDURES, function(evt) {
            var procedure_obj = evt.getData();
            var samplingObjList = []

            for (var j = 0; j < procedure_obj.length; j++) {
                if (checkedList.indexOf(procedure_obj[j]["name"]) !== -1) {
                    observedPropertiesList.push(procedure_obj[j]["observedproperties"]);
                    samplingObjList.push(procedure_obj[j]["samplingTime"]);
                }
            }

            var from = null;
            var to = null;
            for (var s = 0; s < samplingObjList.length; s++) {
            	if(s === 0) {
                    	from = moment(samplingObjList[s]["beginposition"]).utc().format();
                    	to = moment(samplingObjList[s]["endposition"]).utc().format();
                    	console.log("FIRST:",from,to)
                    } else {
                    	from = istsos.widget.olderDate(from, samplingObjList[s]["beginposition"]);
                    	to = istsos.widget.newerDate(to, samplingObjList[s]["endposition"]);
                    	console.log("OTHER",from,to)
                    }
            }
            interval = [from,to];
/*
            //ADDING MIN/MAX CONSTRAINT TO THE DATEPICKER FIELDS
            $('#beginTimePicker').data("DateTimePicker").minDate(interval[0]);
            $('#beginTimePicker').data("DateTimePicker").maxDate(interval[1]);
            $('#beginTimePicker').data("DateTimePicker").date(interval[0]);
            $('#endTimePicker').data("DateTimePicker").minDate(interval[0]);
            $('#endTimePicker').data("DateTimePicker").maxDate(interval[1]);
            $('#endTimePicker').data("DateTimePicker").date(interval[1]);
            */
            //DISPLAY ONLY OBSERVED PROPERTIES CHECKBOXES THAT ARE IN COMMON TO SELECTED PROCEDURES
            var result = [];
            var names = [];
            var final = [];
            if (observedPropertiesList.length === 1) {
                for (var opl = 0; opl < observedPropertiesList[0].length; opl++) {
                    var label = document.createElement('label');
                    var br = document.createElement('br');
                    var input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    label.appendChild(input);
                    label.innerHTML += '&nbsp;&nbsp;' + observedPropertiesList[0][opl]["name"];
                    document.getElementById('op_list_chart').appendChild(label);
                    document.getElementById('op_list_chart').appendChild(br);
                }
            } else {
                for (var isct = 0; isct < observedPropertiesList.length; isct++) {
                    result = result.concat(observedPropertiesList[isct]);
                }
                for (var r = 0; r < result.length; r++) {
                    var count = 0;
                    for (var ag = 0; ag < result.length; ag++) {
                        if (result[r]["name"] === result[ag]["name"]) {

                            count += 1;
                        }
                    }
                    if (count === checkedList.length) {
                        names.push(result[r]["name"]);
                    }
                }
            }
            for (var i = 0, n = names.length; i < n; i++) {
                if (final.indexOf(names[i]) == -1)
                    final.push(names[i]);
            }

            for (var fopl = 0; fopl < final.length; fopl++) {
                console.log(final[fopl]);
                var label = document.createElement('label');
                var br = document.createElement('br');
                var input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                label.appendChild(input);
                label.innerHTML += '&nbsp;&nbsp;' + final[fopl];
                document.getElementById('op_list_chart').appendChild(label);
                document.getElementById('op_list_chart').appendChild(br);
            }
        });
    });
	
    // ADDING/REMOVING OBSERVED PROPERTIES NAMES BASED ON SELECTED CHECKED INPUTS AND ADDING THEM TO THE VALUE ATTRIBUTE - FOR LATER USE
	$('#op_list_chart').change(function(evt){
		obList = [];
        $('#op_list_chart label').children().each(function() {
            var val = this.parentNode.innerText.trim(); 
            if (this.checked) {
                obList.push(val);
            } else {
                $.grep(obList, function(value) {
                    return value != val;
                });
            }
        });

        $('#op_list_chart').attr('value', obList);
        console.log($('#op_list_chart').attr('value'))
	});

    //DYNAMIC CREATION OF CHART ATTRIBUTE FIELDS BASED ON JSON SPECIFICATION
	var selectedChartType = null;
    $('#chart_type').change(function(evt) {
    	selectedChartType = evt.target.value;
    	var chart_settings = document.getElementById('chart_settings');
    	while (chart_settings.childNodes.length > 2) {
            chart_settings.removeChild(chart_settings.lastChild);
        }
    	var attributes = chartTypesObj["chart-types-attr"][evt.target.value];
        for(var a in attributes) {
        	var container = document.createElement('div');
        	container.className = "form-group";

        	var label = document.createElement('label');
        	label.setAttribute("for", attributes[a]);
        	label.className = "col-sm-8 control-label";
        	label.innerText = attributes[a] + ":";

        	var inputDiv = document.createElement('div');
        	inputDiv.className = "col-sm-4";

        	var input = document.createElement('input');
        	input.setAttribute('type', 'text');
        	input.setAttribute('id', evt.target.value + "-" + attributes[a]);
        	input.className = "form-control";

        	inputDiv.appendChild(input);

        	container.appendChild(label);
        	container.appendChild(inputDiv);

        	chart_settings.appendChild(container);
        } 
    });

    $('#generate_chart').click(function() {
        var preview = document.getElementById('preview');
        preview.innerHTML = "";
        var newChart = new istsos.widget.Chart();
        newChart.setService($('#service_list_chart').attr("value"));
        newChart.setOffering($('#offering_list_chart').attr("value"));
        newChart.setProcedures($('#procedure_list_chart').attr("value"));
        newChart.setObservedProperties($('#op_list_chart').attr("value").split(','));
        var begin = moment(new Date($('#beginTime').val())).format().slice(0,19);
        var end = moment(new Date($('#endTime').val())).format().slice(0,19);
        newChart.setInterval([begin + $('#timeZone').val(), end + $('#timeZone').val()]);
        var chartConf = {};
        chartConf["server"] = serverUrl;
        var chartAttributes = chartTypesObj["chart-types-attr"][selectedChartType];
        chartConf["type"] = selectedChartType;
        for (var d = 0; d < $('#chart_settings input').length; d++) {
        	chartConf[chartAttributes[d]] = $('#' + selectedChartType + "-" + chartAttributes[d]).val();
        }
        newChart.setChartTypeConf(chartConf);
      
        if (preview !== null) {
            document.getElementById('preview').innerHTML = "";
            newChart.setElementId('preview');
            newChart.setCssClass('preview');
            newChart.setHeight(parseInt($('#height').val()));
            newChart.setWidth(parseInt($('#width').val()));
            newChart.build();
        }
        newChart.setElementId($('#elementId').val());
        newChart.setCssClass($('#css_class').val());
        newChart.setHeight(parseInt($('#height').val()));
        newChart.setWidth(parseInt($('#width').val()));
        var code = newChart.getCode(newChart.getConfig());
        $('#code_output').val(code);
    });


});