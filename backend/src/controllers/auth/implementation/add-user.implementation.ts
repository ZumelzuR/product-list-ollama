import UnexpectedException from '../../../utils/exceptions/unexpected.exception';
import { IUser, User } from '../../../models/user.model';
import ConflictException from '../../../utils/exceptions/conflict.exception';

const addUser = async (
  resgisterBody: any,
) => {
  const existUser: IUser | null = await User.findOne({
    email: resgisterBody.email,
  });
  if (existUser) {
    throw new ConflictException("Already exist email");
  }
  try {
    const user = await User.create(resgisterBody);
    return { user };
  } catch (error) {
    throw new UnexpectedException();
  }
};

export default addUser;
