import {FastifyPluginAsync} from 'fastify';
import '../config'
import {User, UserResponseError, UserResponseSuccess, UserType} from "../schema/user";
import {VALIDATE_NAME, VALIDATE_PASSWORD, VALIDATE_PHONE} from "../config";
const db = require('../db')

export const register: FastifyPluginAsync = async (app) => {
  app.route<{ Body: UserType, Reply: any}>({
    method: 'POST',
    url: '/create-user',
    schema: {
      body: User,
      response: {
        200: UserResponseSuccess,
        400: UserResponseError
      }
    },
    handler: async function (req, res) {
      const {name, surname, phone, password, role, boss_id} = req.body;
      if(role !== 'administrator' && role !== 'user' && role !== 'boss' ){
        return res.code(400).send({ok: false, message: 'incorrect-role'});
      }
      if(!name.match(VALIDATE_NAME) ){
        return res.code(400).send({ok: false, message: 'incorrect-name-format'});
      }
      if(!surname.match(VALIDATE_NAME)){
        return res.code(400).send({ok: false, message: 'incorrect-surname-format'});
      }
      if(!phone.match(VALIDATE_PHONE)){
        return res.code(400).send({ok: false, message: 'incorrect-phone-format'});
      }
      if(!password.match(VALIDATE_PASSWORD)){
        return res.code(400).send({ok: false, message: 'incorrect-password-format'});
      }

      if(role !== 'user'){
        const is_Exist = await db.query(`SELECT * FROM ${role} WHERE ${role}.phone = '${phone}'`)
        if (is_Exist.rows.length !== 0){
          return res.code(400).send({ok: false, message: 'user-already-exist'});
        }
        await db.query(`INSERT INTO ${role} (name, surname, phone, password) VALUES ($1,$2,$3,$4) RETURNING *`, [name, surname, phone, password])
      }
      if(role === 'user'){
        const is_Exist = await db.query(`SELECT * FROM "${role}" WHERE "${role}".phone = '${phone}'`)
        if (is_Exist.rows.length !== 0){
          return res.code(400).send({ok: false, message: 'user-already-exist'});
        }
        await db.query(`INSERT INTO "${role}" (name, boss_id, surname, phone, password) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [name, boss_id, surname, phone, password])
      }

      return res.code(200).send({ok: true, message: 'User was successfully created'});

    }
  })
};
