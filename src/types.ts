import { ProgrammingUnderscore, ProgrammingConsole, ProgrammingFetch, ProgrammingJSON, ProgrammingLanguage, ProgrammingDate, ProgrammingTimeout } from "polylingual";

export type Unarray<T> = T extends Array<infer U> ? U : T;

export type Tag = 
    "button" | 
    "checkbox" |
    "column" | 
    "date" |
    "image" | 
    "input" | 
    "option" | 
    "progress" |
    "root" | 
    "row" | 
    "scrollable" | 
    "select" | 
    "stack" | 
    "text" |
    "anchor" |
    "flex" |
    "nav" | "footer" | "header" | "main" | "h1" | "h2" | "h3" | "section" | "p" |
    "grid" |
    "fixed"
    

export type GlobalState = {
    ui?: {
        [key : string] : any
    }
    features?: string[]
    os?: "ios" | "android" | "web"
}

export type PolygraphicSocket = {
    on : (name : string, callback : (config : { data : any }) => void) => void
}

export type PolygraphicSpeech = {
    listen : (config : {
        onResult : (config : {
            results : Array<Array<{
                confidence : number
                transcript : string
                isFinal : boolean
            }>>
        }) => ProgrammingLanguage
        continuous?: boolean
        lang?: string
        interimResults?: boolean
        maxAlternatives?: number
    }) => ProgrammingLanguage
    speak : (config : {
        text : string
        lang : string
        rate : number
    }) => ProgrammingLanguage
}

export type PolygraphicPicker = {
    date : (config : {
        ok : (config : {
            value : number
        }) => ProgrammingLanguage
    }) => ProgrammingLanguage
}

export type PolygraphicMoment = (input : number) => {
    isSame : (input : number, unit : string) => boolean
    format : (format : string) => string
}

export type EventConfig<Global extends GlobalState, Local, Type> = {
    Math : Math
    setTimeout: ProgrammingTimeout
    Date : ProgrammingDate
    local : Local
    global : Global
    event : Type
    index : number
    _ : ProgrammingUnderscore
    console : ProgrammingConsole
    fetch : ProgrammingFetch
    JSON : ProgrammingJSON

    socket : PolygraphicSocket
    speech : PolygraphicSpeech
    picker : PolygraphicPicker
    moment : PolygraphicMoment
}

export type ComponentEvents<Global extends GlobalState, Local> = {
    observe?: Array<(event : EventConfig<Global, Local, Component<Global, Local>>) => ProgrammingLanguage>
    onBack?: Array<(event : EventConfig<Global, Local, null>) => ProgrammingLanguage>
    onClick?: Array<(event : EventConfig<Global, Local, null>) => ProgrammingLanguage>
    onDragStart?: Array<(event : EventConfig<Global, Local, null>) => ProgrammingLanguage>
    onDragEnd?: Array<(event : EventConfig<Global, Local, null>) => ProgrammingLanguage>
    onDrop?: Array<(event : EventConfig<Global, Local, null>) => ProgrammingLanguage>
    onEnter?: Array<(event : EventConfig<Global, Local, null>) => ProgrammingLanguage>
    onInit?: Array<(event : EventConfig<Global, Local, null>) => ProgrammingLanguage>
    onChange?: Array<(event : EventConfig<Global, Local, boolean>) => ProgrammingLanguage>
    onResize?: Array<(event : EventConfig<Global, Local, {
        width : number
        height : number
    }>) => ProgrammingLanguage>
}

export type BoxProp<Type> = {
    top?: Type
    right?: Type
    bottom?: Type
    left?: Type
}

export type Border = [number, "solid" | "dashed", string]

export type UnwrapBoxProp<T> = T extends BoxProp<infer U> ? U : T;

export type ComponentBoxProps = {
    padding?: BoxProp<number>
    margin?: BoxProp<number>
    border?: BoxProp<Border>
    position?: BoxProp<number>
}

export type Alignment = "start" | "center" | "end";

export type AddableComponent = {
    links?: Record<string, string>
    metas?: Record<string, string>
}

export type Component<Global extends GlobalState, Local> = ComponentBoxProps & ComponentEvents<Global, Local> & AddableComponent & {
    width : number
    height : number
    name : Tag
    focus?: boolean
    enabled?: boolean
    visible?: boolean
    placeholder? : string
    id? : string
    children?: Array<Component<Global, Local>>
    text?: string
    background?: string
    grow?: boolean
    adapters?: Adapter<Global>
    data?: Data[]
    value?: string | boolean | number
    animation?: Animation
    mainAxisAlignment?: Alignment
    crossAxisAlignment?: Alignment
    size?: number
    weight?: number
    color?: string
    src?: string
    round?: number
    clip?: boolean
    shadow?: boolean
    funcs?: ProgrammingLanguage[]
    markdown?: string
    opacity?: number
    manifest?: {        
        package : {
            android : string
            ios : string
        }
        version : {
            name : string
            code : number
        }
        short_name : string
        name : string
        icons : Array<{
            src: string
            sizes: string
            type: string
            purpose: string
        }>
        start_url : string
        display : "fullscreen" | "standalone" | "minimal-ui"
        background_color: string
        description: string
        theme_color: string
    }
    index?: number
    alt?: string
    clickable?: boolean
    bundle?: string[]
    whitespace?: "nowrap" | "normal" | "pre"
    align?: Alignment
    href?: string
    target?: string
    title?: string
    direction?: "row" | "column"
    max?: {
        width?: number
        height?: number
    }
    queries?: {
        [query : string] : Component<Global, Local>
    }
    columns?: number
    translate?: {
        x : number
        y : number
    }
}

export type Animation = {
    name : "opacity" | "left" | "right"
    start : number
    direction : "in" | "out"
}

export type Data = Record<string, unknown> & {
    adapter?: string
    animation?: Animation
} & ({
    key : string
} | {
    id : string
})

export type Adapter<Global extends GlobalState> = {
    [key : string] : ComponentFromConfig<Global, any>
}

export type ComponentConfig<Global extends GlobalState, Local> = {
    parent : Component<Global, Local>
    global : Global
    local : Local
}

export type ComponentFromConfig<Global extends GlobalState, Local> = (config : ComponentConfig<Global, Local>) => Component<Global, Local>

export type RecursivePartial<T> = {
    [Key in keyof T]?: T[Key] extends Array<infer U> ? Array<RecursivePartial<U>> : 
        T[Key] extends object ? RecursivePartial<T[Key]> :
        T[Key]
}

export type NavigationState = {
	routes?: Data[]
}