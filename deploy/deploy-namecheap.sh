#!/usr/bin/env bash
set -euo pipefail
umask 077

for name in CICA_DEPLOY_TARGET NAMECHEAP_SSH_HOST NAMECHEAP_SSH_USER NAMECHEAP_SSH_PORT NAMECHEAP_SSH_PRIVATE_KEY NAMECHEAP_SSH_KNOWN_HOSTS GITHUB_SHA GITHUB_RUN_ID GITHUB_RUN_ATTEMPT; do
  if [[ -z "${!name:-}" ]]; then
    printf 'Missing required configuration: %s\n' "$name" >&2
    exit 1
  fi
done
[[ "$NAMECHEAP_SSH_HOST" =~ ^[a-zA-Z0-9.-]+$ ]] || { echo 'Invalid SSH host' >&2; exit 1; }
[[ "$NAMECHEAP_SSH_PORT" =~ ^[0-9]{1,5}$ ]] || { echo 'Invalid SSH port' >&2; exit 1; }
[[ "$NAMECHEAP_SSH_USER" == cicanrkn ]] || { echo 'SSH user must match the CICA hosting account' >&2; exit 1; }
case "$CICA_DEPLOY_TARGET" in
  production) docroot=/home/cicanrkn/public_html; site_url=https://cicainfo.com ;;
  staging) docroot=/home/cicanrkn/staging_html; site_url=https://staging.cicainfo.com ;;
  *) echo 'CICA_DEPLOY_TARGET must be production or staging' >&2; exit 1 ;;
esac
[[ "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ && "$GITHUB_RUN_ID" =~ ^[0-9]+$ && "$GITHUB_RUN_ATTEMPT" =~ ^[0-9]+$ ]] || exit 1

scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
printf '%s\n' "$NAMECHEAP_SSH_PRIVATE_KEY" > "$scratch/key"
printf '%s\n' "$NAMECHEAP_SSH_KNOWN_HOSTS" > "$scratch/known_hosts"
# Never accept a key discovered during deployment; provision a verified host key first.
ssh-keygen -F "[$NAMECHEAP_SSH_HOST]:$NAMECHEAP_SSH_PORT" -f "$scratch/known_hosts" >/dev/null || {
  echo 'Known-hosts secret lacks the configured host and port' >&2; exit 1;
}
ssh_options=(-p "$NAMECHEAP_SSH_PORT" -i "$scratch/key" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$scratch/known_hosts" -o ConnectTimeout=20)
server="$NAMECHEAP_SSH_USER@$NAMECHEAP_SSH_HOST"
release="$GITHUB_SHA-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
stage="/home/cicanrkn/.cica-deploy/$CICA_DEPLOY_TARGET-$release"
mkdir "$scratch/site"
tar -xzf artifact/cica-site.tar.gz -C "$scratch/site"
node deploy/validate-static.mjs "$scratch/site"
node --input-type=module - "$scratch/site/deployment.json" "$GITHUB_SHA" <<'NODE'
import { readFileSync } from 'node:fs'
if (JSON.parse(readFileSync(process.argv[2], 'utf8')).commit !== process.argv[3]) {
  throw new Error('Artifact commit does not match workflow commit')
}
NODE

# shellcheck disable=SC2029 # Both interpolated values are validated above.
ssh "${ssh_options[@]}" "$server" "mkdir -p '$stage/site' && test -d '$docroot' && test ! -L '$docroot' && command -v rsync >/dev/null && command -v tar >/dev/null"
rsync --quiet -rlt --chmod=D755,F644 -e "ssh -p $NAMECHEAP_SSH_PORT -i $scratch/key -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$scratch/known_hosts -o ConnectTimeout=20" "$scratch/site/" "$server:$stage/site/"
# shellcheck disable=SC2029 # Only the validated release identifier and target are passed.
ssh "${ssh_options[@]}" "$server" "bash -s -- '$release' '$CICA_DEPLOY_TARGET'" < deploy/install-release.sh

# Verify the exact deployed build, with normal trusted HTTPS validation.
for attempt in 1 2 3 4 5; do
  echo "Checking HTTPS deployment (attempt $attempt of 5)"
  if curl --fail --silent --show-error --max-time 20 "$site_url/deployment.json?run=$GITHUB_RUN_ID" -o "$scratch/live.json" &&
    node --input-type=module - "$scratch/live.json" "$GITHUB_SHA" <<'NODE'
import { readFileSync } from 'node:fs'
if (JSON.parse(readFileSync(process.argv[2], 'utf8')).commit !== process.argv[3]) process.exit(1)
NODE
  then
    curl --fail --silent --show-error --max-time 20 "$site_url/" -o /dev/null
    echo "Verified $CICA_DEPLOY_TARGET HTTPS deployment $GITHUB_SHA"
    exit 0
  fi
  sleep 5
done
echo 'Deployment HTTPS verification failed. Restore the saved backup if needed; see deploy/README.md.' >&2
exit 1
