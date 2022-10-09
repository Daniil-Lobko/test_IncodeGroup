import {Type, Static} from "@sinclair/typebox"

export const Login = Type.Object({
  phone: Type.String(),
  password: Type.String()
});

export type LoginType = Static<typeof Login>;

export const LoginResponseSuccess = Type.Object({
  users: Type.Any()
});

export const LoginResponseError = Type.Object({
  ok: Type.Literal(false),
  message: Type.Union([
    Type.Literal('incorrect-password-format'),
    Type.Literal('incorrect-phone-format'),
    Type.Literal('incorrect-password-or-phone'),
  ])
});

export const LoginResponse = Type.Union([
  LoginResponseSuccess,
  LoginResponseError
]);

export type LoginResponseType = Static<typeof Login>;