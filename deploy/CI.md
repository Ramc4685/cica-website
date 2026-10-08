# CI and automatic Namecheap deployment

The live public website is https://cicainfo.com at `/home/cicanrkn/public_html`.
Staging is https://staging.cicainfo.com at `/home/cicanrkn/staging_html`.
The workflow `.github/workflows/namecheap.yml` checks pull requests and builds
each push to `main`. It uses Node 22, pnpm 11.13.0, the frozen lockfile, TypeScript,
ESLint, PHP form validation/persistence checks (without sending mail),
the repository's Jest component/form tests, deployment regression tests, a static export, admin security tests against the
built export, and local link/asset validation. Serialized deployment jobs skip
superseded commits. Build jobs and pull requests never receive deployment credentials.

## Release flow: staging, then approved production

1. A push to `main` builds one artifact and deploys it to staging automatically.
2. The production job then waits on the **production** environment's required
   reviewer. Check https://staging.cicainfo.com, then approve the waiting run in
   GitHub Actions (**Review deployments**) to promote that exact artifact. Rejecting
   it, or leaving it, keeps production unchanged.
3. To try a branch before merging, run the workflow manually on that branch
   (**Actions → CI and Namecheap deployment → Run workflow**, or
   `gh workflow run namecheap.yml --ref <branch>`). Manual runs deploy to staging
   only; production deploys only from `main`.

Content edits made through Pages CMS publish automatically. `deploy/classify-change.mjs` compares
the pushed commit with the commit production serves (`https://cicainfo.com/deployment.json`). When
every changed file since then is under `content/`, the `deploy-content` job deploys the
staging-verified artifact to production without approval (environment `production-content`), after
re-checking against the live commit just before it deploys. Anything else, including a content
edit stacked on a code change that is still waiting for approval, an unreadable live commit or
rewritten history, goes to the approval-gated `deploy` job as before. The decision uses the files
changed, never the commit author or message. The `check` job fails the build on invalid content or an unsafe upload (wrong type,
over 10 MB, outside `content/uploads/{champions,photos}`, or any original under `public/uploads`), naming the field or file. See
[editing website content](../docs/content-editing.md).

Staging is a shared preview: deploying a branch replaces whatever staging showed
before. The installer adds a `noindex` header there, and staging forms save to
`/home/cicanrkn/.cica-forms-staging` with `[STAGING]` email subjects.

## Activate once

1. Enable SSH in cPanel **Manage Shell**. Confirm Bash, rsync and tar are available.
   Shared hosting uses port **21098**.
2. Generate a dedicated deployment SSH key without an interactive passphrase,
   authorize its public key in cPanel **SSH Access**, and keep the private key
   outside the repository. Do not use a personal key or cPanel password.
3. Verify the server public host-key fingerprint independently through Namecheap
   or a trusted channel. `ssh-keyscan` only retrieves a candidate key; it does not
   verify identity. The OpenSSH known-hosts entry must identify
   `[server315.web-hosting.com]:21098`. Host-key checking must remain enabled.
4. Create a GitHub environment named **production**, restrict its branches to
   `main`, add the release approver as a **required reviewer**, and enter the
   following secrets. Environment secrets are available for public repositories
   on GitHub Free; other repository visibility/plans need eligibility verification.
5. Create a GitHub environment named **staging** with no reviewers or branch
   restriction, and enter the same five secrets there.
6. In cPanel **Domains**, create `staging.cicainfo.com` with document root
   `/home/cicanrkn/staging_html`. At GoDaddy, add an `A` record `staging` →
   `192.64.118.48`, then run cPanel **SSL/TLS Status → Run AutoSSL** so staging
   has trusted HTTPS (deployment verification requires it).
7. Push/merge the reviewed changes to `main`, verify staging, approve production,
   then verify the live commit recorded in `https://cicainfo.com/deployment.json`.

