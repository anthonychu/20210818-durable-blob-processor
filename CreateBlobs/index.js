const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    let numberOfBlobs = parseInt(req.query.numberOfBlobs || '1');
    if (numberOfBlobs > 1000) numberOfBlobs = 1000;
    if (numberOfBlobs < 0) numberOfBlobs = 1;
    const blobPrefix = `blob-${new Date().getTime()}-`;

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient("new");
    await containerClient.createIfNotExists();

    const blobNames = [];
    for (let i = 0; i < numberOfBlobs; i++) {
        const blobName = `${blobPrefix}${i}`;
        const blobClient = containerClient.getBlockBlobClient(blobName);
        const data = 'Hello, World!';
        await blobClient.upload(data, data.length);
        context.log(`uploaded ${blobName}`);
        blobNames.push(blobName);
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: blobNames
    };
}