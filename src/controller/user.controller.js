import { INTERNAL_SERVER } from '../constants/index.js';
import { getUserById } from '../services/auth.services.js';
import { queryUsers } from '../services/user.services.js';
import AppError from '../utils/AppError.js';

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy, filter } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortBy,
    };

    const result = await queryUsers(filter, options);

    return res.status(200).send({
      page: result.page,
      limit: result.limit,
      total: result.total,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const getStaff = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy } = req.query;

    const filter = { role: 'user ' };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortBy,
    };

    const result = await queryUsers(filter, options);

    return res.status(200).send({
      page: result.page,
      limit: result.limit,
      total: result.totalResults,
      data: result.results,
    });
  } catch (error) {
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const getAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy } = req.query;

    const filter = { role: 'admin' };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortBy,
    };

    const result = await queryUsers(filter, options);

    return res.status(200).send({
      page: result.page,
      limit: result.limit,
      total: result.totalResults,
      data: result.results,
    });
  } catch (error) {
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const getOwners = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy } = req.query;

    const filter = { role: 'owner' };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortBy,
    };

    const result = await queryUsers(filter, options);

    return res.status(200).send({
      page: result.page,
      limit: result.limit,
      total: result.totalResults,
      data: result.results,
    });
  } catch (error) {
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await getUserById(id, 'first_name last_name email role');
    return res.status(200).send({
      data: user,
    });
  } catch (error) {
    return next(new AppError('Something went wrong', INTERNAL_SERVER));
  }
};
