
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

}

let updateData = (widget) => {

}


let build = () => {

}

export {
   newerDate,
   olderDate,
   getCode,
   build
}
