$(document).ready(function () {
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
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
            service.getObservedProperties();
            service.getOfferingNames();
            service.getProcedures();

        }
    });
    istsos.on(istsos.events.EventType.OFFERING_NAMES, function (evt) {
        var offering_obj = evt.getData();
        var message = evt["message"];
        console.log(message);
        var start = message.indexOf('"')+1;
        console.log(start);
        var end = message.substring(start, message.length).indexOf('"') + start;
        console.log(end);
        var service_name = message.substring(start, end);

        var service_list = $('.service_name');

        for (var i = 0; i < service_list.length; i++) {
            console.log(service_list[i].textContent+ " " + service_name);
            if (service_list[i].textContent == service_name) {

                var ul = document.createElement('ul');
                ul.className = 'list-group under_service text-center';
                ul.setAttribute('id', 'offerings');
                var off_title = document.createElement('h5');
                off_title.innerHTML = '<span id="showDownOffering" class="glyphicon glyphicon-chevron-down text-center minus" data-toggle="collapse" data-target=".offering_name"></span>' +
                '<span id="showRightOffering" class="glyphicon glyphicon-chevron-right text-center plus" data-toggle="collapse" data-target=".offering_name"></span>&nbsp;OFFERINGS';
                off_title.setAttribute('id','showOff');
                ul.appendChild(off_title);
                insertAfter(ul, service_list[i]);
                offering_obj.forEach(function (o) {
                    var li = document.createElement('li');
                    li.className = 'list-group-item offering_name collapse';
                    li.innerHTML = o["name"];
                    ul.appendChild(li);
                });
            }

        }


    });
    $('#showOff').click(function () {
        $('#showDownOffering').toggle();
        $('#showRightOffering').toggle();
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
                ul.className = 'list-group under_service text-center';
                ul.setAttribute('id', 'proc');
                var proc_title = document.createElement('h5');
                proc_title.innerHTML = '<span id="showMinus" class="glyphicon glyphicon-chevron-down text-center minus" data-toggle="collapse" data-target=".procedure_name"></span><span id="showPlus" class="glyphicon glyphicon-chevron-right text-center plus" data-toggle="collapse" data-target=".procedure_name"></span>&nbsp;PROCEDURES';
                proc_title.setAttribute('id','showProc');
                ul.appendChild(proc_title);
                insertAfter(ul, service_list[i]);
                procedures_obj.forEach(function (p) {
                    var li = document.createElement('li');
                    li.className = 'list-group-item procedure_name collapse';
                    li.innerHTML = p["name"];
                    ul.appendChild(li);
                });
            }

        }
        $('#showProc').click(function () {
            $('#showMinus').toggle();
            $('#showPlus').toggle();
        });

    });

    istsos.on(istsos.events.EventType.OBSERVED_PROPERTIES, function (evt) {
        var op_obj = evt.getData();
        var message = evt["message"];
        var start = message.indexOf('<') + 1;
        var end = message.indexOf('>');
        var service_name = message.substring(start, end);

        var service_list = $('.service_name');

        for (var i = 0; i < service_list.length; i++) {
            console.log(service_list[i].textContent+ " = " + service_name);
            if (service_list[i].textContent == service_name) {

                var ul = document.createElement('ul');
                ul.className = 'list-group under_service text-center';
                ul.setAttribute('id', 'offerings');
                var op_title = document.createElement('h5');
                op_title.innerHTML = '<span id="showDownOP" class="glyphicon glyphicon-chevron-down text-center minus" data-toggle="collapse" data-target=".op_name"></span>' +
                '<span id="showRightOP" class="glyphicon glyphicon-chevron-right text-center plus" data-toggle="collapse" data-target=".op_name"></span>&nbsp;OBSERVED PROPERTIES';
                op_title.setAttribute('id','showOP');
                ul.appendChild(op_title);
                insertAfter(ul, service_list[i]);
                op_obj.forEach(function (op) {
                    var li = document.createElement('li');
                    li.className = 'list-group-item op_name collapse';
                    li.innerHTML = op["name"];
                    ul.appendChild(li);
                });
            }

        }
        $('#showOP').click(function () {
            $('#showDownOP').toggle();
            $('#showRightOP').toggle();
        });

    });



});
