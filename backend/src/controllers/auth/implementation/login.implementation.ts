import { LoginBody, TokenDto } from '../../../dto/auth/token.dto';
import { User } from '../../../models/user.model';
import BadRequestException from '../../../utils/exceptions/bad-request.exception';
import jwt from 'jsonwebtoken';

const loginImpl = async (loginBody: LoginBody): Promise<TokenDto> => {
  const email = loginBody.email;
  const password = loginBody.password;

  const user = await User.findOne({ email });

  if (!user?.validPassword(password)) {
    throw new BadRequestException("Invalid email or password");
  }

  return {
    token: jwt.sign({ id: user._id }, process.env.SECRET, {algorithm: "HS256"}),
  };
};

export default loginImpl;
