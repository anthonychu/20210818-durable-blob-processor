const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, blobPath) {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient("new");
        const blobClient = containerClient.getBlockBlobClient(blobPath);
        const downloadBlockBlobResponse = await blobClient.download();
        const content = await streamToString(downloadBlockBlobResponse.readableStreamBody);
        await blobClient.delete();
        context.log(`${blobPath} deleted`);
        return blobPath;
    } catch (err) {
        context.log.error(err);
        return null;
    }
};

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}