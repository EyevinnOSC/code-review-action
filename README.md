# GitHub Action for AI Code Reviewer

This action uses the AI Code Reviewer open web service in Eyevinn Open Source Cloud to perform code reviews.

## Usage

`workflow.yml` Example

```yml
name: Perform code review of pull requests

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Review branch
        id: review
        uses: EyevinnOSC/code-review-action@v1
        with:
          repo_url: ${{ github.server_url }}/${{ github.repository }}/tree/${{ github.head_ref}}
        env:
          OSC_ACCESS_TOKEN: ${{ secrets.OSC_ACCESS_TOKEN }}
      - name: Add code review result as a PR comment
        uses: actions/github-script@v7
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Code review score: ${{ steps.review.outputs.score }}\n${{ steps.review.outputs.suggestions }}'
            })
```

## Development

```
% INPUT_REPO_URL=https://github.com/Eyevinn/ai-code-reviewer npm run local-action
```
