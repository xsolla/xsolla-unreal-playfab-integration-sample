const { app } = require('@azure/functions');

app.http('webhookFakeResponse', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return { statis: 200, body: `Success response` };
    }
});
