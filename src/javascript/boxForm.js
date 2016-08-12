$(document).ready(function() {
    //WIDGET DATA CONFIGURATION OBJECT
    var dataConfig = {
        "server": "",
        "db": {},
        "procedure": {},
        "lastDate": "",
        "data": []
    };

    //GENERATING LIST OF SERVICES RELATED TO THE SERVER SPECIFIED IN server_config.json
    var server;
    istsos.widget.SERVER_PROMISE.then(function(data) {
        document.getElementById('preview').innerHTML = "";
        var serverConf = data;
        var db = new istsos.Database(serverConf["db"]["dbname"], serverConf["db"]["host"], serverConf["db"]["user"], serverConf["db"]["password"],
            serverConf["db"]["port"]);
        server = new istsos.Server(serverConf["name"], serverConf["url"], db);

        //ADDING SERVER DATA TO WIDGET DATA CONFIGURATION OBJECT
        dataConfig["server"] = serverConf["url"];
        dataConfig["db"]["dbname"] = serverConf["db"]["dbname"];
        dataConfig["db"]["host"] = serverConf["db"]["host"];
        dataConfig["db"]["user"] = serverConf["db"]["user"];
        dataConfig["db"]["password"] = serverConf["db"]["password"];
        dataConfig["db"]["port"] = serverConf["db"]["port"];

        //SETTING DEFAULT OPTION FOR THE LIST OF SERVICES
        document.getElementById('service_list_box').innerHTML = "";
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select service --';
        document.getElementById('service_list_box').appendChild(defaultOption);

        //GETTING SERVICES USING THE METHOD FROM ISTSOS-CORE LIBRARY
        server.getServices();
        istsos.once(istsos.events.EventType.SERVICES, function(evt) {
            var services_obj = evt.getData();
            for (var i = 0; i < services_obj.length; i++) {
                var option = document.createElement('option');
                option.innerHTML = services_obj[i]["service"];
                document.getElementById('service_list_box').appendChild(option);
            }
        });
    });

    //GETTING THE LIST OF OFFERINGS BASED ON SELECTED SERVICE
    var serverName;
    $('#service_list_box').change(function(evt) {
        document.getElementById('service_list_box').setAttribute('value', evt.target.value);
        serviceName = evt.target.value;
        if (serviceName && serviceName !== "") {

            //GETTING OFFERINGS USING THE METHOD FROM THE ISTSOS-CORE LIBRARY
            var service = new istsos.Service(serviceName, server);
            service.getOfferingNames();
            istsos.once(istsos.events.EventType.OFFERING_NAMES, function(evt) {
                document.getElementById('offering_list_box').innerHTML = "";
                var offering_obj = evt.getData();

                //SETTING DEFAULT OPTION FOR THE LIST OF OFFERINGS
                var defaultOption = document.createElement('option');
                defaultOption.setAttribute('disabled', '');
                defaultOption.setAttribute('selected', '');
                defaultOption.setAttribute('value', '');
                defaultOption.innerHTML = '-- select offering --';
                document.getElementById('offering_list_box').appendChild(defaultOption);

                //ADDING THE LIST OF OFFERINGS
                for (var i = 0; i < offering_obj.length; i++) {
                    var option = document.createElement('option');
                    option.innerHTML = offering_obj[i]["name"];
                    document.getElementById('offering_list_box').appendChild(option);
                }
            });
        }
    });

    //GETTING THE LIST OF MEMBER PROCEDURES BASED ON SELECTED OFFERING
    $('#offering_list_box').change(function(evt) {
        var service = new istsos.Service(serviceName, server);
        document.getElementById('op_list_box').innerHTML = '<hr/>';
        document.getElementById('offering_list_box').setAttribute("value", evt.target.value);
        var offering = new istsos.Offering(evt.target.value, "", true, "", service);

        //GETTING MEMBER PROCEDURES USING THE METHOD FROM THE ISTSOS-CORE LIBRARY
        offering.getMemberProcedures();
        istsos.once(istsos.events.EventType.MEMBERLIST, function(evt) {
            document.getElementById('procedure_list_box').innerHTML = "";
            var member_obj = evt.getData();

            //SETTING DEFAULT OPTION FOR THE LIST OF MEMBER PROCEDURES
            var defaultOption = document.createElement('option');
            defaultOption.setAttribute('disabled', '');
            defaultOption.setAttribute('selected', '');
            defaultOption.setAttribute('value', '');
            defaultOption.innerHTML = '-- select procedure --';
            document.getElementById('procedure_list_box').appendChild(defaultOption);

            //ADDING THE LIST OF MEMBER PROCEDURES
            for (var i = 0; i < member_obj.length; i++) {
                var option = document.createElement('option');
                option.innerHTML = member_obj[i]["name"];
                document.getElementById('procedure_list_box').appendChild(option);
            }
        });
    });

    //GETTING THE LIST OF OBSERVED PROPERTIES BASED ON SELECTED PROCEDURE
    $('#procedure_list_box').change(function(evt) {
        var service = new istsos.Service(serviceName, server);
        document.getElementById('op_list_box').innerHTML = "";
        document.getElementById('procedure_list_box').setAttribute("value", evt.target.value);

        //GETTING SPECIFIC PROCEDURE USING THE METHOD FROM THE ISTSOS-CORE LIBRARY
        var procedure = new istsos.Procedure(service, evt.target.value, "", "", "foi", 3857, 5, 5, 5, [], "insitu-fixed-point", "");
        var v_procedure = new istsos.VirtualProcedure(service, evt.target.value, "", "", "foi", 3857, 5, 5, 5, [], "virtual", "", {});
        try {
            service.getProcedure(procedure);
            istsos.once(istsos.events.EventType.PROCEDURE, function(evt) {
                manageObservedProperties(evt);
            });
        } catch (e) {
            console.log(e);
            service.getVirtualProcedure(v_procedure);
            istsos.once(istsos.events.EventType.VIRTUAL_PROCEDURE, function(evt) {
                manageObservedProperties(evt);
            });
        }

        var manageObservedProperties = function(evt) {
            document.getElementById('op_list_box').innerHTML = "";

            //ADDING NAME AND SAMPLING TIME TO THE WIDGET DATA CONFIGURATION OBJECT
            var outputs = evt.getData()["outputs"];
            dataConfig["procedure"]["name"] = evt.getData()["system_id"];
            dataConfig["procedure"]["from"] = outputs[0]["constraint"]["interval"][0];
            dataConfig["procedure"]["to"] = outputs[0]["constraint"]["interval"][1];

            //ADDING PROCEDURE TYPE TO THE WIDGET DATA CONFIGURATION OBJECT
            var sensorType = evt.getData()["classification"][0]["value"];
            dataConfig["procedure"]["type"] = sensorType;

            //ADDING THE LIST OF OBSERVED PROPERTIES CHECKBOXES
            for (var i = 1; i < outputs.length; i++) {
                var label = document.createElement('label');
                var br = document.createElement('br');
                var input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                label.appendChild(input);
                label.innerHTML += '&nbsp;&nbsp;' + outputs[i]["name"];
                label.setAttribute('value', outputs[i]["definition"] + "&&" + outputs[i]["uom"]);
                document.getElementById('op_list_box').appendChild(label);
                document.getElementById('op_list_box').appendChild(br);
            }
        }
    });

    //OBSERVED PROPERTIES CHECKBOX STATUS MANAGEMENT
    $('#op_list_box').change(function(evt) {
        // ADDING/REMOVING OBSERVED PROPERTIES NAMES, DEFINITION URNS AND UNITS OF MEASURE 
        // TO/FROM THE WIDGET DATA CONFIGURATION OBJECT
        dataConfig["data"] = [];
        $('#op_list_box label').children().each(function() {
            var val = this.parentNode.innerText.trim() + '&&' + this.parentNode.getAttribute('value');
            if (this.checked) {
                var obj = {
                    "name": val.split('&&')[0],
                    "urn": val.split('&&')[1],
                    "uom": val.split('&&')[2],
                    "lastObs": "",
                    "imageSrc": ""
                }
                dataConfig["data"].push(obj);
            } else {
                $.grep(dataConfig["data"], function(value) {
                    return value["name"] != val.split('&&')[0];
                });
            }
        });
    });

    $('#generate_box').click(function() {
        //CREATING ISTSOS OBJECTS NEEDED FOR GET OBSERVATIONS REQUEST
        //SERVICE INSTANCE
        var service = new istsos.Service(serviceName, server);

        //OFFERING INSTANCE
        var off = new istsos.Offering($('#offering_list_box').attr("value"), "", true, "", service);

        //PROCEDURE || VIRTUAL PROCEDURE INSTANCE
        var proc;
        if (dataConfig["procedure"]["type"] === "virtual") {
            proc = new istsos.VirtualProcedure(service, dataConfig["procedure"]["name"], "", "", "foi", 3857, 5, 5, 5, [], "virtual", "", "", {})
        } else {
            proc = new istsos.Procedure(service, dataConfig["procedure"]["name"], "", "", "foi", 3857, 5, 5, 5, [], "insitu-fixed-point", "", "", {})
        }

        //OBSERVED PROPERTY INSTANCES
        var property_list = []
        dataConfig["data"].forEach(function(op) {
            property_list.push(new istsos.ObservedProperty(service, op["name"], op["urn"], "", "lessThan", 9))
        });

        //BEGIN SAMPLING TIME
        var begin = dataConfig["procedure"]["from"];

        //END SAMPLING TIME
        var end = dataConfig["procedure"]["to"];
        
        //GET OBSERVATIONS REQUEST FROM ISTSOS-CORE LIBRARY
        service.getObservations(off, [proc], property_list, begin, end);
        istsos.once(istsos.events.EventType.GETOBSERVATIONS, function (evt) {
            var observations = evt.getData()[0]["result"]["DataArray"]["values"];
            var lastObservations = observations[observations.length - 1];
            var order = evt.getData()[0]["observedProperty"]["component"];

            //ADDING LAST OBSERVATION DATE AND TIME
            dataConfig["lastDate"] = lastObservations[0];

            //ADDING LAST OBSERVATION FOR EACH OBSERVED PROPERTY
            for(var i = 1; i < order.length; i+=2) {
                var lastObs = lastObservations[i];
                dataConfig["data"].forEach(function (op) {
                    if(op["urn"] === order[i]) {
                        op["lastObs"] = lastObs;
                    }
                });
            }
        

            //PREPARING WIDGET INSTANCE FOR BUILDING AND FOR GENERATING THE EMBEDDED CODE
            var preview = $('#preview');
            var newBox = new istsos.widget.Box();
            
            //SETTING SERVICE, OFFERING AND PROCEDURE
            newBox.setService($('#service_list_box').attr("value"));
            newBox.setOffering($('#offering_list_box').attr("value"));
            newBox.setProcedure(dataConfig["procedure"]["name"]);
            
            //SETTING OBSERVED PROPERTIES
            var obs_props = [];
            dataConfig["data"].forEach(function (op) {
                obs_props.push(op["name"]);
            });
            newBox.setObservedProperties(obs_props);

            //SETTING LAYOUT
            if (document.getElementById("radVert").checked) {
                newBox.setLayout(true);
            } else {
                newBox.setLayout(false);
            }

            //SETTING AUTO-UPDATE
            if(document.getElementById('auto-update').checked) {
                newBox.setAutoUpdate({"checked": true, "unit": $('#timeUnit').val(), "delay": $('#delay').val(), "interval": $('#update-interval').val()});
            } else {
                newBox.setAutoUpdate({"checked": false});
            }

            //SETTING ELEMENT ID, CSS CLASS, HEIGHT AND WIDTH OF THE WIDGET
            newBox.setElementId($('#elementId').val());
            newBox.setCssClass($('#css_class').val());
            newBox.setHeight(parseInt($('#height').val()));
            newBox.setWidth(parseInt($('#width').val()));

            istsos.widget.OBSERVED_PROPERTIES_NAMES_PROMISE.then(function(specData) {

                //SETTING BEAUTIFIED OBSERVED PROPERTY NAMES TO BE SHOWN IN THE WIDGET
                dataConfig["data"].forEach(function(op) {
                    op["showName"] = specData[op["name"]];
                });

                //SETTING WIDGET ICON URL
                istsos.widget.OBSERVED_PROPERTIES_PROMISE.then(function(specData) {
                    if(dataConfig["data"].length === 1) {
                        specData[dataConfig["data"][0]["urn"]].forEach(function(interval) {
                            var obs = parseFloat(dataConfig["data"][0]["lastObs"]);
                            if(obs >= interval["from"] && obs < interval["to"]) {
                                dataConfig["imageSrc"] = interval["url"];
                            }
                        });
                    } else {
                        //DEFAULT ICON - ISTSOS LOGO
                        dataConfig["imageSrc"] = "https://live.osgeo.org/_images/logo-istsos6.png"
                    }
                
                    //SETTING WIDGET DATA CONFIGURATION OBJECT
                    newBox.setDataConfig(dataConfig);

                    //GETTING THE EMBEDDED CODE
                    var code = newBox.getCode(newBox.getConfig());
                    $('#code_output').val(code);

                    //IF THE WIDGET IS USED INSIDE THE APP, THEN "$('#preview')" ELEMENT MUST EXIST
                    if (preview !== null) {
                        $('#preview').html("");
                    
                        //SETTING WIDGETS PROPERTIES TO BE RELATED TO $('#preview') ELEMENT
                        newBox.setElementId('preview');
                        newBox.setCssClass('preview');
                        newBox.build();
                    }
                });
            });
        });
    });
});