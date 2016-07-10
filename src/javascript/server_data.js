$(document).ready(function () {
    var istsosContainer = new istsos.IstSOS();
    var db = new istsos.Database('istsos', 'localhost', 'postgres', 'postgres', 5432);
    var server = new istsos.Server('istsos', 'http://localhost/istsos/', db);
    istsosContainer.addServer(server);
    server.getServices();

    istsos.once(istsos.events.EventType.SERVICES, function (evt) {
        var services_obj = evt.getData();
        for (var i = 0; i < services_obj.length; i++) {
            var s = document.createElement('li');
            s.className = 'list-group-item';
            s.innerHTML = services_obj[i]["service"];
            console.log(s);
            document.getElementById('service_list').appendChild(s);
        }
    })
});
