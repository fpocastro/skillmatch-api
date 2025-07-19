import { CurrentUser } from './current-user.type';

export interface AuthenticatedRequest extends Request {
  user: CurrentUser;
}
