const bouncing: { [key: string]: number } = {};

function debounce <F extends Function, T extends unknown>(func: F, args: T[], amount: number, namespace: string = "default") {
	if(bouncing[namespace]) {
		clearTimeout(bouncing[namespace]);
	}
	bouncing[namespace] = window.setTimeout(
		() => {
//			console.log(namespace, ...(args ? args : []));
			delete bouncing[namespace];
			func.call(null, ...args);
		},
		amount
	);
//	console.log(">>", namespace, ...(args ? args : []));
//	console.trace();
}

export default debounce;
