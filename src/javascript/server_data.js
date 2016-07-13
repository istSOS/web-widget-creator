$(document).ready(function () {
    var istsosContainer = new istsos.IstSOS();
    var db = new istsos.Database('istsos', 'localhost', 'postgres', 'postgres', 5432);
    var server = new istsos.Server('istsos', 'http://istsos.org/istsos/', db);
    istsosContainer.addServer(server);
    server.getServices();

    istsos.once(istsos.events.EventType.SERVICES, function (evt) {
        var services_obj = evt.getData();
        for (var i = 0; i < services_obj.length; i++) {
            var service = new istsos.Service(services_obj[i]["service"], server);
            var s = document.createElement('li');
            s.className = 'list-group-item service_name';
            s.innerHTML = services_obj[i]["service"];
            s.setAttribute('value', services_obj[i]["service"]);
            document.getElementById('service_list').appendChild(s);
            service.getProcedures();
        }
    });

    istsos.on(istsos.events.EventType.PROCEDURES, function (evt) {
        var procedures_obj = evt.getData();
        var message = evt["message"];
        var start = message.indexOf('<') + 1;
        var end = message.indexOf('>');
        var service_name = message.substring(start, end);

        var service_list = $('.service_name');
        for (var i = 0; i < service_list.length; i++) {
            if (service_list[i].textContent == service_name) {
                var ul = document.createElement('ul');
                ul.className = 'list-group under_service';
                ul.innerHTML = 'PROCEDURES';
                service_list[i].appendChild(ul);
                procedures_obj.forEach(function (p) {
                    var li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.innerHTML = p["name"];
                    ul.appendChild(li);
                });

            }
        }
    });




});
