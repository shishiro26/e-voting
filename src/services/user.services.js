import User from '../models/user.model.js';

export const getUserByEmail = async (email) => {
  return User.findOne({ email: email });
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
