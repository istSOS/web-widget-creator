$(document).ready(function() {
    var dataConfig = {
        "server": "",
        "db": {},
        "property": {},
        "data": []
    };
    var server;
    istsos.widget.SERVER_PROMISE.then(function(data) {
        document.getElementById('preview').innerHTML = "";
        var serverConf = data;
        var db = new istsos.Database(serverConf["db"]["dbname"], serverConf["db"]["host"], serverConf["db"]["user"], serverConf["db"]["password"],
            serverConf["db"]["port"]);
        server = new istsos.Server(serverConf["name"], serverConf["url"], db);
        dataConfig["server"] = serverConf["url"];
        dataConfig["db"]["dbname"] = serverConf["db"]["dbname"];
        dataConfig["db"]["host"] = serverConf["db"]["host"];
        dataConfig["db"]["user"] = serverConf["db"]["user"];
        dataConfig["db"]["password"] = serverConf["db"]["password"];
        dataConfig["db"]["port"] = serverConf["db"]["port"];
        document.getElementById('service_list_map').innerHTML = "";
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select service --';
        document.getElementById('service_list_map').appendChild(defaultOption);
        server.getServices();
        istsos.once(istsos.events.EventType.SERVICES, function(evt) {
            var services_obj = evt.getData();
            for (var i = 0; i < services_obj.length; i++) {
                var option = document.createElement('option');
                option.innerHTML = services_obj[i]["service"];
                document.getElementById('service_list_map').appendChild(option);
            }
        });
    });

    var serviceName;
    $('#service_list_map').change(function(evt) {
        document.getElementById('service_list_map').setAttribute('value', evt.target.value);
        document.getElementById('procedure_list_map').innerHTML = '<hr/>'
        var service = null;
        serviceName = evt.target.value;
        if (serviceName && serviceName !== "") {
            service = new istsos.Service(serviceName, server);
            service.getOfferingNames();
            istsos.once(istsos.events.EventType.OFFERING_NAMES, function(evt) {
                document.getElementById('offering_list_map').innerHTML = "";
                var offering_obj = evt.getData();
                var defaultOption = document.createElement('option');
                defaultOption.setAttribute('disabled', '');
                defaultOption.setAttribute('selected', '');
                defaultOption.setAttribute('value', '');
                defaultOption.innerHTML = '-- select offering --';
                document.getElementById('offering_list_map').appendChild(defaultOption);
                for (var i = 0; i < offering_obj.length; i++) {
                    var option = document.createElement('option');
                    option.innerHTML = offering_obj[i]["name"];
                    document.getElementById('offering_list_map').appendChild(option);
                }
            });
        }
    });

    $('#offering_list_map').change(function(evt) {
        var offering = null;
        var service = new istsos.Service(serviceName, server);
        document.getElementById('op_list_map').innerHTML = '<option>-</option>';
        document.getElementById('offering_list_map').setAttribute("value", evt.target.value);
        offering = new istsos.Offering(evt.target.value, "", true, "", service);
        offering.getMemberProcedures();
        istsos.once(istsos.events.EventType.MEMBERLIST, function(evt) {
            document.getElementById('procedure_list_map').innerHTML = "";
            var member_obj = evt.getData();
            for (var i = 0; i < member_obj.length; i++) {
                var label = document.createElement('label');
                var br = document.createElement('br');
                var input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                label.appendChild(input);
                label.innerHTML += '&nbsp;&nbsp;' + member_obj[i]["name"];
                document.getElementById('procedure_list_map').appendChild(label);
                document.getElementById('procedure_list_map').appendChild(br);
            }
        });
    });

    $('#procedure_list_map').change(function(evt) {
        dataConfig["data"] = [];
        var op_list = document.getElementById('op_list_map');
        op_list.innerHTML = "";
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select observed property --';
        op_list.appendChild(defaultOption);
        while (op_list.childNodes.length > 1) {
            op_list.removeChild(op_list.lastChild);
        }
        var checkedList = [];
        var observedPropertiesList = [];
        $('#procedure_list_map label').children().each(function() {
            if (this.checked) {
                checkedList.push(this.parentNode.innerText.trim());
            } else {
                checkedList.splice($('#procedure_list_map label').children().index(this), 1);
            }
        });

        document.getElementById('procedure_list_map').setAttribute("value", checkedList);
        var service = new istsos.Service(serviceName, server);
        service.getProcedures();
        istsos.once(istsos.events.EventType.PROCEDURES, function(evt) {
            var procedure_obj = null;
            procedure_obj = evt.getData();
            var urns = {};
            for (var j = 0; j < procedure_obj.length; j++) {
                if (checkedList.indexOf(procedure_obj[j]["name"]) !== -1) {
                    observedPropertiesList.push(procedure_obj[j]["observedproperties"]);
                    var procDataObj = {
                        "name": procedure_obj[j]["name"],
                        "type": procedure_obj[j]["sensortype"],
                        "samplingTime": [moment(procedure_obj[j]["samplingTime"]["beginposition"]).utc().format(), moment(procedure_obj[j]["samplingTime"]["endposition"]).utc().format()]
                    }
                    var uniqueProc = true;
                    dataConfig["data"].forEach(function(dc) {
                        if (dc["name"] === procDataObj["name"]) {
                            uniqueProc = false;
                        }
                    })
                    if (uniqueProc === true) {
                        dataConfig["data"].push(procDataObj);
                    }

                }
            }
            var result = [];
            var names = [];
            var final = [];
            if (observedPropertiesList.length === 1) {
                for (var opl = 0; opl < observedPropertiesList[0].length; opl++) {
                    var option = document.createElement('option');
                    option.innerHTML = observedPropertiesList[0][opl]["name"];
                    document.getElementById('op_list_map').appendChild(option);
                    op_list.appendChild(option);
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
                var options = document.createElement('option');
                options.innerHTML = final[fopl];
                document.getElementById('op_list_map').appendChild(options);
                op_list.appendChild(options);
            }
            $('#op_list_map').change(function(evt) {
                var opName = evt.target.value;
                service.getObservedProperties();
                istsos.once(istsos.events.EventType.OBSERVED_PROPERTIES, function(e) {
                    var propertiesObj = e.getData();
                    for(var prop = 0; prop < propertiesObj.length; prop++) {
                        if(propertiesObj[prop]["name"] === opName) {
                            $('#op_list_map').attr('value', opName + "&&" + propertiesObj[prop]["definition"]);
                        }
                    }
                    
                })
            });
        });
    });


    $('#generate_map').click(function() {
        //CREATING ISTSOS OBJECTS NEEDED FOR GET OBSERVATIONS REQUEST

        //SERVICE INSTANCE
        var service = new istsos.Service(serviceName, server);

        //OFFERING INSTANCE
        var off = new istsos.Offering($('#offering_list_map').attr("value"), "", true, "", service);

        //OBSERVED PROPERTY INSTANCE
        var op = [new istsos.ObservedProperty(service, $('#op_list_map').attr('value').split('&&')[0], $('#op_list_map').attr('value').split('&&')[1], "", "lessThan", 9)];

        //BEGIN SAMPLING TIME
        var begin = moment(dataConfig["data"][0]["samplingTime"][0]).utc().format();

        //END SAMPLING TIME
        var end = moment(dataConfig["data"][0]["samplingTime"][1]).utc().format();
        for (var t = 1; t < dataConfig["data"].length; t++) {
            begin = istsos.widget.olderDate(begin, dataConfig["data"][t]["samplingTime"][0]);
            end = istsos.widget.newerDate(end, dataConfig["data"][t]["samplingTime"][1]);
        }

        //PROCEDURE || VIRTUAL PROCEDURE INSTANCES
        var procs = [];
        dataConfig["data"].forEach(function(p) {
            if (p["type"] === "virtual") {
                procs.push(new istsos.VirtualProcedure(service, p["name"], "", "", "foi", 3857, 5, 5, 5, [], "virtual", "", "", {}));
            } else {
                procs.push(new istsos.Procedure(service, p["name"], "", "", "foi", 3857, 5, 5, 5, [], "insitu-fixed-point", ""));
            }
        });


        //GETTING PROPERTY NAME AND URN
        dataConfig["property"]["name"] = $('#op_list_map').attr('value').split('&&')[0];
        dataConfig["property"]["urn"] = $('#op_list_map').attr('value').split('&&')[1];

        istsos.widget.OBSERVED_PROPERTIES_PROMISE.then(function(spec) {

            //GET OBSERVATIONS REQUEST FROM ISTSOS-CORE LIBRARY
            service.getObservations(off, procs, op, begin, end);
            istsos.once(istsos.events.EventType.GETOBSERVATIONS, function(evt) {
                var obs = evt.getData();
                for (var o = 0; o < obs.length; o++) {
                    for (var p = 0; p < dataConfig["data"].length; p++) {
                        if (obs[o]["name"] === dataConfig["data"][p]["name"]) {

                            //GETTING LAST OBSERVATION AND LAST DATE
                            var observations = obs[o]["result"]["DataArray"]["values"];
                            dataConfig["data"][p]["lastObs"] = observations[observations.length - 1][1];
                            dataConfig["data"][p]["lastDate"] = observations[observations.length - 1][0];

                            //GETTING IMAGE URL BASED ON LAST OBSERVATION VALUE
                            spec[dataConfig["property"]["urn"]].forEach(function(s) {
                                if (dataConfig["data"][p]["lastObs"] >= s["from"] && dataConfig["data"][p]["lastObs"] < s["to"]) {
                                    dataConfig["data"][p]["imageSrc"] = s["url"];
                                }
                            });

                            //GETTING UNIT OF MEASURE
                            var uoms = obs[o]["result"]["DataArray"]["field"];
                            uoms.forEach(function(u) {
                                if (dataConfig["property"]["name"] === u["name"]) {
                                    dataConfig["property"]["uom"] = u["uom"];
                                }
                            });

                            //GETTING SENSOR COORDINATES FROM GML STRING
                           
                            var gml = obs[o]["featureOfInterest"]["geom"];
                            var coordsStr = gml.slice(gml.search("<gml:coordinates>") + 17, gml.search("</gml:coordinates>"));
                            var coords = [parseFloat(coordsStr.split(',')[0]), parseFloat(coordsStr.split(',')[1])];
                            
                            dataConfig["data"][p]["coords"] = [coords[0], coords[1]];
                            break;
                        }
                    }
                }

                //PREPARING WIDGET INSTANCE FOR BUILDING AND FOR GENERATING THE EMBEDDED CODE
                var preview = document.getElementById('preview');
                $('table').height($('#content').height());

                var newMap = new istsos.widget.Map();
                newMap.setService($('#service_list_map').attr("value"));
                newMap.setOffering($('#offering_list_map').attr("value"));
                newMap.setProcedures($('#procedure_list_map').attr("value"));
                newMap.setObservedProperty($('#op_list_map').attr("value").split("&&")[0]);
                newMap.setDataConfig(dataConfig);
                newMap.setElementId($('#elementId').val());
                newMap.setCssClass($('#css_class').val());
                newMap.setHeight(parseInt($('#height').val()));
                newMap.setWidth(parseInt($('#width').val()));
                if(document.getElementById('auto-update').checked) {
                    newMap.setAutoUpdate({"checked": true, "unit": $('#timeUnit').val(), "delay": $('#delay').val(), "interval": $('#update-interval').val()});
                }
                else {
                    newMap.setAutoUpdate({"checked": false});
                }

                var code = istsos.widget.getCode(newMap.getConfig());
                $('#code_output').val(code) ;

                //IF THE WIDGET IS USED INSIDE THE APP, THEN $('#preview') ELEMENT MUST EXIST
                if (preview !== null) {
                    preview.innerHTML = "";
                    newMap.setElementId('preview');
                    newMap.setCssClass('preview');
                    newMap.setHeight('100%');
                    newMap.setWidth('100%');
                    newMap.build();
                }
            });
        });

    });
});