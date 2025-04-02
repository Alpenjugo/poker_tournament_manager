const validators = require('./../utils/validators');
const constants = require('./../utils/constants');
const encryptDecrypter = require('./../utils/encrypterDecrypter');
const tokenGenerator = require('./../utils/tokenGenerator');

class User {
  /**
   * Konstruktor
   * @param db MongoDB-Instanz (über app.locals.db übergeben)
   * @param userId
   * @param firstName
   * @param nickName
   * @param email
   */
  constructor(db, userId, firstName, nickName, email) {
    this.db = db;
    this._userId = validators.validateString(userId) ? userId : false;
    this._firstName = validators.validateString(firstName) ? firstName : false;
    this._nickName = validators.validateString(nickName) ? nickName : false;
    this._email = validators.validateEmail(email) ? email : false;
  }

  /**
   * Benutzer anlegen
   * @param password
   * @returns {Promise<string>}
   */
  async createUser(password) {
    const userObj = {};
    userObj[constants.USERS_FIRST_NAME] = this._firstName;
    userObj[constants.USERS_EMAIL] = this._email;
    userObj[constants.USERS_NICK_NAME] = this._nickName;
    userObj[constants.USERS_PASSWORD] = encryptDecrypter.encrypt(password);

    const result = await this.db.collection(constants.USERS_COLLECTION).insertOne(userObj);
    console.log('✅ User inserted with ID:', result.insertedId);
    return result.insertedId;
  }

  /**
   * Benutzer-Login prüfen
   * @param password
   * @returns {Promise<Object>}
   */
  async checkAuthentication(password) {
    const filter = {};
    filter[constants.USERS_EMAIL] = this._email;
    filter[constants.USERS_PASSWORD] = encryptDecrypter.encrypt(password);

    const result = await this.db.collection(constants.USERS_COLLECTION).findOne(filter);

    if (validators.validateUndefined(result)) {
      delete result[constants.USERS_PASSWORD];

      return {
        [constants.JWT_TOKEN]: tokenGenerator.generateToken(result),
        [constants.USER_DETAILS]: result
      };
    } else {
      return {};
    }
  }
}

module.exports = User;