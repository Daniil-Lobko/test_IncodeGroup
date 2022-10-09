import {Type, Static} from "@sinclair/typebox"

export const setBoss = Type.Object({
  phone: Type.String(),
  password: Type.String(),
  user_phone: Type.String(),
  new_boss: Type.String()
});

export type setBossType = Static<typeof setBoss>;

export const setBossResponseSuccess = Type.Object({
  ok: Type.Literal(true),
  message: Type.String()
});

export const setBossResponseError = Type.Object({
  ok: Type.Literal(false),
  message: Type.Union([
    Type.Literal('incorrect-password-or-phone'),
    Type.Literal('incorrect-password-format'),
    Type.Literal('incorrect-phone-format'),
    Type.Literal('not-your-user')
  ])
});

export const setBossResponse = Type.Union([
  setBossResponseSuccess,
  setBossResponseError
]);

export type setBossResponseType = Static<typeof setBoss>;