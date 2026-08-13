// runs a lightweight search across the entities the person is allowed to see, grouped by type
const db = require('../config/db');

async function searchAcrossCampus(query, type) {
  const searchPromises = [];

  if (!type || type === 'students' || type === 'faculty') {
    searchPromises.push(
      db.user.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 10,
      }).then((results) => ({ type: 'people', results }))
    );
  }

  if (!type || type === 'events') {
    searchPromises.push(
      db.event.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 10,
      }).then((results) => ({ type: 'events', results }))
    );
  }

  if (!type || type === 'assignments') {
    searchPromises.push(
      db.assignment.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 10,
      }).then((results) => ({ type: 'assignments', results }))
    );
  }

  if (!type || type === 'placements') {
    searchPromises.push(
      db.placement.findMany({
        where: { companyName: { contains: query, mode: 'insensitive' } },
        take: 10,
      }).then((results) => ({ type: 'placements', results }))
    );
  }

  const groupedResults = await Promise.all(searchPromises);
  return groupedResults;
}

module.exports = { searchAcrossCampus };
