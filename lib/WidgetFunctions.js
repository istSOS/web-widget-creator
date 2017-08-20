import WidgetTypes from 'WidgetTypes';
import {Map} from 'Map';

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

let getCode = (config) => {
	return "<script src=\"" + config.dataConfig.library_path + "\"></script>\n" +
			 "<script>istsosWidget.WidgetFunctions.build(" + JSON.stringify(config) + ",\"" + config.type + "\")</script>"
}

let updateData = (widget) => {

}


let build = (config, type) => {
	let preview;
	let widget;
	switch (type) {
		case WidgetTypes.TYPE_MAP:
			widget = new Map(config);
			widget.build();
			let code = getCode(widget.getConfig());

			preview = widget;
			preview.setElementId('preview');
			preview.setCssClass('preview');
			preview.setHeight('100%');
			preview.setWidth('100%');
			preview.build()

			return {
				preview, widget, code
			}
			break;
		case WidgetTypes.TYPE_BOX:
			// statements_1
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
   newerDate,
   olderDate,
   getCode,
   build
}
