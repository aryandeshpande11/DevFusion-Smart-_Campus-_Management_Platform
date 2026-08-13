const searchService = require('../services/searchService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');

const search = catchAsync(async function handleSearch(req, res) {
  const { q, type } = req.query;
  const results = await searchService.searchAcrossCampus(q || '', type);
  return sendSuccess(res, 200, 'Search results fetched', { results });
});

module.exports = { search };
