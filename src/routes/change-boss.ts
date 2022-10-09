import {FastifyPluginAsync} from 'fastify';
import '../config'
import {
  setBoss,
  setBossResponseError,
  setBossResponseSuccess,
  setBossType
} from "../schema/changeBoss";

const db = require('../db')

export const changeBoss: FastifyPluginAsync = async (app) => {
  app.route<{ Body: setBossType, Reply: any}>({
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

      const boss =  await db.query(`SELECT * FROM boss WHERE boss.phone = '${phone}' AND boss.password = '${password}'`)
      if (boss?.rows?.length === 1){
        console.log('successfully authorized');
      }
      if (boss?.rows?.length === 0){
        console.log('not authorized');
        return res.code(400).send({ok: true, message: 'incorrect-password-or-phone'});
      }
      const changeBoss = await db.query(`UPDATE "user" SET boss_id = ${new_boss}  WHERE "user".phone = '${user_phone}' AND "user".boss_id = ${boss.rows[0].id}`)
      console.log(changeBoss)
    }
  })
};
