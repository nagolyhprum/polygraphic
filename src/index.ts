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
	invoke,
	sub,
	gte,
	lt
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
	NavigationState,
	AddableComponent,
	Measurable,
	TutorialState
} from "./types";
import { writeFile, mkdir } from "fs/promises";

export * from "polylingual";
export * from "./types";

export const MATCH = -1;
export const WRAP = -2;

const speech = {
	listen : () => {
		// DO NOTHING
	},
	speak : () => {
		// DO NOTHING
	}
};

const handlebars = () => "";

const moment = () => ({
	format : () => "",
	isSame : () => false
});

const picker = {
	date : () => {
		// DO NOTHING
	}
};

const audio = {
	play : () => {
		// DO NOTHING
	},
	record : () => {
		// DO NOTHING
	},
	stop : () => {
		// DO NOTHING
	}
};

const recaptchaInstance = {
	execute : () => {
		// DO NOTHING
	}
};

export const stubs ={
	moment,
	picker,
	speech,
	audio,
	handlebars,
	recaptcha : recaptchaInstance
};

export const generateId = () => `_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;

const tag = (name : Tag) => <Global extends GlobalState, Local>(
	width : Measurable,
	height : Measurable,
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

export const canvas = tag("canvas");
export const textarea = tag("textarea");
export const iframe = tag("iframe");
export const editor = tag("editor");
export const flex = tag("flex");
export const date = tag("date");
export const progress = tag("progress");
export const row = tag("row");
export const content = tag("content");
export const column = tag("column");
export const button = tag("button");
export const scrollable = tag("scrollable");
export const text = tag("text");
export const stack = tag("stack");
export const fixed = tag("fixed");
export const input = tag("input");
export const number = tag("number");
export const grid = tag("grid");
export const select = tag("select");
export const image = tag("image");
export const anchor = tag("anchor");
export const option = <Global extends GlobalState, Local>(
	props : Array<string | ComponentFromConfig<Global, Local>>
) => tag("option")(WRAP, WRAP, props);
export const checkbox = <Global extends GlobalState, Local>(
	props : Array<string | ComponentFromConfig<Global, Local>>
) => tag("checkbox")(WRAP, WRAP, props);

// PROPS

export const analytics = setProperty("analytics");
export const recaptcha = setProperty("recaptcha");
export const rel = setProperty("rel");
export const float = setProperty("float");
export const html = setProperty("html");
export const editable = setProperty("editable");
export const width = setProperty("width");
export const height = setProperty("height");
export const index = setProperty("index");
export const visible = setProperty("visible");
export const columns = setProperty("columns");
export const max = setProperty("max");
export const min = setProperty("min");
export const direction = setProperty("direction");
export const href = setProperty("href");
export const target = setProperty("target");
export const whitespace = setProperty("whitespace");
export const background = setProperty("background");
export const grow = setProperty("grow");
export const value = setProperty("value");
export const animation = setProperty<"animation", Animation>("animation");
export const align = setProperty<"align", Alignment>("align");
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
export const title = setProperty("title");
export const translate = setProperty("translate");
export const rotate = setProperty("rotate");

const setFont = (weight : number) => <Global extends GlobalState, Local>(size : number) : ComponentFromConfig<Global, Local> => (config) => {
	config.parent.weight = weight;
	config.parent.size = size;
	return config.parent;
};
export const regular = setFont(400);
export const medium = setFont(500);
export const bold = setFont(700);

const addProperty = <
	Key extends keyof AddableComponent
>(
		name : Key
	) => <Global extends GlobalState, Local>(
		key : string,
		value : string
	) : ComponentFromConfig<Global, Local> => ({
			parent
		}) => {
			const map = (parent[name] = parent[name] || {}) as Record<string, string>;
			map[key] = value;
			return parent;
		};

export const link = addProperty("links");
export const meta = addProperty("metas");

const ids : Record<string, boolean> = {};
export const id = <Global extends GlobalState, Local>(id : string) : ComponentFromConfig<Global, Local> => {
	if(id && ids[id]) {
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
		x : number
		y  : number
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
	callback : (event : EventConfig<Global, Local, File[]>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onDrop");
export const onBack : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onBack");
export const onChange : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, string | boolean | number>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onChange");
export const onContext : <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage
) => ComponentFromConfig<Global, Local> = event("onContext");

export const bind = <Global extends GlobalState, Local>(
	callback : (event : EventConfig<Global, Local, unknown>) => string | boolean | number | null | undefined
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
	clip(true),
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
	clip(true),
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

export const landmark = {
	navigation : tag("nav"),
	header : tag("header"),
	footer : tag("footer"),
	section : tag("section"),
	primary : tag("h1"),
	secondary : tag("h2"),
	tertiary : tag("h3"),
	paragraph : tag("p"),
	main : tag("main"),
};

export const fab = <Global extends GlobalState, Local>(contents : Array<string | ComponentFromConfig<Global, Local>>) => 
	button<Global, Local>(56, 56, [
		shadow(true),
		padding(8),
		round(28),
		props(contents)
	]);

export const functions = <T>(
	name : string,
	callback : (event : EventConfig<any, any, never>) => T
) : {
	(): ProgrammingLanguage
} & T => {
	return polylingualFunctions(name, callback as any, {
		local: {},
		global : {}, 
		event: {}, 
		index:0,
		socket : {
			on : () => {
				// DO NOTHING
			}
		},
		...stubs
	});
};

export const navigation = functions("Navigation", ({
	global,
	_,
	Date,
	setTimeout
} : {
	global : NavigationState
	_ : ProgrammingUnderscore
	Date : ProgrammingDate
	setTimeout : ProgrammingTimeout
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
	}),
	clearRoutes: ({
		route
	} : {
		route : string
	}) => block([
		set(global.routes, _.concat(fallback(global.routes, []), [{
			id : route,
			adapter : route,
			animation : {
				start : Date.now(),
				direction : "in",
				name : "right"
			}
		}])),
		setTimeout(() => set(
			global.routes,
			_.slice(fallback(global.routes, []), -1)
		), 600)
	]),
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
			timeout,
			routeIndex
		}) => [
			config.onBack(onBackConfig),					
			_.forEach(routes, ({
				item,
				index
			}) => condition(
				eq(item.animation?.direction, "in"),
				set(
					routeIndex,
					index
				)
			)),
			condition(gt(routeIndex, -1), block([
				set(symbol(routes, routeIndex).animation, {
					direction : "out",
					name : "right",
					start : Date.now()
				}),
				condition(eq(global.os, "ios"), set(
					timeout,
					0
				)),
				setTimeout(() => set(global.routes, _.slice(routes, 0, routeIndex)), timeout),
				result(true)
			]))
		], {
			routeIndex: -1,
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

export const helpers = functions("Helper", ({
	Date,
	_,
	Math
}) => ({
	generateId : () => result(add(Date.now().toString(16), "_", _.slice(Math.random().toString(16), 2))) as unknown as string,
}));

export const toast = functions("Toast", ({
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
				timeout : 600
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

export const media = <T extends Record<string, [number, number]>>(
	media : T
) => <Global extends GlobalState, Local>(
		key : keyof T,
		styles : ComponentFromConfig<Global, Local>
	) : ComponentFromConfig<Global, Local> => (config) => {
			const range = media[key];
			let query;
			if(range[0] <= 0) {
				query = `@media screen and (max-width: ${range[1] + 0.05}px)`;
			} else if(!Number.isFinite(range[1])) {
				query = `@media screen and (min-width: ${range[0]}px)`;
			} else {
				query = `@media screen and (min-width: ${range[0]}px) and (max-width: ${range[1] + 0.05}px)`;
			}
			const queries = config.parent.queries = config.parent.queries || {};
			const applied = queries[query] = queries[query] || {};
			return applyProps(applied, [styles], config);
		};

export const step = <Global extends GlobalState & TutorialState, Local>(config : {
	width : Measurable;
	height : Measurable;
	name : string;
	text : string;
	children : Array<ComponentFromConfig<Global, Local>>;
	onClick : (event : EventConfig<Global, Local, null>) => ProgrammingLanguage;
	condition : (config : EventConfig<Global, Local, {
		x : number;
		y : number;
		width : number;
		height : number;
	}>) => boolean;
}) => {
	return button<Global, Local>(config.width, config.height, [	
		onInit(({
			global,
			setTimeout,
		}) => declare(({
			tutorial
		}) => [
			set(tutorial.isReady, false),
			set(global.tutorial, tutorial),
			setTimeout(() => block([
				set(tutorial.isReady, true),
				set(global.tutorial, tutorial),
			]), 600),
		], {
			tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
		})),
		observe(({
			global,
			event,
		}) => declare(({
			tutorial
		}) => [
			condition(tutorial.isReady, set(
				event.resize,
				true,
			))
		], {
			tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
		})),
		onResize((onResizeConfig) => {
			const {
				event,
				global,
			} = onResizeConfig;
			return declare(({
				tutorial
			}) => [
				condition(
					and(
						tutorial.isReady, // animations are done
						not(symbol(tutorial.completed, config.name)), // we have not done this one yet
						or(
							eq(tutorial.active.name, ""), // there is not an active one
							eq(tutorial.active.name, config.name) // or it is this
						),
						config.condition(onResizeConfig), // the callee says so
					), 
					block([
						set(
							tutorial.active,
							{
								name : config.name,
								position : {
									top : event.y,
									right : sub(global.width, add(event.x, event.width)),
									bottom : sub(global.height, add(event.y, event.height)),
									left : event.x,
								},
								text : config.text,
							},
						),
						set(global.tutorial, tutorial)
					])
				)
			], {
				tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
			});
		}),
		onClick((onClickConfig) => declare(({
			tutorial
		}) => [			
			set(symbol(tutorial.completed, config.name), true),
			set(tutorial.active, {
				name : "",
				text : "",
				position : {
					top : 0,
					right : 0,
					bottom : 0,
					left : 0,
				},
			}),
			config.onClick(onClickConfig),
		], {
			tutorial : fallback(onClickConfig.global.tutorial, EMPTY_TUTORIAL)
		})),
		...config.children,
	]);
};

const EMPTY_TUTORIAL : Required<TutorialState>["tutorial"] = {
	active : {
		name : "",
		position : {
			top : 0,
			right : 0,
			bottom : 0,
			left : 0
		},
		text : "",
	},
	completed : {},
	isReady : false
};

export const tutorial = <Global extends GlobalState & TutorialState, Local>() => {
	const dismiss = ({
		global,
	} : {
		global : Global;
	}) => declare(({
		tutorial
	}) => [		
		set(symbol(tutorial.completed, tutorial.active.name), true),
		set(tutorial.active, {
			name : "",
			text : "",
			position : {
				top : 0,
				right : 0,
				bottom : 0,
				left : 0,
			},
		}),
		set(global.tutorial, tutorial)
	], {
		tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
	});
	return stack<Global, Local>(MATCH, MATCH, [
		observe(({
			event,
			global
		}) => declare(({
			tutorial
		}) => [
			condition(
				and(tutorial.isReady, not(eq(tutorial.active.name, ""))), 
				set(
					event.opacity,
					1
				)
			).otherwise(
				set(
					event.opacity,
					0
				)
			)
		], {
			tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
		})),
		onResize(({
			global,
			event,
		}) => block([
			set(
				global.width,
				event.width,
			),
			set(
				global.height,
				event.height,
			),
		])),
		onInit(({
			global,
		}) => declare(({
			tutorial
		}) => [
			set(
				global.tutorial, {
					isReady : false,
					active : {
						name : "",
						position : {
							bottom : 0,
							left : 0,
							right : 0,
							top : 0,
						},
						text : "",
					},
					completed : tutorial.completed,
				},
			)
		], {
			tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
		})),
		clickable(false),
		position(0),
		// top
		stack(WRAP, WRAP, [
			onClick(dismiss),
			clickable(true),
			background("rgba(0, 0, 0, .7)"),
			observe(({
				event,			
				global,
			}) => declare(({
				tutorial
			}) => [
				set(
					event.position,
					{
						top : 0,
						right : 0,
						bottom : sub(global.height, tutorial.active.position.top),
						left : 0
					}
				)
			], {
				tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
			})),
			text(MATCH, WRAP, [
				align("center"),
				color("white"),
				regular(16),
				padding(16),
				position({
					left : 0,
					bottom : 0,
				}),
				observe(({
					event,
					global,
				}) => declare(({
					tutorial
				}) => [
					set(
						event.visible,
						gte(tutorial.active.position.top, tutorial.active.position.bottom),
					),
					set(
						event.text,
						tutorial.active.text,
					),
				], {
					tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
				})),
			]),
		]),
		// right
		stack(WRAP, WRAP, [
			onClick(dismiss),
			clickable(true),
			background("rgba(0, 0, 0, .7)"),
			observe(({
				event,			
				global,
			}) => declare(({
				tutorial
			}) => [
				set(
					event.position,
					{
						top : tutorial.active.position.top,
						right : 0,
						bottom : tutorial.active.position.bottom,
						left : sub(global.width, tutorial.active.position.right)
					},
				)
			], {
				tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
			})),
		]),
		// bottom
		stack(WRAP, WRAP, [
			onClick(dismiss),
			clickable(true),
			background("rgba(0, 0, 0, .7)"),
			observe(({
				event,			
				global,
			}) => declare(({
				tutorial
			}) => [
				set(
					event.position,
					{
						top : sub(global.height, tutorial.active.position.bottom),
						right : 0,
						bottom : 0,
						left : 0
					}
				)
			], {
				tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
			})),
			text(MATCH, WRAP, [
				align("center"),
				color("white"),
				regular(16),
				padding(16),
				position({
					top : 0,
					left : 0,
				}),
				observe(({
					event,
					global,
				}) => declare(({
					tutorial
				}) => [
					set(
						event.visible,
						lt(tutorial.active.position.top, tutorial.active.position.bottom),
					),
					set(
						event.text,
						tutorial.active.text,
					),
				], {
					tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
				})),
			]),
		]),
		// left
		stack(WRAP, WRAP, [
			onClick(dismiss),
			clickable(true),
			background("rgba(0, 0, 0, .7)"),
			observe(({
				event,			
				global,
			}) => declare(({
				tutorial
			}) => [
				set(
					event.position,
					{
						top : tutorial.active.position.top,
						right : sub(global.width, tutorial.active.position.left),
						bottom : tutorial.active.position.bottom,
						left : 0,
					},
				)
			], {
				tutorial : fallback(global.tutorial, EMPTY_TUTORIAL)
			})),
		]),
	]);
};