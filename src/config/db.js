import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: [{
        emit: 'event',
        level: 'query',
    }]
});

prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
});

export default prisma;
