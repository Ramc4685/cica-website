#!/usr/bin/env bash
set -euo pipefail
umask 077

for name in NAMECHEAP_SSH_HOST NAMECHEAP_SSH_USER NAMECHEAP_SSH_PORT NAMECHEAP_SSH_PRIVATE_KEY NAMECHEAP_SSH_KNOWN_HOSTS GITHUB_SHA GITHUB_RUN_ID GITHUB_RUN_ATTEMPT; do
  if [[ -z "${!name:-}" ]]; then
    printf 'Missing required configuration: %s\n' "$name" >&2
    exit 1
  fi
done
[[ "$NAMECHEAP_SSH_HOST" =~ ^[a-zA-Z0-9.-]+$ ]] || { echo 'Invalid SSH host' >&2; exit 1; }
[[ "$NAMECHEAP_SSH_PORT" =~ ^[0-9]{1,5}$ ]] || { echo 'Invalid SSH port' >&2; exit 1; }
[[ "$NAMECHEAP_SSH_USER" == cicanrkn ]] || { echo 'SSH user must match the CICA hosting account' >&2; exit 1; }
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
stage="/home/cicanrkn/.cica-deploy/$release"
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
ssh "${ssh_options[@]}" "$server" "mkdir -p '$stage/site' && test ! -L /home/cicanrkn/public_html && command -v rsync >/dev/null && command -v tar >/dev/null"
rsync --quiet -rlt --chmod=D755,F644 -e "ssh -p $NAMECHEAP_SSH_PORT -i $scratch/key -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=$scratch/known_hosts -o ConnectTimeout=20" "$scratch/site/" "$server:$stage/site/"
# shellcheck disable=SC2029 # Only the validated release identifier is passed.
ssh "${ssh_options[@]}" "$server" "bash -s -- '$release'" < deploy/install-release.sh

# Verify the exact deployed build, with normal trusted HTTPS validation.
for attempt in 1 2 3 4 5; do
  echo "Checking HTTPS deployment (attempt $attempt of 5)"
  if curl --fail --silent --show-error --max-time 20 "https://cicainfo.com/deployment.json?run=$GITHUB_RUN_ID" -o "$scratch/live.json" &&
    node --input-type=module - "$scratch/live.json" "$GITHUB_SHA" <<'NODE'
import { readFileSync } from 'node:fs'
if (JSON.parse(readFileSync(process.argv[2], 'utf8')).commit !== process.argv[3]) process.exit(1)
NODE
  then
    curl --fail --silent --show-error --max-time 20 https://cicainfo.com/ -o /dev/null
    # A GET must reach PHP and return its JSON 405; a 500 or served PHP source means the handler is not running.
    forms=$(curl --silent --show-error --max-time 20 -o /dev/null -w '%{http_code} %{content_type}' https://cicainfo.com/forms/submit.php || true)
    if [[ "$forms" != '405 application/json'* ]]; then
      echo "Forms handler check failed: expected '405 application/json', got '$forms'" >&2
      exit 1
    fi
    echo "Verified HTTPS deployment $GITHUB_SHA and forms handler"
    exit 0
  fi
  sleep 5
done
echo 'Deployment HTTPS verification failed. Restore the saved backup if needed; see deploy/README.md.' >&2
exit 1
