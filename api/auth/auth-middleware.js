const user_model = require("../users/users-model");

/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli(req, res, next) {
  try {
    if (req.session && req.session.user_id) {
      next();
    } else {
      res.status(401).json({
        message: "Geçemezsiniz!",
      });
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req, res, next) {
  try {
    let user = await user_model.goreBul({ username: req.body.username });
    if (user) {
      res.status(422).json({
        message: "Username kullaniliyor",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req, res, next) {
  try {
    let user = await user_model.goreBul({ username: req.body.username });
    if (!user || user.length === 0) {
      res.status(401).json({
        message: "Geçersiz kriter",
      });
    } else {
      req.existUser = user;
      next();
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
async function sifreGecerlimi(req, res, next) {
  try {
    let user = await user_model.goreBul({ password: req.body.password });
    if (!user || req.body.password.length < 3) {
      res.status(422).json({
        message: "Şifre 3 karakterden fazla olmalı",
      });
    } else next();
  } catch (error) {
    next(error);
  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.

module.exports = { sinirli, usernameBostami, usernameVarmi, sifreGecerlimi };
