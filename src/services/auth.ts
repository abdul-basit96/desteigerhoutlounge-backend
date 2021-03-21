import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import { IUserInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import ApiError from '../utils/error';
import bcrypt from 'bcrypt';

@Service()
export default class AuthService {
  constructor(

    @Inject('logger') private logger,
    @Inject('mysql') private mysql,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    private saltRounds = 10,
  ) {
  }

  public async SignUp(userData: IUserInputDTO): Promise<{ user: IUserInputDTO; token: string }> {

    const user = await this.mysql.find({ email: userData.email }, "USER");
    if (user) throw new ApiError(400, 'User Exist', 'User already exist');

    const hash = bcrypt.hashSync(userData.password, this.saltRounds);

    await this.mysql.insert({ email: userData.email, name: userData.name, password: hash }, "USER");
    const token = await this.generateToken(userData);
    return { user: userData, token };

  }

  public async SignIn(userData: IUserInputDTO): Promise<{ token: string }> {

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
