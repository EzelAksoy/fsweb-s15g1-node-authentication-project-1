const router = require("express").Router();
const middleWare = require("./auth-middleware");
const bycrpt = require("bcryptjs");
const user_model = require("../users/users-model");

// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
router.post(
  "/register",
  middleWare.usernameBostami,
  middleWare.sifreGecerlimi,
  async (req, res, next) => {
    try {
      let userpassword = bycrpt.hashSync(req.body.password);
      let newUser = { username: req.body.username, password: userpassword };
      let add = await user_model.ekle(newUser);
      res.status(201).json(add);
    } catch (error) {
      next(error);
    }
  }
);

/**

  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */
router.post("/login", middleWare.usernameVarmi, async (req, res, next) => {
  try {
    let userpassword = bycrpt.compareSync(
      req.body.password,
      existUser.password
    );
    if (userpassword) {
      res.status(200).json({ message: `Hoşgeldin ${req.body.username}!` });
      req.session.user_id = req.existUser.user_id;
    } else {
      res.status(401).json({
        message: "Geçersiz kriter!",
      });
    }
  } catch (error) {
    next(error);
  }
});
/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

router.get("/logout", (req, res, next) => {
  try {
    let logout = req.session.user_id;
    if (logout) {
      req.session.destroy((error) => {
        if (error) {
          res.status(500).json("Hata oluştu");
        } else {
          res.status(200).json({
            message: "Çıkış yapildi",
          });
        }
      });
    } else {
      res.status(200).json({
        message: "Oturum bulunamadı!",
      });
    }
  } catch (error) {
    next(error);
  }
});

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports = router;
