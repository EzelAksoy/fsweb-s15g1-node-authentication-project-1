const db = require("../../data/db-config");

/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
async function bul() {
  const allUsers = await db("users");
  const fixedUsers = allUsers.map((item) => {
    return { user_id: item.user_id, username: item.username };
  });
  return fixedUsers;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
async function goreBul(filtre) {
  let userFilter = await db("users").where("filtre");
  return userFilter;
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  let Id = await db("users").where("user_id", user_id);
  return Id[0];
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  let newUser = await db("users").insert(user);
  return idyeGoreBul(newUser[0]);
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.

module.exports = { bul, goreBul, idyeGoreBul, ekle };
