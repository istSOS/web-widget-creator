import {WidgetTypes} from 'WidgetTypes';
import {Map} from 'Map';
import {Box} from 'Box';

//GET NEWER DATE
let newerDate = (date1, date2) => {
	let dateTime1 = new Date(date1);
	let dateTime2 = new Date(date2);
	return ((dateTime1.getTime() - dateTime2.getTime()) >= 0) ? dateTime1.toISOString() : dateTime2.toISOString();
}

//GET OLDER DATE
let olderDate = (date1, date2) => {
	let dateTime1 = new Date(date1);
	let dateTime2 = new Date(date2);
	return ((dateTime1.getTime() - dateTime2.getTime()) <= 0) ? dateTime1.toISOString() : dateTime2.toISOString();
}

let getCode = (config, type) => {
	return "<script src=\"" + config.data.library_path + "\"></script>\n" +
			 "<script>istsosWidget.WidgetFunctions.build(" + JSON.stringify(config) + ",\"" + type + "\")</script>"
}

let updateData = (widget) => {

}

let getUrlByValue = (value, list) => {
	for(let i = 0; i < list.length; i++) {
		if(parseFloat(value) >= list[i].from && value < list[i].to) {
			return list[i].url
		}
	}
}


let build = (config, type) => {
	let preview;
	let widget;
	let code;
	switch (type) {
		case WidgetTypes.TYPE_MAP:
			widget = new Map(config);
			widget.build();
			code = getCode(config, WidgetTypes.TYPE_MAP);

			preview = widget;
			preview.setElementId('preview');
			preview.setCssClass('preview');
			preview.build()

			return {
				preview, widget, code
			}
			break;
		case WidgetTypes.TYPE_BOX:
			widget = new Box(config);
			widget.build();
			code = getCode(config, WidgetTypes.TYPE_BOX);

			preview = widget;
			preview.setElementId('preview');
			preview.setCssClass('preview');
			preview.build()

			return {
				preview, widget, code
			}
			break;
		case WidgetTypes.TYPE_CHART:
			// statements_1
			break;
		default:
			// statements_def
			break;
	}
}

export {
	getUrlByValue,
   newerDate,
   olderDate,
   getCode,
   build
}
