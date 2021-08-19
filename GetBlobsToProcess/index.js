const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context) {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient('new');
        const blobs = [];
        const batchSize = process.env.BATCH_SIZE || 200;
        for await (const blob of containerClient.listBlobsFlat()) {
            blobs.push(blob.name);
            if (blobs.length >= batchSize) {
                break;
            }
        }
        context.log(`found ${blobs.length} blobs`);
        return blobs;
    } catch (error) {
        context.log.error(error);
        return [];
    }
};