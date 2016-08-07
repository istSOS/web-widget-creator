$(document).ready(function() {
    var server = null;
    istsos.widget.SERVER_PROMISE.then(function(data) {
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
        document.getElementById('service_list_box').appendChild(defaultOption);

        document.getElementById('service_list_box').innerHTML = "";
        var defaultOption = document.createElement('option');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.setAttribute('value', '');
        defaultOption.innerHTML = '-- select service --';
        document.getElementById('service_list_box').appendChild(defaultOption);
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
    var serverName = null;
    $('#service_list_box').change(function(evt) {
        document.getElementById('service_list_box').setAttribute('value', evt.target.value);
        serviceName = evt.target.value;
        if (serviceName && serviceName !== "") {
            var service = new istsos.Service(serviceName, server);
            service.getOfferingNames();
            istsos.once(istsos.events.EventType.OFFERING_NAMES, function(evt) {
                document.getElementById('offering_list_box').innerHTML = "";
                var offering_obj = evt.getData();
                var defaultOption = document.createElement('option');
                defaultOption.setAttribute('disabled', '');
                defaultOption.setAttribute('selected', '');
                defaultOption.setAttribute('value', '');
                defaultOption.innerHTML = '-- select offering --';
                document.getElementById('offering_list_box').appendChild(defaultOption);
                for (var i = 0; i < offering_obj.length; i++) {
                    var option = document.createElement('option');
                    option.innerHTML = offering_obj[i]["name"];
                    document.getElementById('offering_list_box').appendChild(option);
                }
            });
        }
    });

    $('#offering_list_box').change(function(evt) {
        var service = new istsos.Service(serviceName, server);
        document.getElementById('op_list_box').innerHTML = '<hr/>';
        document.getElementById('offering_list_box').setAttribute("value", evt.target.value);
        var offering = new istsos.Offering(evt.target.value, "", true, "", service);
        console.log(service.name);
        offering.getMemberProcedures();
        istsos.once(istsos.events.EventType.MEMBERLIST, function(evt) {
            document.getElementById('procedure_list_box').innerHTML = "";
            var member_obj = evt.getData();
            var defaultOption = document.createElement('option');
            defaultOption.setAttribute('disabled', '');
            defaultOption.setAttribute('selected', '');
            defaultOption.setAttribute('value', '');
            defaultOption.innerHTML = '-- select procedure --';
            document.getElementById('procedure_list_box').appendChild(defaultOption);
            for (var i = 0; i < member_obj.length; i++) {
                var option = document.createElement('option');
                option.innerHTML = member_obj[i]["name"];
                document.getElementById('procedure_list_box').appendChild(option);
            }
        });
    });

    var urnList = [];
    $('#procedure_list_box').change(function(evt) {
        urnList = [];
        var service = new istsos.Service(serviceName, server);
        document.getElementById('op_list_box').innerHTML = "";
        document.getElementById('procedure_list_box').setAttribute("value", evt.target.value);
        // PROCEDURE OR VIRTUAL PROCEDURE - FIX NEEDED
        var procedure = new istsos.Procedure(service, evt.target.value, "", "", "foi", 3857, 5, 5, 5, [], "insitu-fixed-point", "");
        service.getProcedure(procedure);
        istsos.once(istsos.events.EventType.PROCEDURE, function(evt) {
            document.getElementById('op_list_box').innerHTML = "";
            var procedure_obj = evt.getData()["outputs"];

            //STORE TIME INTERVAL
            $("#time-info").val(procedure_obj[0]["constraint"]["interval"]);
            //sTimeInfo.setAttribute("name", procedure_obj[0]["constraint"]["interval"]);
            //sTimeInfo.setAttribute("id", "time-info");
            //document.getElementById('procedure_list_box').appendChild(sTimeInfo);

            var classification = evt.getData()["classification"];
            document.getElementById('procedure_list_box').setAttribute("name", classification[0]["value"]);
            console.log(procedure_obj);
            for (var i = 1; i < procedure_obj.length; i++) {
                var label = document.createElement('label');
                var br = document.createElement('br');
                var input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                label.appendChild(input);
                label.setAttribute("value", procedure_obj[i]["definition"])
                label.innerHTML += '&nbsp;&nbsp;' + procedure_obj[i]["name"];
                document.getElementById('op_list_box').appendChild(label);
                document.getElementById('op_list_box').appendChild(br);

            }
        });
    });


    $('#op_list_box').change(function(evt) {
        obList = [];
        $('#op_list_box label').children().each(function() {
            var val = this.parentNode.innerText.trim() + '&&' + this.parentNode.getAttribute('value');
            if (this.checked) {
                obList.push(val);
            } else {
                $.grep(obList, function(value) {
                    return value != val;
                });
            }
        });

        $('#op_list_box').attr('value', obList);
    });

    $('#generate_box').click(function() {
        var begin = $('#time-info').val().split(',')[0];
        var end = ($('#time-info').val().split(',')[1]);
        var preview = document.getElementById('preview');
        var newBox = new istsos.widget.Box();
        newBox.setService($('#service_list_box').attr("value"));
        newBox.setOffering($('#offering_list_box').attr("value"));
        newBox.setProcedure($('#procedure_list_box').attr("value"));
        newBox.setObservedProperties($('#op_list_box').attr("value").split(','));
        newBox.setInterval([begin, end]);
        if(document.getElementById("radVert").checked) {
            newBox.setLayout(true);
        } else {
            newBox.setLayout(false);
        }
        
        console.log(newBox.getLayout())
        if (preview !== null) {
            document.getElementById('preview').innerHTML = "";
            newBox.setElementId('preview');
            newBox.setCssClass('preview');
            newBox.setHeight(parseInt($('#height').val()));
            newBox.setWidth(parseInt($('#width').val()));
            newBox.build();
        }
        newBox.setElementId($('#elementId').val());
        newBox.setCssClass($('#css_class').val());
        newBox.setHeight(parseInt($('#height').val()));
        newBox.setWidth(parseInt($('#width').val()));
        var code = istsos.widget.getCode(newBox.getConfig());
        $('#code_output').val(code);
    });


});