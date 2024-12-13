import * as core from '@actions/core';
import { Context } from '@osaas/client-core';
import {
  createEyevinnAiCodeReviewerInstance,
  getEyevinnAiCodeReviewerInstance
} from '@osaas/client-services';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function reviewCode(gitHubUrl: URL) {
  core.info('Setting up Code Reviewer');
  const ctx = new Context();
  let reviewer = await getEyevinnAiCodeReviewerInstance(ctx, 'ghaction');
  if (!reviewer) {
    reviewer = await createEyevinnAiCodeReviewerInstance(ctx, {
      name: 'ghaction',
      OpenAiApiKey: '{{secrets.openaikey}}'
    });
    await delay(1000);
  }
  core.info(`Reviewer available, requesting review of ${gitHubUrl.toString()}`);
  const reviewRequestUrl = new URL('/api/v1/review', reviewer.url);
  core.debug(reviewRequestUrl.toString());
  const sat = await ctx.getServiceAccessToken('eyevinn-ai-code-reviewer');
  const response = await fetch(reviewRequestUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sat}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      githubUrl: gitHubUrl.toString()
    })
  });
  if (response.ok) {
    const review = await response.json();
    return review;
  } else {
    throw new Error('Failed to get review');
  }
}

/**
 * This file is the actual logic of the action
 * @returns {Promise<void>} Resolves when the action is complete
 */
export async function run(): Promise<void> {
  try {
    const repoUrl = core.getInput('repo_url', { required: true });
    const response = await reviewCode(new URL(repoUrl));
    core.debug(response.review);
    core.setOutput('score', response.review.scoring_criteria.overall_score);
    core.setOutput(
      'suggestions',
      response.review.suggestions_for_improvement.join('\n')
    );
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
