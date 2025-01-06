import { handler as spacesHandler } from "../../src/services/spaces/handlers";

const context: any = {};

(async () => {
  const responses = await Promise.all([
    // createSpace(),
    // getAllSpaces(),
    // getSpaceById(),
    // updateSpace(),
    deleteSpace(),
  ]);

  console.log(responses.map((r) => {
    return {
      type: r.type,
      statusCode: r.res.statusCode,
      body: JSON.parse(r.res.body),
    };
  }));

  return responses;
})();

async function createSpace() {
  return {
    type: "createSpace",
    res: await spacesHandler(
      {
        httpMethod: "POST",
        body: JSON.stringify({
          location: "Maranhão",
        })
      } as any,
      context
    ),
  };
}


async function updateSpace() {
  return {
    type: "updateSpace",
    res: await spacesHandler(
      {
        httpMethod: "PUT",
        body: JSON.stringify({
          location: "Rio de Janeiro",
        }),
        queryStringParameters: {
          id: "77b61963-373a-4af2-a4bf-61c66ab1c582",
        },
      } as any,
      context
    ),
  };
}

async function getAllSpaces() {
  return {
    type: "getAllSpaces",
    res: await spacesHandler({ httpMethod: "GET" } as any, context),
  };
}

async function getSpaceById()  {
  return {
    type: "getSpaceById",
    res: await spacesHandler(
      {
        httpMethod: "GET",
        queryStringParameters: {
          id: "6edcf239-9b59-4acc-a128-3028b6f0a2dc",
        },
      } as any,
      context
    ),
  };
}

async function deleteSpace() {
  return {
    type: "deleteSpace",
    res: await spacesHandler({ 
      httpMethod: "DELETE",
      queryStringParameters: {
        id: "f1c7ba1d-6b5f-457c-994a-7d9494adae30"
      }
    } as any, context),
  };
}