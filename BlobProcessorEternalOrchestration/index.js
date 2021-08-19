const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const blobsToProcess = yield context.df.callActivity("GetBlobsToProcess");
    if (blobsToProcess.length > 0) {
        const processingTasks = blobsToProcess.map(blob => context.df.callActivity("ProcessBlob", blob));
        yield context.df.Task.all(processingTasks);
    } else {
        yield context.df.createTimer(new Date(context.df.currentUtcDateTime.getTime() + 30000));
    }
    yield context.df.continueAsNew();
});