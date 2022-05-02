import path from "path";
import { 
	code, 
	execute, 
	ProgrammingLanguage, 
	set, 
	functions as polylingualFunctions, 
	ProgrammingUnderscore, 
	ProgrammingTimeout, 
	block, 
	symbol, 
	sub, 
	condition, 
	fallback, 
	eq, 
	ProgrammingDate, 
	declare, 
	not, 
	add, 
	or, 
	and, 
	gt, 
	result,
	invoke
} from "polylingual";
import { EventConfig } from "../dist";
import { 
	Animation,
	Alignment,
	Adapter, 
	Component, 
	ComponentBoxProps, 
	ComponentConfig, 
	ComponentEvents, 
	ComponentFromConfig, 
	Data, 
	GlobalState, 
	Tag, 
	Unarray, 
	UnwrapBoxProp,
	Border,
	NavigationState
} from "./types";
import { writeFile, mkdir } from "fs/promises";

export * from "polylingual";
export * from "./types";

export const MATCH = -1;
export const WRAP = -2;

export const generateId = () => `_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;

const tag = (name : Tag) => <Global extends GlobalState, Local>(
	width : number,
	height : number,
	props : (ComponentFromConfig<Global, Local> | string)[]
) : ComponentFromConfig<Global, Local> => (
		config
	) => {
		const { parent } = config;
		const component = applyProps({
			width,
			height,
			name,
		}, props, config);
		parent.children = parent.children || [];
		parent.children.push(component);
		return parent;
	};

const applyProps = <Global extends GlobalState, Local>(
	component : Component<Global, Local>,
	props : (ComponentFromConfig<Global, Local> | string)[],
	config : ComponentConfig<Global, Local>
) => {
	const cache = config.parent;
	config.parent = component;
	const ret = props.reduce((component, prop) => {
		if(typeof prop === "string") {
			component.text = prop;
			return component;
		} else {
			return prop(config);
		}
	}, component);
	config.parent = cache;
	return ret;
};

const setProperty = <
	Key extends keyof Component<GlobalState, GlobalState>,
	Value extends Component<GlobalState, GlobalState>[Key]
>(
		name : Key
	) => <Global extends GlobalState, Local>(
		value : Value
	) : ComponentFromConfig<Global, Local> => ({
			parent
		}) => {
			parent[name] = value as any;
			return parent;
		};

const event = <Global extends GlobalState, Local, Key extends keyof ComponentEvents<Global, Local>>(
	name : Key
) : any => <Global extends GlobalState, Local>(
		callback : Unarray<ComponentEvents<Global, Local>[Key]>
	) : ComponentFromConfig<Global, Local> => {
	const id = generateId();
	return (config) => {
		const { parent } = config;
		parent.id = parent.id || id;
		parent[name] = parent[name] || [];
		parent[name]?.push(callback as () => any);
		return parent;
	};
};

const box = <Key extends keyof ComponentBoxProps, Type extends UnwrapBoxProp<ComponentBoxProps[Key]>>(
	name : Key
) => <
    Global extends GlobalState,
    Local
>(
			input : Type | [Type] | [Type, Type] | [Type, Type, Type, Type] | {
        top?: Type
        right?: Type
        bottom?: Type
        left?: Type
    }
		) : ComponentFromConfig<Global, Local> => (config) => {
			const {parent} = config;
			if(input instanceof Array) {
				if(input.length === 1) {
					parent[name] = {
						top : input[0],
						right : input[0],
						bottom : input[0],
						left : input[0],
					} as any;
				} else if(input.length === 2) {
					parent[name] = {
						top : input[0],
						right : input[1],
						bottom : input[0],
						left : input[1],
					} as any;
				} else if(input.length === 4) {
					parent[name] = {
						top : input[0],
						right : input[1],
						bottom : input[2],
						left : input[3],
					} as any;
				}
			} else {
				const box = input as any;
				if(typeof box === "object" && ("top" in box || "right" in box || "bottom" in box || "left" in box)) {
					config.parent[name] = input as any;
				} else {
					parent[name] = {
						top : input,
						right : input,
						bottom : input,
						left : input,
					} as any;
				}
			}
			return parent;
		};

export const margin = box("margin");
export const padding = box("padding");
export const border = box<"border", Border | undefined>("border");
export const position = box("position");

// TAGS

export const date = tag("date");
export const progress = tag("progress");
export const row = tag("row");
export const column = tag("column");
export const button = tag("button");
export const scrollable = tag("scrollable");
export const text = tag("text");
export const stack = tag("stack");
export const input = tag("input");
export const select = tag("select");
export const image = tag("image");
export const option = <Global extends GlobalState, Local>(
	props : Array<string | ComponentFromConfig<Global, Local>>
) => tag("option")(WRAP, WRAP, props);
export const checkbox = <Global extends GlobalState, Local>(
	props : Array<string | ComponentFromConfig<Global, Local>>
) => tag("checkbox")(WRAP, WRAP, props);

// PROPS

export const background = setProperty("background");
export const grow = setProperty("grow");
export const value = setProperty("value");
export const animation = setProperty<"animation", Animation>("animation");
export const mainAxisAlignment = setProperty<"mainAxisAlignment", Alignment>("mainAxisAlignment");
export const crossAxisAlignment = setProperty<"crossAxisAlignment", Alignment>("crossAxisAlignment");
export const size = setProperty("size");
export const color = setProperty("color");
export const src = setProperty("src");
export const round = setProperty("round");
export const placeholder = setProperty("placeholder");
export const clip = setProperty("clip");
export const shadow = setProperty("shadow");
export const markdown = setProperty("markdown");
export const opacity = setProperty("opacity");
export const manifest = setProperty("manifest");
export const alt = setProperty("alt");
export const clickable = setProperty("clickable");
export const bundle = setProperty("bundle");

const ids : Record<string, boolean> = {};
export const id = <Global extends GlobalState, Local>(id : string) : ComponentFromConfig<Global, Local> => {
	if(ids[id]) {
		console.warn("ids must be globally unique", id);
	}
	ids[id] = true;
	return ({
		parent
	}) => {
		parent.id = id;
		return parent;
	};
};

// EVENTS

export const observe : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, Component<Global, Local>>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("observe");
export const onResize : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, {
		width : number
		height : number
	}>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onResize");
export const onClick : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onClick");
export const onEnter : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onEnter");
export const onInit : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onInit");
export const onDragStart : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onDragStart");
export const onDragEnd : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onDragEnd");
export const onDrop : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onDrop");
export const onBack : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onBack");
export const onChange : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, string | boolean | number>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onChange");

export const bind = <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, unknown>) => string | boolean | number
) => props<Global, Local>([
	onChange(
		config => set(callback(config), config.event)
	),
	observe(
		config => set(config.event.value, callback(config))
	),
]);

export const adapters = <Global extends GlobalState, Local>(
	adapters : Adapter<Global>
) : ComponentFromConfig<Global, Local> => {
	const id = generateId();
	return (config) => {
		config.parent.id = config.parent.id || id;
		config.parent.adapters = adapters;
		return config.parent;
	};
};

export const recursive = <Global extends GlobalState, Local>(
	callback : () => ComponentFromConfig<Global, Local>
) : ComponentFromConfig<Global, Local> => (
		config
	) => {
		return callback()(config);
	};

export const test = <Global extends GlobalState, Local>(
	component : ComponentFromConfig<Global, Local>,
	global : Global,
	local : Local,
	mocks : Record<string, unknown> = {}
) => {
	const root = component({
		global,
		local,
		parent : {
			height : WRAP,
			width : WRAP,
			name : "root",            
		}
	});
	const init = (document = root) => {
		trigger(document, "onInit");
		(document.children ?? []).forEach(init);
	};
	const update = (document = root) => {
		(document.observe ?? []).forEach((callback) => {
			const generated = code(callback, new Set([]));
			execute(generated, {
				event : document,
				global,
				index : -1,
				local,
				...mocks
			});
		});
		(document.children ?? []).forEach(update);
		validate(document);
	};
	const validate = (component : Component<Global, Local>) => {
		const count = [
			component.text, 
			component.children, 
			component.adapters
		].reduce((count, value) => {
			return count + (value ? 1 : 0);
		}, 0);

		if(count > 1) {
			console.warn("a single component should not have two children types");
		}

		if(component.name !== "text" && typeof component.text === "string") {
			console.warn("should only have text in text components");
		}

		if(component.name === "text" && typeof component.text !== "string") {
			console.warn("all text fields should have their text set");
		}
	};
	const triggerById = (
		id : string, 
		name : keyof ComponentEvents<Global, Local>, 
		event?: any
	) : boolean => {
		return trigger(api.id(id), name, event);
	};
	const trigger = (
		component : Component<Global, Local> | null, 
		name : keyof ComponentEvents<Global, Local>, 
		event?: any
	) : boolean => {
		if(component?.enabled !== false) {
			const callbacks = component?.[name];
			if(callbacks && callbacks.length) {
				callbacks.forEach(callback => {
					const generated = code(callback as any, new Set([]));
					execute(generated, {
						event,
						global,
						index : -1,
						local,
						...mocks
					});
				});
				return true;
			}
		}
		return false;
	};
	const api = {
		enter(id : string) {
			if(triggerById(id, "onEnter")) {
				update();
			}
		},
		click(id : string) {
			if(triggerById(id, "onClick")) {
				update();
			}
		},
		id(id : string, document = root) : Component<Global, Local> | null {
			if(document.id === id) {
				return document;
			} else {
				return (document.children ?? []).reduce((match, child) => match || this.id(id, child), null as (Component<Global, Local> | null));
			}
		}
	};
	init();
	update();
	return api;
};

export const props = <Global extends GlobalState, Local>(
	props : Array<string | ComponentFromConfig<Global, Local>>
) : ComponentFromConfig<Global, Local> => (config) => {
		props.forEach(prop => {
			if(typeof prop === "string") {
				config.parent.text = prop;
			} else {
				prop(config);
			}
		});
		return config.parent;
	};

export const screen = <Global extends GlobalState>(
	child : ComponentFromConfig<Global, Data & {
		animation : Animation
	}>
) => stack<Global, Data & {
	animation : Animation
}>(MATCH, MATCH, [
	id("screen"),
	clickable(true),
	position({
		top : 0,
		left : 0
	}),
	observe(({
		event,
		local
	}) => set(event.animation, {
		direction : local.animation.direction,
		name : "right",
		start : local.animation.start,
	})),
	child,
]);

export const modal = <Global extends GlobalState>(
	child : ComponentFromConfig<Global, Data & {
		animation : Animation
	}>
) => scrollable<Global, Data & {
	animation : Animation
}>(MATCH, MATCH, [
	id("modal"),
	clickable(true),
	padding(16),
	position({
		top : 0,
		left : 0
	}),
	background("#000000aa"),
	observe(({
		event,
		local
	}) => set(event.animation, {
		direction : local.animation.direction,
		name : "opacity",
		start : local.animation.start,
	})),	
	stack(MATCH, WRAP, [
		background("white"),
		round(4),
		child,
	])
]);

export const fab = <Global extends GlobalState, Local>(contents : Array<string | ComponentFromConfig<Global, Local>>) => 
	button<Global, Local>(56, 56, [
		shadow(true),
		padding(8),
		round(28),
		props(contents)
	]);

export const functions = <T>(
	callback : (event : EventConfig<any, any, never>) => T
) : {
	(): ProgrammingLanguage
} & T => {
	return polylingualFunctions(callback as any, {
		local: {},
		global : {}, 
		event: {}, 
		index:0,
		socket : {
			on : () => {
				// DO NOTHING
			}
		},
		speech : {
			speak : () => {
				// DO NOTHING
			},
			listen : () => {
				// DO NOTHING
			}
		},
		picker : {
			date : () => {
				// DO NOTHING
			}
		},
		moment : () => ({
			format : () => "",
			isSame : () => false
		})
	});
};

export const navigation = functions(({
	global,
	_,
	Date
} : {
	global : NavigationState
	_ : ProgrammingUnderscore
	Date : ProgrammingDate
}) => ({
	pushRoute: ({
		route
	} : {
		route : string
	}) => set(global.routes, _.concat(fallback(global.routes, []), [{
		id : route,
		adapter : route,
		animation : {
			start : Date.now(),
			direction : "in",
			name : "right"
		}
	}])),
	popRoute: () => invoke({
		fun : "onBack",
		args : [],
		sideEffect : true,
		target : undefined,
		dependencies : new Set<string>([])
	})
}));

export const feature = <Global extends GlobalState, Local>({
	name,
	component,
	fallback
} : {
	name : string
	component : ComponentFromConfig<Global, Local>
	fallback : ComponentFromConfig<Global, Local>
}) : ComponentFromConfig<Global, Local> => (config) => {
		return config.global.features?.includes(name) ? component(config) : fallback(config);
	};

export const router = <Global extends GlobalState & NavigationState>(config : {
	initial : string
	adapters : Adapter<Global>
	onBack : (event: EventConfig<Global, Global, null>) => ProgrammingLanguage
}) => stack<Global, Global>(MATCH, MATCH, [
	id("router"),
	funcs(navigation),
	observe(({
		global,
		event
	}) => set(event.data, global.routes)),
	onInit(({
		global,
		Date
	}) => condition(
		eq(fallback(global.routes, []).length, 0), 
		set(global.routes, [{
			id : Date.now().toString(16),
			adapter : config.initial,
			animation : {
				direction : "in",
				name : "right",
				start : 0
			}		
		}])
	)),
	onBack((onBackConfig) => {
		const {
			global,
			setTimeout,
			_,
			Date
		} = onBackConfig;
		return declare(({
			routes,
			timeout
		}) => [
			config.onBack(onBackConfig),						
			condition(gt(fallback(routes, []).length, 1), block([
				set(symbol(routes, sub(routes.length, 1)).animation, {
					direction : "out",
					name : "right",
					start : Date.now()
				}),
				condition(eq(global.os, "ios"), set(
					timeout,
					0
				)),
				setTimeout(() => set(global.routes, _.slice(routes, 0, -1)), timeout),
				result(true)
			]))
		], {
			timeout: 300,
			routes : fallback(global.routes, [])
		});
	}),
	adapters(config.adapters)
]);

export const funcs = <Global extends GlobalState, Local>(funcs : () => ProgrammingLanguage) : ComponentFromConfig<Global, Local> => (config) => {
	config.parent.funcs = config.parent.funcs || [];
	config.parent.funcs.push(funcs());
	return config.parent;
};

const DEFAULT_TOAST = {
	curr : {
		id : "curr",
		adapter : "local",
		message : "",
		animation : <Animation>{
			direction : "in",
			name : "right",
			start : 0
		}
	},
	prev : {
		id : "prev",
		adapter : "local",
		message : "",
		animation : <Animation>{
			direction : "in",
			name : "right",
			start : 0
		}
	},
	queue : [],
	isFree : true
};

type ToasterItem = Data & {
	message : string
}

export type ToasterState = {
	toast?: {
		prev : ToasterItem
		curr : ToasterItem
		queue : Array<string>
		isFree : boolean
	}
}

export const helpers = functions(({
	Date,
	_,
	Math
}) => ({
	generateId : () => result(add(Date.now().toString(16), "_", _.slice(Math.random().toString(16), 2))) as unknown as string,
}));

export const toast = functions(({
	global,
	_,
	Date,
	setTimeout
} : {
	global : ToasterState
	_ : ProgrammingUnderscore
	Date : ProgrammingDate
	setTimeout : ProgrammingTimeout
}) => ({
	pushToast : ({
		message
	} : {
		message : string
	}) => declare(({
		instance
	}) => [
		set(instance.queue, _.concat(instance.queue, [message])),
		set(global.toast, instance),
		toast.nextToast()
	], {
		instance : fallback(global.toast, DEFAULT_TOAST)
	}),
	nextToast : () : ProgrammingLanguage => declare(({
		instance
	}) => [
		condition(
			and(
				instance.isFree,
				or(
					not(eq(instance.queue.length, 0)),
					not(eq(instance.curr.message, ""))
				)
			),
			declare(({
				now,
				timeout
			}) => [
				set(instance.isFree, false),
				set(instance.prev, {
					id : instance.curr.id as string,
					message : instance.curr.message,
					adapter : "local",
					animation : {
						direction : "out",
						name : "left",
						start : now
					}
				}),
				set(instance.curr, {
					id : helpers.generateId(),
					message : fallback(symbol(instance.queue, 0), ""),
					adapter : "local",
					animation : {
						direction : "in",
						name : "right",
						start : now
					}
				}),
				set(instance.queue, _.slice(instance.queue, 1, instance.queue.length)),
				condition(
					not(eq(instance.curr.message, "")),
					set(timeout, add(300, 5000))
				),
				setTimeout(() => block([
					set(instance.isFree, true),
					set(global.toast, instance),
					toast.nextToast()
				]), timeout)
			], {
				now : Date.now(),
				timeout : 300
			})
		).otherwise(
			set(instance.prev, {
				id : "",
				message : "",
				adapter : "local",
				animation : {
					direction : "out",
					name : "left",
					start : Date.now()
				}
			}),
		),
		set(global.toast, instance),
	], {
		instance : fallback(global.toast, DEFAULT_TOAST)
	})
}));

const toasterItem = <Global extends GlobalState & ToasterState>() => column<Global, ToasterItem>(MATCH, WRAP, [
	id("toaster_item"),
	position({
		bottom : 0
	}),
	padding(16),
	observe(({
		local,
		event
	}) => block([
		set(event.visible, not(eq(local.message, ""))),
		set(event.animation, local.animation)
	])),
	text(MATCH, WRAP, [
		opacity(.9),
		background("black"),
		color("white"),
		padding(16),
		observe(({
			local,
			event
		}) => block([
			set(event.text, local.message),
		]))
	]),		
]);

export const toaster = <Global extends GlobalState & ToasterState, Local>() => stack<Global, Local>(MATCH, WRAP, [
	clickable(false),
	id("toaster"),
	position({
		bottom : 0
	}),
	onInit(({
		global
	}) => set(global.toast, DEFAULT_TOAST)),
	funcs(toast),
	funcs(helpers),
	observe(({
		event,
		global
	}) => declare(({
		toast,
	}) => [
		set(event.data, [
			toast.prev,
			toast.curr,
		])
	], {
		toast : fallback(global.toast, DEFAULT_TOAST)
	})),
	adapters({
		local : toasterItem()
	}),
]);

const speech = {
	listen : () => {
		// DO NOTHING
	},
	speak : () => {
		// DO NOTHING
	}
};

const moment = () => ({
	format : () => "",
	isSame : () => false
});

const picker = {
	date : () => {
		// DO NOTHING
	}
};

export const stubs ={
	moment,
	picker,
	speech
};

export const compile = (
	callback : (config : any) => ProgrammingLanguage,
	dependencies : Set<string>
) => {
	return code(callback, dependencies, stubs);
};

export const write = async (dir : string, output : Record<string, string | Buffer>) : Promise<void> => {
	await Promise.all(Object.keys(output).map(async file => {
		await mkdir(path.dirname(path.join(dir, file))).catch(() => {
			// DO NOTHING
		});
		await writeFile(path.join(dir, file), output[file]);
	}));
};