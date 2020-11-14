const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs');

async function run() {
    const path = core.getInput('path');
    console.log(process.env.GEN_OUTPUT, '@@@@@@@@@@@@@');

    var contents = fs.readFileSync(process.env.GEN_OUTPUT);
    console.log('###############', contents.toString('utf8'));
    const token = core.getInput('token');
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
                summary: `
# Tests results

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column
                `.trim(),
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
