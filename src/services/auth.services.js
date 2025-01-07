import User from '../models/user.model.js';

export const getUserById = async (id, fields = '') => {
  return User.findById(id).select(fields);
};

export const getUserByEmail = async (email, fields = '') => {
  return User.findOne({ email: email }).select(fields);
};

export const saveUser = async (payload) => {
  const user = new User(payload);
  return user
    .save()
    .then((user) => {
      return user;
    })
    .catch((err) => {
      return err;
    });
};

export const updateUserById = async (id, payload) => {
  const updatedUser = await User.updateOne(
    {
      _id: id,
    },
    payload
  );
  return updatedUser;
};

export const assignRefreshToken = async (id, refreshToken) => {
  const updatedUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $push: {
        refreshToken,
      },
    }
  );

  return updatedUser;
};

export const getSpecificDetailsUser = async (id, details) => {
  const userDetails = await User.findOne(
    {
      _id: id,
    },
    details
  );

  return userDetails;
};

export const findUserByRefreshToken = async (id, refreshToken) => {
  const user = await User.updateOne(
    {
      _id: id,
    },
    {
      refreshToken: {
        $in: [refreshToken],
      },
    }
  );
  return user;
};

export const removeRefreshTokensUser = async (id) => {
  const user = await User.updateOne(
    {
      _id: id,
    },
    {
      refreshToken: [],
    }
  );
  return user;
};

export const replaceRefreshTokenUser = async (id, oldRefreshToken, newRefreshToken) => {
  const updatedUser = await User.updateOne(
    {
      _id: id,
      refreshToken: oldRefreshToken,
    },
    {
      $set: {
        'refreshToken.$': newRefreshToken,
      },
    }
  );

  return updatedUser;
};

export const removeRefreshTokenUser = async (id, refreshToken) => {
  const updatedUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $pull: {
        refreshToken: refreshToken,
      },
    }
  );

  return updatedUser;
};

export const assignEmailVerifyToken = async (id, token) => {
  const updatedUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        email_verify_token: token,
        token_send_at: new Date().toISOString(),
      },
    }
  );
  return updatedUser;
};

export const removeVerifyToken = async (id) => {
  const updatedUser = await User.update(
    {
      _id: id,
    },
    {
      $set: {
        email_verify_token: null,
        token_send_at: null,
      },
    }
  );
  return updatedUser;
};

export const removeEmailVerifyToken = async (id) => {
  const updatedUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        email_verify_token: null,
        isVerified: true,
        token_send_at: null,
      },
    }
  );
  return updatedUser;
};
