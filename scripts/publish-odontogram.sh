#!/usr/bin/env bash
# Publishes @ignitrondev/odontogram to npm if its current version is not published yet,
# then pushes the matching `odontogram-v<version>` git tag.
#
# Called by changesets/action (see .github/workflows/publish.yml) when no pending
# changesets remain, i.e. after a "Version Packages" PR has been merged.
# Idempotent: re-running on a version that already exists on npm is a no-op.
set -euo pipefail

PKG_DIR="packages/odontogram"
NAME="$(node -p "require('./${PKG_DIR}/package.json').name")"
VERSION="$(node -p "require('./${PKG_DIR}/package.json').version")"
GIT_TAG="odontogram-v${VERSION}"

if npm view "${NAME}@${VERSION}" version >/dev/null 2>&1; then
  echo "${NAME}@${VERSION} is already on npm; nothing to publish."
  exit 0
fi

# Stable versions go to `latest`; prereleases use their first identifier (alpha, beta, rc).
NPM_TAG="latest"
if [[ "${VERSION}" == *-* ]]; then
  NPM_TAG="${VERSION#*-}"
  NPM_TAG="${NPM_TAG%%.*}"
fi

echo "Publishing ${NAME}@${VERSION} with npm dist-tag '${NPM_TAG}'"
npm publish "./${PKG_DIR}" --access public --tag "${NPM_TAG}"

if git rev-parse -q --verify "refs/tags/${GIT_TAG}" >/dev/null; then
  echo "Git tag ${GIT_TAG} already exists locally."
else
  git tag "${GIT_TAG}"
fi
git push origin "refs/tags/${GIT_TAG}"
