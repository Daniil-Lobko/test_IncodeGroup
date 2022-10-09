import {FastifyPluginAsync} from 'fastify';
import '../config'
import {User, UserResponseError, UserResponseSuccess, UserResponseType, UserType} from "../schema/user";
import {Login, LoginResponseError, LoginResponseSuccess, LoginType} from "../schema/login";

const db = require('../db')

export const getUsers: FastifyPluginAsync = async (app) => {
  app.route<{ Body: LoginType, Reply: any }>({
    method: 'POST',
    url: '/get-users',
    schema: {
      body: Login,
    response: {
      200: LoginResponseSuccess,
      400: LoginResponseError
    }
    },
    handler: async function (req, res) {
      const {phone, password} = req.body;
      const administrator = await db.query(`SELECT *
                                            FROM administrator
                                            WHERE administrator.phone = '${phone}'
                                              AND administrator.password = '${password}'`)
      const boss = await db.query(`SELECT *
                                   FROM boss
                                   WHERE boss.phone = '${phone}'
                                     AND boss.password = '${password}'`)
      const user = await db.query(`SELECT *
                                   FROM "user"
                                   WHERE "user".phone = '${phone}'
                                     AND "user".password = '${password}'`)

      if (!phone.match(/^[0-9]{10}$/)) {
        return res.code(400).send({ok: false, message: 'incorrect-phone-format'});
      }
      if (!password.match(/.{3,30}/g)) {
        return res.code(400).send({ok: false, message: 'incorrect-password-format'});
      }
      let arr_Bosses = []
      let arr_Users = []
      let users_bosses = []
      if (administrator?.rows?.length === 1) {
        const bosses = await db.query(`SELECT *
                                       FROM boss`)

        for (let index_boss = 0; index_boss < bosses.rows.length; index_boss++) {
          arr_Bosses.push(bosses.rows[index_boss])
          const boss_users = await db.query(`SELECT *
                                             FROM "user"
                                             WHERE boss_id = (SELECT id
                                                              FROM boss
                                                              WHERE boss.phone = '${bosses.rows[index_boss].phone}'
                                                                AND boss.password = '${bosses.rows[index_boss].password}')`)
          for (let index_user = 0; index_user < boss_users.rows.length; index_user++) {
            arr_Users.push(boss_users.rows[index_user])
          }
          users_bosses.push({boss: arr_Bosses[index_boss], users: arr_Users})
        }
        return res.code(200).send({users: users_bosses});
      }

      if (boss?.rows?.length === 1) {
        const boss_users = await db.query(`SELECT *
                                           FROM "user"
                                           WHERE boss_id = (SELECT id
                                                            FROM boss
                                                            WHERE boss.phone = '${phone}'
                                                              AND boss.password = '${password}')`)
        arr_Bosses.push(boss.rows[0])
        for (let j = 0; j < boss_users.rows.length; j++) {
          arr_Users.push(boss_users.rows[j])
        }


        for (let index_user = 0; index_user < boss_users.rows.length; index_user++) {
          let find_UserBoss = await db.query(`SELECT *
                                              FROM "user"
                                              WHERE "user".phone = (SELECT phone FROM boss WHERE boss.phone = '${boss_users.rows[index_user].phone}')`)
          let find_SubUser = await db.query(`SELECT *
                                             FROM "user"
                                             WHERE "user".boss_id = (SELECT boss.id FROM boss WHERE boss.phone = '${boss_users.rows[index_user].phone}')`)
          if (find_SubUser.rows.length !== 0) {
            for (let i = 0; i < find_SubUser.rows.length; i++) {
              arr_Users.push(find_SubUser.rows[i])
            }
          }
          if (find_UserBoss.rows.length !== 0) {
            for (let k = 0; k < find_UserBoss.rows.length; k++) {
              arr_Bosses.push(find_UserBoss.rows[k])
            }
          }
        }
        users_bosses.push({boss: arr_Bosses, users: arr_Users})
        return res.code(200).send({users: users_bosses});
      }
      if (user?.rows?.length === 1) {
        return res.code(200).send({users: user.rows});
      }
    }
  })
};
