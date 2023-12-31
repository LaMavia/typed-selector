import { TemplateKey } from './GenericKey'
import type { Modifier } from './Modifier'

type _Paths<T, Separator extends string> = T extends object
  ? Extract<
      {
        [K in keyof T]: K extends TemplateKey
          ? `${K}` | `${K}${Separator}${_Paths<T[K], Separator>}`
          : never
      }[keyof T],
      string
    >
  : never

export type Paths<T, Separator extends string = '.'> = '' | _Paths<T, Separator>

type _Split<
  Str extends string,
  Separator extends string,
  Acc extends string[]
> = Str extends `${infer Head extends string}${Separator}${infer Tail extends
  string}`
  ? _Split<Tail, Separator, [...Acc, Head]>
  : Str extends ''
  ? Acc
  : [...Acc, Str]

export type Split<Str extends string, Separator extends string> = _Split<
  Str,
  Separator,
  []
>

export type TypeOfFragments<T, Path extends string[]> = T extends object
  ? Path extends [
      `${infer Head extends TemplateKey & keyof T}`,
      ...infer Tail extends string[]
    ]
    ? Modifier.Apply<TypeOfFragments<T[Head], Tail>, Head, '?'>
    : Path extends [`${infer Head extends TemplateKey & keyof T}`]
    ? Modifier.Apply<T[Head], Head, '?'>
    : Path extends []
    ? never
    : undefined
  : T
