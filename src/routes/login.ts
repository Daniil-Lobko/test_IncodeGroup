import {FastifyPluginAsync} from 'fastify';
import '../config'
import {User, UserResponseError, UserResponseSuccess, UserResponseType, UserType} from "../schema/user";
import {Login, LoginResponseError, LoginResponseSuccess, LoginType} from "../schema/login";
import {VALIDATE_PASSWORD, VALIDATE_PHONE} from "../config";

const db = require('../db')

export const login: FastifyPluginAsync = async (app) => {
  app.route<{ Body: LoginType, Reply: any }>({
    method: 'POST',
    url: '/login',
    schema: {
      body: Login,
      response: {
        200: LoginResponseSuccess,
        400: LoginResponseError
      }
    },
    handler: async function (req, res) {
      const {phone, password} = req.body;
      if (!phone.match(VALIDATE_PHONE)) {
        return res.code(400).send({ok: false, message: 'incorrect-phone-format'});
      }
      if (!password.match(VALIDATE_PASSWORD)) {
        return res.code(400).send({ok: false, message: 'incorrect-password-format'});
      }
      const is_Exist_Administrator = await db.query(`SELECT *
                                                     FROM administrator
                                                     WHERE administrator.phone = '${phone}'
                                                       AND administrator.password = '${password}'`)
      const is_Exist_Boss = await db.query(`SELECT *
                                            FROM boss
                                            WHERE boss.phone = '${phone}'
                                              AND boss.password = '${password}'`)
      const is_Exist_User = await db.query(`SELECT *
                                            FROM "user"
                                            WHERE "user".phone = '${phone}'
                                              AND "user".password = '${password}'`)
      let role;
      if (is_Exist_Administrator.rows.length !== 0) {
        role = 'administrator'
      } else if (is_Exist_Boss.rows.length !== 0) {
        role = 'boss'
      } else if (is_Exist_User.rows.length !== 0) {
        role = "user"
      } else return res.code(400).send({ok: true, message: 'incorrect-password-or-phone'});


      const validate = await db.query(`SELECT *
                                       FROM "${role}"
                                       WHERE "${role}".phone = '${phone}'
                                         AND "${role}".password = '${password}'`)
      if (validate?.rows?.length === 1) {
        console.log('successfully authorized');
        return res.code(200).send({ok: true, message: 'Authorized'});
      }

    }
  })
};
