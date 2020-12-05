module.exports = {
    pages: {
        interfaceMode: require('./interfaceMode/interfaceMode'),
        assistantMode: require('./assistantMode/assistantMode')
    },
    services: {
        db: require('./services/db').db
    }
}