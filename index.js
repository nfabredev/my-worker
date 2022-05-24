const buildUrl = (page = 1, perPage = 50) =>
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1?page=${page}&per_page=${perPage}`;

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  } else {
    return response.text();
  }
}

async function handleRequest(request) {
  const { searchParams } = new URL(request.url);
  const [page, perPage] = [
    searchParams.get("page") || undefined,
    searchParams.get("per_page") || undefined
  ];

  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${BEARER_TOKEN}`
    }
  };
  const url = buildUrl(page, perPage);
  const response = await fetch(url, init);
  const results = await gatherResponse(response);
  return new Response(results, {
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  });
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request));
});
