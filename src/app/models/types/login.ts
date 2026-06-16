// NOTE: `codigo` stays `any` intentionally — the login dx-number-box binds [(value)] to it and the
// installed DevExtreme typings declare that input as non-nullable, so `number | null` fails to compile
// while the field must start empty (null). Tightening this needs a template change; deferred.
export type LoginType = {
  codigo : any,
  senha : string
}
