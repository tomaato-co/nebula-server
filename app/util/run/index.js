const child = require("child_process")

const run = (cmd, opts) => (
    new Promise((resolve, reject) => {
        const process = child.spawn(
            cmd, {...opts, shell: true, stdio: [0, 1, 2]}
        )
        process.addListener("error", reject)
        process.addListener("exit", resolve)
    })
)

module.exports = run

