import {Type, Static} from "@sinclair/typebox"

export const User = Type.Object({
  name: Type.String(),
  surname: Type.String(),
  phone: Type.String(),
  password: Type.String(),
  role: Type.String(),
  boss_id: Type.String()
});

export type UserType = Static<typeof User>;

export const UserResponseSuccess = Type.Object({
  ok: Type.Literal(true),
  message: Type.String()
});

export const UserResponseError = Type.Object({
  ok: Type.Literal(false),
  message: Type.Union([
    Type.Literal('incorrect-name-format'),
    Type.Literal('incorrect-surname-format'),
    Type.Literal('incorrect-phone-format'),
    Type.Literal('incorrect-password-format'),
    Type.Literal('incorrect-role'),
    Type.Literal('user-already-exist')
  ])
});

export const UserResponse = Type.Union([
  UserResponseSuccess,
  UserResponseError
]);

export type UserResponseType = Static<typeof User>;