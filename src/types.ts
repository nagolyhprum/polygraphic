import { ProgrammingUnderscore, ProgrammingConsole, ProgrammingFetch, ProgrammingJSON } from "polylingual";

export type Unarray<T> = T extends Array<infer U> ? U : T;

export type Tag = "row" | "root" | "column" | "text" | "button" | "scrollable" | "stack" | "input" | "select" | "option"

export type GlobalState = {
    ui : {
        [key : string] : any
    }
}

export type TagProps = Record<string, string> & {
    style : Record<string, string>
}

type PolygraphicSocket = {
    on : (name : string, callback : (config : { data : any }) => void) => void
}

type PolygraphicToast = {
    push : () => void
}

type PolygraphicNavigation = {
    push : () => void
    pop : () => void
    clear : () => void
}

type PolygraphicSpeech = {
    speak : () => void
    listen : () => void
}

type PolygraphicPicker = {
    date : () => void
}

export type EventConfig<Global extends GlobalState, Local, Type> = {
    local : Local
    global : Global
    event : Type
    index : number
    _ : ProgrammingUnderscore
    console : ProgrammingConsole
    fetch : ProgrammingFetch
    JSON : ProgrammingJSON
    socket : PolygraphicSocket
    navigation : PolygraphicNavigation
    toast : PolygraphicToast
    speech : PolygraphicSpeech
    picker : PolygraphicPicker
}

export type ComponentEvents<Global extends GlobalState, Local> = {
    observe?: Array<(event : EventConfig<Global, Local, Component<Global, Local>>) => void>
    onBack?: Array<(event : EventConfig<Global, Local, null>) => boolean>
    onClick?: Array<(event : EventConfig<Global, Local, null>) => void>
    onDragStart?: Array<(event : EventConfig<Global, Local, null>) => void>
    onDragEnd?: Array<(event : EventConfig<Global, Local, null>) => void>
    onDrop?: Array<(event : EventConfig<Global, Local, null>) => void>
    onEnter?: Array<(event : EventConfig<Global, Local, null>) => void>
    onInit?: Array<(event : EventConfig<Global, Local, null>) => void>
    onInput?: Array<(event : EventConfig<Global, Local, string>) => void>
    onSelect?: Array<(event : EventConfig<Global, Local, string>) => void>
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

export type Component<Global extends GlobalState, Local> = ComponentBoxProps & ComponentEvents<Global, Local> & {
    width : number
    height : number
    name : Tag
    focus?: any
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
    value?: any
    animation?: Animation
    mainAxisAlignment?: Alignment
    crossAxisAlignment?: Alignment
    size?: number
    color?: string
    src?: string
}

type Animation = {
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

export type ComponentProps = {
    index : number
    type : string
    width : number
    height : number
    text : string
}