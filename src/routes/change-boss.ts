import {FastifyPluginAsync} from 'fastify';
import '../config'
import {
  setBoss,
  setBossResponseError,
  setBossResponseSuccess,
  setBossType
} from "../schema/changeBoss";
import {VALIDATE_PASSWORD, VALIDATE_PHONE} from "../config";

const db = require('../db')

export const changeBoss: FastifyPluginAsync = async (app) => {
  app.route<{ Body: setBossType, Reply: any }>({
    method: 'POST',
    url: '/change-boss',
    schema: {
      body: setBoss,
      response: {
        200: setBossResponseSuccess,
        400: setBossResponseError
      }
    },
    handler: async function (req, res) {
      const {phone, password, user_phone, new_boss} = req.body;
      if (!phone.match(VALIDATE_PHONE)) {
        return res.code(400).send({ok: false, message: 'incorrect-phone-format'});
      }
      if (!password.match(VALIDATE_PASSWORD)) {
        return res.code(400).send({ok: false, message: 'incorrect-password-format'});
      }
      const boss = await db.query(`SELECT *
                                   FROM boss
                                   WHERE boss.phone = '${phone}'
                                     AND boss.password = '${password}'`)
      if (boss?.rows?.length === 1) {
        const changeBoss = await db.query(`UPDATE "user"
                                         SET boss_id = ${new_boss}
                                         WHERE "user".phone = '${user_phone}'
                                           AND "user".boss_id = ${boss.rows[0].id}`)
        if (changeBoss.rowCount === 1) {
          return res.code(200).send({ok: true, message: 'user-successfully-edited'});
        }
        if (changeBoss.rowCount === 0) {
          return res.code(400).send({ok: true, message: 'not-your-user'});
        }
      }
      if (boss?.rows?.length === 0) {
        return res.code(400).send({ok: true, message: 'incorrect-password-or-phone'});
      }
    }
  })
};