| Production secret | Value |
| --- | --- |
| `NAMECHEAP_SSH_HOST` | `server315.web-hosting.com`, verify in cPanel |
| `NAMECHEAP_SSH_USER` | `cicanrkn` |
| `NAMECHEAP_SSH_PORT` | `21098` |
| `NAMECHEAP_SSH_PRIVATE_KEY` | Dedicated private key with its OpenSSH/PEM delimiters |
| `NAMECHEAP_SSH_KNOWN_HOSTS` | Independently verified host-key line for the host and port |

The key authenticates as the cPanel account; Namecheap does not scope it to one
website directory. The script guards the exact CICA root, but stolen SSH access
could affect other account files. Review workflow changes, restrict GitHub secret
access, and revoke/rotate the key if needed. Never commit, print or share private
keys/passwords in chat. Code alone does not activate unattended deployment:
SSH authorization and these GitHub secrets must first be configured.

Recommended `main` protection: require **Typecheck and static export**, PR review,
and no force pushes. v0 sync must obey the same protections before publishing.

## What deployment does

OpenSSH and rsync stage a complete validated artifact before changing live files.
Strict SSH host-key checking and public-key authentication are mandatory. A
private backup is saved outside the webroot at
`/home/cicanrkn/.cica-backups/<sha>-<run>-<attempt>/public_html.tar.gz`
(staging: `.cica-backups/staging-<sha>-<run>-<attempt>/`). Production and staging
keep separate ownership manifests, so neither deployment touches the other's files.
The script retires only files owned by a previous deployment manifest. First-run
cleanup also removes all old `_next` and admin/admin-login exports, including
flat HTML/text variants, so old credential-bearing browser bundles disappear.
It preserves unrelated hosting files, `.well-known`, `cgi-bin`, the separate mail
document root, and email configuration. Public file/directory permissions are
normalized to 644/755.

The artifact includes `forms/submit.php`, which requires PHP 8.1 or later in the
website's HTTP handler. Form records are stored in `/home/cicanrkn/.cica-forms`,
outside the public root and deployment manifest; deployments never replace them.
See `docs/forms/namecheap.md` for the storage and notification contract.

An installation error automatically restores previous managed website files and
the prior manifest, preserving unrelated hosting files. The copy is not an atomic
whole-site swap, so there can be a brief transition between asset versions.
Trusted HTTPS must then return the exact deployment commit and a successful
homepage. A post-install HTTPS verification failure fails Actions and calls for
investigation; it does not automatically roll back a successfully installed tree
because DNS/cache/network failures can be unrelated to installation.

Backups are not automatically deleted. Review hosting disk usage and retain the
backups needed. Prefer deploying a corrected commit on `main` for recovery. If
manually restoring, stop concurrent deployment and restore a known-safe release
plus its ownership manifest. The original October 7 launch backup contains the
old prototype admin login; never restore it unchanged. Do not wipe certificate
validation, CGI, or unrelated files when removing a failed release's owned paths.

## Local checks

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
php -l public/forms/submit.php
php tests/forms-backend.php
pnpm test --runInBand
node --test deploy/tests/*.test.mjs
pnpm build:namecheap
CICA_TEST_EXPORT_DIR=out node --test tests/admin-security.test.mjs
cp deploy/namecheap.htaccess out/.htaccess
node deploy/prepare-release.mjs out "$(git rev-parse HEAD)"
```

`deployment.json` identifies a commit: deploy a committed reviewed tree, not an
uncommitted build with an old SHA. Manual cPanel uploads must remove the uploaded
`.cica-manifest` from the webroot and retire stale `_next`/admin assets too.

DNS remains at GoDaddy. Both website and the subsequently corrected mail A
record use `192.64.118.48`. Website and mail certificates expire April 23, 2027.
This pipeline does not renew hosting subscriptions or SSL certificates.

Official references: [Namecheap SSH and port](https://www.namecheap.com/support/knowledgebase/article.aspx/1016/89/how-to-access-a-hosting-account-via-ssh/),
[enable SSH](https://www.namecheap.com/support/knowledgebase/article.aspx/10040/2210/how-to-enable-ssh-shell-in-cpanel/),
[authorize keys](https://www.namecheap.com/support/knowledgebase/article.aspx/9428/89/how-to-connect-via-ssh-using-keys/),
[GitHub environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments),
and [environment restrictions/availability](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).
