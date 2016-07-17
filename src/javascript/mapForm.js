$(document).ready(function () {
    $.getJSON('specs/server_config.json', function (data) {
        var serverConf = data;
        var db = new istsos.Database(serverConf["db"]["dbname"], serverConf["db"]["host"], serverConf["db"]["user"], serverConf["db"]["password"],
            serverConf["db"]["port"]);
        var server = new istsos.Server(serverConf["name"], serverConf["url"], db);
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select service --';
        document.getElementById('service_list').appendChild(defaultOption);
        $('#service_list').one('focus',function () {
            document.getElementById('service_list').innerHTML = null;
            var defaultOption = document.createElement('option');
            defaultOption.setAttribute('disabled', '');
            defaultOption.setAttribute('selected', '');
            defaultOption.setAttribute('value', '');
            defaultOption.innerHTML = '-- select service --';
            document.getElementById('service_list').appendChild(defaultOption);
            server.getServices();
            istsos.on(istsos.events.EventType.SERVICES, function(evt) {
                var services_obj = evt.getData();
                for(var i = 0; i < services_obj.length; i++) {
                    var option = document.createElement('option');
                    option.innerHTML = services_obj[i]["service"];
                    document.getElementById('service_list').appendChild(option);
                }
            });
        });

        $('#service_list').change(function (evt) {
            document.getElementById('service_list').setAttribute('value', evt.target.value)
            var serviceName = evt.target.value;
            if(serviceName && serviceName !== "") {
                console.log('TO BRE');
                var service = new istsos.Service(serviceName, server);
                service.getProcedures();
                service.getObservedProperties();

                istsos.on(istsos.events.EventType.PROCEDURES, function (evt) {
                    document.getElementById('procedure_list').innerHTML = null;
                    var procedure_obj = evt.getData();
                    var defaultOption = document.createElement('option');
                    defaultOption.setAttribute('disabled', '');
                    defaultOption.setAttribute('selected', '');
                    defaultOption.setAttribute('value', '');
                    defaultOption.innerHTML = '-- select procedure --';
                    document.getElementById('procedure_list').appendChild(defaultOption);
                    for(var i = 0; i < procedure_obj.length; i++) {
                        var option = document.createElement('option');
                        option.innerHTML = procedure_obj[i]["name"];
                        document.getElementById('procedure_list').appendChild(option);
                    }
                });

                istsos.on(istsos.events.EventType.OBSERVED_PROPERTIES, function (evt) {
                    document.getElementById('op_list').innerHTML = null;
                    var op_obj = evt.getData();
                    var defaultOption = document.createElement('option');
                    defaultOption.setAttribute('disabled', '');
                    defaultOption.setAttribute('selected', '');
                    defaultOption.setAttribute('value', '');
                    defaultOption.innerHTML = '-- select observed property --';
                    document.getElementById('op_list').appendChild(defaultOption);
                    for(var i = 0; i < op_obj.length; i++) {
                        var option = document.createElement('option');
                        option.innerHTML = op_obj[i]["name"];
                        option.setAttribute("value", op_obj[i]["definition"]);
                        document.getElementById('op_list').appendChild(option);
                    }

                });
            }
        });

        $('#procedure_list').focus(function (evt) {

            var serviceName = $('#service_list').val();


        });
        $('#procedure_list').change(function (evt) {
            document.getElementById('procedure_list').setAttribute("value", evt.target.value);
        });

        $('#op_list').change(function (evt) {
            document.getElementById('op_list').setAttribute("value", evt.target.value);
        });







    });

    $('#generate').click(function () {
        var newMap = new istsos.widget.Map();
        newMap.setElementId('preview');
        newMap.setService($('#service_list').attr("value"));
        newMap.setHeight('100%');
        newMap.setWidth(parseInt('100%'));
        newMap.setCssClass('preview');
        newMap.setProcedure($('#procedure_list').attr("value"));
        newMap.setObservedProperty($('#op_list').attr("value"));

        istsos.widget.build(newMap.getConfig());
        newMap.setCssClass($('#css_class').val());
        newMap.setElementId($('#elementId').val());
        newMap.setHeight(parseInt($('#height').val()));
        newMap.setWidth(parseInt($('#width').val()));
        var code = istsos.widget.getCode(newMap.getConfig());
        $('#code_output').val(code);

    });

});