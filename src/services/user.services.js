  import User from '../models/user.model.js';

  export const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
  };

