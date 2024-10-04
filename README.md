# Kanar
![Kanar logo](kanar.png)


Kanar is an Github Actions action that enforces pinning ticket id reference in a PR.\
I will fail if there is no task id in PR title or body.\
It utilizes [DangerJS](https://danger.systems/js/) to perform the check.

## Inputs
github_token - Github authentification token.
clickup_token - ClickUp authentification token.

## Testing
The action conitains some unit tests. To run them:
```bash
npm install --only=dev
npm test
```

## Example usage
```yaml
name: Kanar

on:
  pull_request:
    - opened
    - reopened
    - synchronize
    - edited

permissions:
  contents: read
  pull-requests: write
  issues: write
  statuses: write

jobs:
  kanar:
    runs-on: ubuntu-latest
    steps:
      - uses: RampNetwork/kanar@v2
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }} # this is passed automatically https://docs.github.com/en/actions/security-guides/automatic-token-authentication
          clickup_token: ${{ secrets.CLICKUP_TOKEN }}
```
