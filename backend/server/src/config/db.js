// single shared prisma client so we don't open a new db connection per request
const { PrismaClient } = require('@prisma/client');

const prismaClient = new PrismaClient();

module.exports = prismaClient;
