$(document).ready(function () {
    var server;
    istsos.widget.SERVER_PROMISE.done(function (data) {
        document.getElementById('preview').innerHTML = null;
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

        document.getElementById('service_list').innerHTML = null;
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
                document.getElementById('offering_list').innerHTML = null;
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
                document.getElementById('offering_list').setAttribute("value", evt.target.value);
                var offering = new istsos.Offering(evt.target.value, "", true, "", service);
                offering.getMemberProcedures();
                istsos.once(istsos.events.EventType.MEMBERLIST, function (evt) {
                    document.getElementById('procedure_list').innerHTML = null;
                    var member_obj = evt.getData();
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
                $('#procedure_list').change(function (evt) {
                    var op_list = document.getElementById('op_list');
                    op_list.innerHTML = null;
                    var defaultOption = document.createElement('option');
                    defaultOption.setAttribute('disabled', '');
                    defaultOption.setAttribute('selected', '');
                    defaultOption.setAttribute('value', '');
                    defaultOption.innerHTML = '-- select observed property --';
                    op_list.appendChild(defaultOption);
                    /*if (op_list.childNodes[0].innerHTML !== '-- select observed property --') {
                        op_list.innerHTML = null;
                        var defaultOption = document.createElement('option');
                        defaultOption.setAttribute('disabled', '');
                        defaultOption.setAttribute('selected', '');
                        defaultOption.setAttribute('value', '');
                        defaultOption.innerHTML = '-- select observed property --';
                        op_list.appendChild(defaultOption);
                    }*/
                    while (op_list.childNodes.length > 1) {
                        op_list.removeChild(op_list.lastChild);
                    }
                    var checkedList = [];
                    $('#procedure_list label').children().each(function () {
                        if(this.checked) {
                            checkedList.push(this.parentNode.innerText.trim());
                        } else {
                            checkedList.splice($('#procedure_list label').children().index(this),1);
                        }
                    });
                    document.getElementById('procedure_list').setAttribute("value", checkedList);
                    console.log(checkedList);
                    service.getProcedures();
                    istsos.once(istsos.events.EventType.PROCEDURES, function (evt) {
                        var procedure_obj = evt.getData();
                        for (var j = 0; j < procedure_obj.length; j++) {
                            if(checkedList.indexOf(procedure_obj[j]["name"]) !== -1 ) {
                                for (var k = 0; k < procedure_obj[j]["observedproperties"].length; k++) {
                                    var exists = false;
                                    for (var l = 0; l < op_list.childNodes.length; l++) {
                                        if(procedure_obj[j]["observedproperties"][k]["name"] === op_list.childNodes[l].innerText.trim()) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    if (exists === false) {
                                        var option = document.createElement('option');
                                        option.innerHTML = procedure_obj[j]["observedproperties"][k]["name"];
                                        document.getElementById('op_list').appendChild(option);
                                        op_list.appendChild(option);
                                    }

                                }
                            }

                        }
                        $('#op_list').change(function (evt) {
                            istsos.widget.OBSERVED_PROPERTIES_URN_PROMISE.done(function (data) {
                                $('#op_list').attr('value', data[evt.target.value]);
                            })
                        });
                    });
                });
            });



        }
    });

    $('#generate').click(function () {
        document.getElementById('preview').innerHTML = null;
        var newMap = new istsos.widget.Map();
        newMap.setElementId('preview');
        newMap.setService($('#service_list').attr("value"));
        newMap.setHeight('100%');
        newMap.setWidth(parseInt('100%'));
        newMap.setCssClass('preview');
        newMap.setOffering($('#offering_list').attr("value"));
        newMap.setProcedures($('#procedure_list').attr("value"));
        newMap.setObservedProperty($('#op_list').attr("value"));
        newMap.build();
        newMap.setCssClass($('#css_class').val());
        newMap.setElementId($('#elementId').val());
        newMap.setHeight(parseInt($('#height').val()));
        newMap.setWidth(parseInt($('#width').val()));
        var code = istsos.widget.getCode(newMap.getConfig());
        $('#code_output').val(code);

    });

});