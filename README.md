# GitHub Action for AI Code Reviewer

This action uses the AI Code Reviewer open web service in Eyevinn Open Source Cloud to perform code reviews.

## Usage

`workflow.yml` Example

```yml
name: Perform code review

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
    - name: review
      uses: EyevinnOSC/code-review-action@v1
      with:
        repo_url: ${{ github.server_url }}/${{ github.repository }}/tree/${{ github.ref_name}}
      env:
        OSC_ACCESS_TOKEN: ${{ secrets.OSC_ACCESS_TOKEN }}
    - name: comment
      uses: actions/github-script@v7
      with:
        github-token: ${{secrets.GITHUB_TOKEN}}
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: 'Code review score: ${{ steps.review.outputs.score }}'
          }) 
```

## Development

```
% INPUT_REPO_URL=https://github.com/Eyevinn/ai-code-reviewer npm run local-action
```