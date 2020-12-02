
const serviceErr = ({
    service, 
    name, 
    message,
    toString = () => `${service} service error - ${name}:\n  ${message}`,
    ...others
}) => ({
    service,
    name,
    message,
    toString,
    ...others
})

module.exports = serviceErr