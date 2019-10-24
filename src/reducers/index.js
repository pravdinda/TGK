import * as authReducers from './auth';
import * as commonReducers from './common';
import * as accountReducers from './account';

export default {
  ...authReducers,
  ...commonReducers,
  ...accountReducers,
}