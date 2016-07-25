$(document).ready(function() {
    var server = null;
    istsos.widget.SERVER_PROMISE.done(function(data) {
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
    $('#service_list_box').change(function(evt) {
        document.getElementById('service_list_box').setAttribute('value', evt.target.value);
        var serviceName = evt.target.value;
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

            $('#offering_list_box').change(function(evt) {
                document.getElementById('op_list_box').innerHTML = '<option>-</option>';
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
                    defaultOption.innerHTML = '-- select offering --';
                    document.getElementById('procedure_list_box').appendChild(defaultOption);
                    for (var i = 0; i < member_obj.length; i++) {
                        var option = document.createElement('option');
                        option.innerHTML = member_obj[i]["name"];
                        document.getElementById('procedure_list_box').appendChild(option);
                    }
                });
            });
        }
    });

});