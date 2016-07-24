$(document).ready(function () {
    var server;
    istsos.widget.SERVER_PROMISE.done(function (data) {
        document.getElementById('preview').innerHTML = "";
        var serverConf = data;
        var db = new istsos.Database(serverConf["db"]["dbname"], serverConf["db"]["host"], serverConf["db"]["user"], serverConf["db"]["password"],
            serverConf["db"]["port"]);
        server = new istsos.Server(serverConf["name"], serverConf["url"], db);
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select service --';
        document.getElementById('service_list').appendChild(defaultOption);

        document.getElementById('service_list').innerHTML = "";
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select service --';
        document.getElementById('service_list').appendChild(defaultOption);
        server.getServices();
        istsos.once(istsos.events.EventType.SERVICES, function (evt) {
            var services_obj = evt.getData();
            for (var i = 0; i < services_obj.length; i++) {
                var option = document.createElement('option');
                option.innerHTML = services_obj[i]["service"];
                document.getElementById('service_list').appendChild(option);
            }
        });
    });


    $('#service_list').change(function (evt) {
        document.getElementById('service_list').setAttribute('value', evt.target.value);
        var serviceName = evt.target.value;
        if (serviceName && serviceName !== "") {
            var service = new istsos.Service(serviceName, server);
            service.getOfferingNames();
            istsos.once(istsos.events.EventType.OFFERING_NAMES, function (evt) {
                document.getElementById('offering_list').innerHTML = "";
                var offering_obj = evt.getData();
                var defaultOption = document.createElement('option');
                defaultOption.setAttribute('disabled', '');
                defaultOption.setAttribute('selected', '');
                defaultOption.setAttribute('value', '');
                defaultOption.innerHTML = '-- select offering --';
                document.getElementById('offering_list').appendChild(defaultOption);
                for (var i = 0; i < offering_obj.length; i++) {
                    var option = document.createElement('option');
                    option.innerHTML = offering_obj[i]["name"];
                    document.getElementById('offering_list').appendChild(option);
                }
            });

            $('#offering_list').change(function (evt) {
                document.getElementById('op_list').innerHTML = '<option>-</option>';
                document.getElementById('offering_list').setAttribute("value", evt.target.value);
                var offering = new istsos.Offering(evt.target.value, "", true, "", service);
                offering.getMemberProcedures();
                istsos.once(istsos.events.EventType.MEMBERLIST, function (evt) {
                    document.getElementById('procedure_list').innerHTML = "";
                    var member_obj = evt.getData();
                    console.log(member_obj);
                    for (var i = 0; i < member_obj.length; i++) {
                        var label = document.createElement('label');
                        var br = document.createElement('br');
                        var input = document.createElement('input');
                        input.setAttribute('type', 'checkbox');
                        label.appendChild(input);
                        label.innerHTML += '&nbsp;&nbsp;' + member_obj[i]["name"];
                        document.getElementById('procedure_list').appendChild(label);
                        document.getElementById('procedure_list').appendChild(br);
                    }
                });
            });
            $('#procedure_list').change(function (evt) {
                var op_list = document.getElementById('op_list');
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
                $('#procedure_list label').children().each(function () {
                    if (this.checked) {
                        checkedList.push(this.parentNode.innerText.trim());
                    } else {
                        checkedList.splice($('#procedure_list label').children().index(this), 1);
                    }
                });
                document.getElementById('procedure_list').setAttribute("value", checkedList);
                service.getProcedures();
                istsos.once(istsos.events.EventType.PROCEDURES, function (evt) {
                    var procedure_obj = evt.getData();
                    for (var j = 0; j < procedure_obj.length; j++) {
                        if (checkedList.indexOf(procedure_obj[j]["name"]) !== -1) {
                            observedPropertiesList.push(procedure_obj[j]["observedproperties"]);
                        }
                    }
                    var result = [];
                    var names = [];
                    var final = [];
                    if (observedPropertiesList.length === 1) {
                        for (var opl = 0; opl < observedPropertiesList[0].length; opl++) {
                            var option = document.createElement('option');
                            option.innerHTML = observedPropertiesList[0][opl]["name"];
                            document.getElementById('op_list').appendChild(option);
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
                        document.getElementById('op_list').appendChild(options);
                        op_list.appendChild(options);
                    }
                    $('#op_list').change(function (evt) {
                        istsos.widget.OBSERVED_PROPERTIES_URN_PROMISE.done(function (data) {
                            $('#op_list').attr('value', data[evt.target.value]);
                        })
                    });
                });

            });


        }
    });

    $('#generate').click(function () {
        var preview = document.getElementById('preview');
        var newMap = new istsos.widget.Map();
        newMap.setService($('#service_list').attr("value"));
        newMap.setOffering($('#offering_list').attr("value"));
        newMap.setProcedures($('#procedure_list').attr("value"));
        newMap.setObservedProperty($('#op_list').attr("value"));
        if (preview !== null) {
            console.log('PREVIEW EXISTS');
            document.getElementById('preview').innerHTML = "";
            newMap.setElementId('preview');
            newMap.setCssClass('preview');
            newMap.setHeight('100%');
            newMap.setWidth(parseInt('100%'));
            newMap.build();
        }
        newMap.setElementId($('#elementId').val());
        newMap.setCssClass($('#css_class').val());
        newMap.setHeight(parseInt($('#height').val()));
        newMap.setWidth(parseInt($('#width').val()));
        var code = istsos.widget.getCode(newMap.getConfig());
        $('#code_output').val(code);

    });

});