import * as github from '@actions/github';
import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token');

    const labels = core
      .getInput('labels')
      .split('\n')
      .filter(l => l !== '');
    const [owner, repo] = core.getInput('repo').split('/');
    const number =
      core.getInput('number') === ''
        ? github.context.issue.number
        : parseInt(core.getInput('number'));

    if (labels.length === 0) {
      return;
    }

    const client = github.getOctokit(githubToken);

    const remaining = [];
    for (const label of labels) {
      try {
        await client.issues.removeLabel({
          name: label,
          owner,
          repo,
          issue_number: number
        });
      } catch (e) {
        core.debug('Failed to remove label');
        core.warning(`failed to remove label: ${label}: ${e}`);
        remaining.push(label);
      }
    }

    core.debug(`${remaining.length}, `${core.getInput('fail_on_error')}`);
    if (remaining.length && core.getInput('fail_on_error') === 'true') {
      core.debug("We here");
      core.error(new Error(`failed to remove labels: ${remaining}`);
    }
  } catch (e) {
    core.debug("Catching something");
    core.error(e);
  }
}

run();
