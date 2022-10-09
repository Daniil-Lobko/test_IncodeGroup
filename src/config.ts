import dotenv from 'dotenv';

const {ENV_TYPE} = process.env;
dotenv.config({path: `.env.${ENV_TYPE || 'development'}`});

export const VALIDATE_NAME = /^[a-zA-Z]{3,16}$/
export const VALIDATE_PHONE = /^[0-9]{10}$/
export const VALIDATE_PASSWORD = /.{3,30}/g