import {
   newerDate,
   olderDate,
   getCode,
   build
} from 'WidgetFunctions';
import {
	TYPES_INFO,
	TYPE_MAP,
	TYPE_BOX,
	TYPE_CHART
} from 'WidgetTypes';
import {Widget} from 'Widget';
import {Map} from 'Map';

module.exports = {
   WidgetFunctions: {
      newerDate: newerDate,
      olderDate: olderDate,
      getCode: getCode,
      build: build
   },
   WidgetTypes: {
      TYPES_INFO,
      TYPE_MAP,
      TYPE_BOX,
      TYPE_CHART
   },
   Widget: Widget,
   Map: Map
}