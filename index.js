const github = require('@actions/github');
const core = require('@actions/core');
const yargs = require('yargs');

async function run() {
    const argv = yargs
        .option('token', {
            token: {
                description: 'token',
                type: String,
            }
        })
        .help()
        .alias('help', 'h')
        .argv
    const token = argv.token;//core.getInput('token');
    console.log(token, '!!!!!!!');
    const octokit = github.getOctokit(token);
    try {
        const {
            data
        } = await octokit.checks.create({
            ...github.context.repo,
            name: github.context.action,
            head_sha: github.context.sha,
            started_at: new Date().toISOString(),
        });
        console.log(JSON.stringify(data));
        const update = await octokit.checks.update({
            ...github.context.repo,
            check_run_id: data.id,
            completed_at: new Date().toISOString(),
            conclusion: "success",
            output: {
                summary: "summary",
                title: "title",
                annotations: [
                    {
                        path: "./dummyfile.txt",
                        end_line: 1,
                        start_line: 1,
                        annotation_level: "failure",
                        message: "missing value"
                    },
                ]
            },
            status: "completed",
        })
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
