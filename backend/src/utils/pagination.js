/**
 * Global Pagination Utility for Novexa Backend
 *
 * Provides unified, production-ready pagination for Mongoose Models, Mongoose Queries,
 * and JS Arrays. Automatically handles page bounds, limits, skip offsets, total page math,
 * next/prev page flags, sorting, field selection, and population.
 */

/**
 * Extract and sanitize pagination query parameters from Express Request
 *
 * @param {Object} req - Express request object
 * @param {Object} [defaults] - Optional default overrides
 * @returns {{ page: number, limit: number, skip: number, sort: Object|string, search: string }}
 */
export const getPaginationParams = (req = {}, defaults = {}) => {
  const query = req.query || {};
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(query.limit, 10) || defaults.limit || 10),
  );
  const skip = (page - 1) * limit;

  let sort = query.sort || defaults.sort;
  if (!sort) {
    const sortBy = query.sortBy || query.sortField || "createdAt";
    const sortOrder = query.sortOrder || query.order || query.sortDir || "desc";
    const orderDirection = String(sortOrder).toLowerCase() === "asc" || String(sortOrder) === "1" ? 1 : -1;
    sort = { [sortBy]: orderDirection };
  } else if (typeof sort === "string") {
    if (sort.startsWith("{")) {
      try {
        sort = JSON.parse(sort);
      } catch (e) {
        sort = { createdAt: -1 };
      }
    } else if (sort.startsWith("-")) {
      sort = { [sort.substring(1)]: -1 };
    } else if (sort.startsWith("+")) {
      sort = { [sort.substring(1)]: 1 };
    } else {
      sort = { [sort]: 1 };
    }
  }

  const search = query.search ? String(query.search).trim() : "";

  return { page, limit, skip, sort, search };
};

/**
 * Paginate Mongoose Model or Mongoose Query instance
 *
 * @param {Model|Query} modelOrQuery - Mongoose Model or Query instance
 * @param {Object} [filter={}] - Mongoose filter conditions
 * @param {Object} [options={}] - Pagination & query options
 * @param {number} [options.page=1] - Current page number
 * @param {number} [options.limit=10] - Number of items per page (max 100)
 * @param {Object|string} [options.sort={ createdAt: -1 }] - Sort field criteria
 * @param {string|Object} [options.select] - Fields to select or omit
 * @param {Array|string|Object} [options.populate] - Populate configuration
 * @param {boolean} [options.lean=true] - Convert result to plain JS objects
 *
 * @returns {Promise<{
 *   success: boolean,
 *   data: Array,
 *   pagination: {
 *     totalItems: number,
 *     totalPages: number,
 *     currentPage: number,
 *     limit: number,
 *     hasNextPage: boolean,
 *     hasPrevPage: boolean,
 *     nextPage: number|null,
 *     prevPage: number|null,
 *     skip: number
 *   }
 * }>}
 */
export const paginate = async (modelOrQuery, filter = {}, options = {}) => {
  try {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(options.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const sort = options.sort || { createdAt: -1 };
    const select = options.select || null;
    const populate = options.populate || null;
    const lean = options.lean !== false;

    let query;
    let totalItems = 0;

    // Distinguish between Mongoose Model vs Query instance
    if (
      modelOrQuery &&
      typeof modelOrQuery.find === "function" &&
      typeof modelOrQuery.countDocuments === "function"
    ) {
      totalItems = await modelOrQuery.countDocuments(filter);
      query = modelOrQuery.find(filter);
    } else if (modelOrQuery && modelOrQuery.model) {
      totalItems = await modelOrQuery.model.countDocuments(filter);
      query = modelOrQuery;
    } else {
      throw new Error("Invalid model or query passed to paginate helper");
    }

    if (sort) query = query.sort(sort);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    if (lean && typeof query.lean === "function") query = query.lean();

    query = query.skip(skip).limit(limit);

    const data = await query;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      success: true,
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        skip,
      },
    };
  } catch (error) {
    console.error("Global Pagination Helper Error:", error);
    throw error;
  }
};

/**
 * Paginate an In-Memory JavaScript Array
 *
 * @param {Array} [array=[]] - Source array of items
 * @param {number} [page=1] - Current page number
 * @param {number} [limit=10] - Items per page
 *
 * @returns {{
 *   success: boolean,
 *   data: Array,
 *   pagination: {
 *     totalItems: number,
 *     totalPages: number,
 *     currentPage: number,
 *     limit: number,
 *     hasNextPage: boolean,
 *     hasPrevPage: boolean,
 *     nextPage: number|null,
 *     prevPage: number|null,
 *     skip: number
 *   }
 * }}
 */
export const paginateArray = (array = [], page = 1, limit = 10) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const totalItems = Array.isArray(array) ? array.length : 0;
  const skip = (currentPage - 1) * perPage;

  const data = Array.isArray(array) ? array.slice(skip, skip + perPage) : [];
  const totalPages = Math.ceil(totalItems / perPage) || 1;

  return {
    success: true,
    data,
    pagination: {
      totalItems,
      totalPages,
      currentPage,
      limit: perPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      skip,
    },
  };
};
