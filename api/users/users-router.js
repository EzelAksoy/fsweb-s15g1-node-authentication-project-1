const router = require("express").Router();
const user_model = require("./users-model");
const middleWare = require("../auth/auth-middleware");
// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!

/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

router.get("/", middleWare.sinirli, async (req, res, next) => {
  try {
    let users = await user_model.bul();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
