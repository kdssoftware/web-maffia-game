import faunadb from 'faunadb';
export type Ref = {
    "ref": {
        "@ref": {
          "id": string,
          "collection": {
            "@ref": {
              "id": string,
              "collection": {
                "@ref": {
                  "id": string
                }
              }
            }
          }
        }
    }
}

const client = new faunadb.Client(
    { 
        secret: String(process.env.FAUNA_SECRET) ,
        domain: String(process.env.FAUNA_DOMAIN),
        port: 443,
        scheme: "https"

    });
const q = faunadb.query;

export {
    client,
    q
};