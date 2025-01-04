exports.main = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from lambda!",
      dataTable: process.env.TABLE_NAME,
    }),
  }
}