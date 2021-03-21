import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import { IUserInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import ApiError from '../utils/error';
import bcrypt from 'bcrypt';
import { google } from 'googleapis';

@Service()
export default class AuthService {
  constructor(

    @Inject('logger') private logger,
    @Inject('mysql') private mysql,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    private saltRounds = 10,
  ) {
  }

  public async signUp(userData: IUserInputDTO): Promise<{ user: IUserInputDTO; token: string }> {

    const user = await this.mysql.find({ email: userData.email }, "USER");
    if (user) throw new ApiError(400, 'User Exist', 'User already exist');

    const hash = bcrypt.hashSync(userData.password, this.saltRounds);

    await this.mysql.insert({ email: userData.email, name: userData.name, password: hash }, "USER");
    const token = await this.generateToken(userData);
    return { user: userData, token };

  }

  public async signIn(userData: IUserInputDTO): Promise<{ token: string }> {

    const user = await this.mysql.find({ email: userData.email }, "USER");
    if (user) {
      const match = await bcrypt.compare(userData.password, user.password);
      if (!match) throw new ApiError(404, 'Incorrect Password', 'password doesn\'t match');
      const token = await this.generateToken(user);
      return { token };
    } else {
      throw new ApiError(404, 'Not Found', 'User not exist');
    }

  }

  public async googleLogin(): Promise<{ url: string }> {

    /**
   * Create the google url to be sent to the client.
   */
    const auth = this.createConnection(); // this is from previous step
    const url = this.getConnectionUrl(auth);
    console.log('ur', url);
    return { url };

  }

  public async googleCallback(code: string) {
    console.log('code', code)
    const auth = this.createConnection();
    // get the auth "tokens" from the request
    const data = await auth.getToken(code);
    const tokens = data.tokens;

    // add the tokens to the google api so we have access to the account
    auth.setCredentials(tokens);

    // connect to google plus - need this to get the user's email
    const plus = google.plus({ version: 'v1', auth });
    const me = await plus.people.get({ userId: 'me' });

    // get the google id and email
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;

    // return so we can login or sign up the user
    console.log({
      id: userGoogleId,
      email: userGoogleEmail,
      tokens: tokens, // you can save these to the user if you ever want to get their details without making them log in again
    });

  }

  // const googleConfig = {
  //   clientId: '1069899425974-qe1iis336t9q5v3ahk6128n50co86d22.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  //   clientSecret: 'gBlkr-YKNaUtelk_x0PJLpmv', // e.g. _ASDFA%DFASDFASDFASD#FAD-
  //   redirect: 'http://localhost:3000/auth/google/callback' // this must match your google api settings
  // };
  private createConnection() {
    return new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirect
    );
  }


  /**
   * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
   */
  /**
    * This scope tells google what information we want to request.
    */
  private getConnectionUrl(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
      ]
    });
  }


  private generateToken(user) {
    return jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  }

  private verifyToken(token: string) {
    return jwt.verify(token, config.jwtSecret);
  }

}
