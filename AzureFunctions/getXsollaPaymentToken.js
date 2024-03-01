const { app } = require('@azure/functions');

const projectId = <Your project id>;
const apiKey = <Your api key>;

app.http('getXsollaPaymentToken', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

      var body = await request.json();

      const userId = body.FunctionArgument.uid;
      const email = body.FunctionArgument.email;
      const sku = body.FunctionArgument.sku;
      const returnUrl = body.FunctionArgument.returnUrl;

        if (!userId) {
          return {status: 400, body: 'Request body is missing' };
        }

        const payload = {
            user: {
              id: {value: userId},
              name: {
                value: email
              },
              email: {
                value: email
              },
              country: {
                value: 'US',
                allow_modify: false
              }
            },
            purchase: {
              items: [
                {
                  sku: sku,
                  quantity: 1
                }
              ]
            },
            sandbox: true,
            settings: {
              language: 'en',
              currency: 'USD',
              return_url: returnUrl,
              ui: {
                theme: '63295aab2e47fab76f7708e3'
              }
            }
          }
        
        let url = "https://store.xsolla.com/api/v2/project/" + projectId.toString() + "/admin/payment/token";

        return fetch(
            url,
            {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa(`${projectId}:${apiKey}`)
                },
                body: JSON.stringify(payload)
            },
            )
            .then(xsollaRes => {
            // Handle the response data
                if (xsollaRes.ok) {
                    return xsollaRes.json();
                } else {
                    return { status: 400, body: `HTTP request failed with error: ${xsollaRes.statusText}` };
                }
            })
            .then(data => {
                return { status: 200, body: JSON.stringify(data) };
            })
            .catch(error => {
                return { status: 501, body: `Error = ${error}` };
            });
        }
});
