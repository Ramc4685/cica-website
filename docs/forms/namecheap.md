# Hosted forms

The public forms POST to `/forms/submit.php` with `type` contact, updates or sponsor. JavaScript sends JSON; a browser without JavaScript can post `application/x-www-form-urlencoded` and is redirected to `/thank-you/?ref=<reference>` on success, or shown a small error page. PHP 8.1+ is required (the SSH CLI PHP 8.2 was verified during setup; the deploy smoke test also checks that the web handler runs the script). Deployment copies the file from `public/forms` into the static export. The browser frontend remains statically hosted.

Requests must originate from https://cicainfo.com or https://www.cicainfo.com. Other origins and GET requests are rejected. The handler identifies its site from the document root: on staging (`/home/cicanrkn/staging_html`) it accepts only https://staging.cicainfo.com, stores records in `/home/cicanrkn/.cica-forms-staging`, and prefixes notification subjects with `[STAGING]`. Any other document root refuses to save. A hidden `website` field (the form must submit it empty), server validation, a 16KB body limit and the limits below reduce basic automated abuse. These are not a complete defense against a determined bot.

## Responses

Success is `200 {"success":true,"reference":"<24 hex>"}`. Definite rejections are 4xx with a `message` the site shows to the visitor: 422 validation, 403 origin, 413/415 format, and 429 with `Retry-After` seconds. 5xx (including a busy lock) and network failures are the only cases the site presents as "may already have been saved".

## Storage and limits

Records are stored at `/home/cicanrkn/.cica-forms/requests.jsonl`, outside public_html, with 0700 directory and 0600 files. The lock, salt and rate bookkeeping are private as well. Raw IP addresses are not stored; a salted hash prefix is used per visitor, and expired entries are pruned.

- Per visitor: 10 requests per 10 minutes across all forms.
- Global: 60 requests per hour and 300 per day, then 429 for everyone until the window resets.
- Storage: when `requests.jsonl` reaches 80% of 20MiB, organizers@cicainfo.com is emailed (at most weekly). At 20MiB the file is archived as `requests-<UTC timestamp>.jsonl` in the same private directory and a new file starts; up to 10 archives are kept, after which requests are refused until organizers export and remove archives.
- Concurrent requests wait up to about three seconds for the write lock before returning a 503.

Retention: no automatic deletion is implemented. Records stay until an organizer deletes them with the helper below. TODO(organizers): decide a retention period and a recurring review, then state it on the privacy page.

Each accepted record gets an opaque reference. An organizer notification is sent through the host mail transport to organizers@cicainfo.com, with a fixed sender and validated reply address. A notification failure does not erase the saved request or incorrectly report save failure. PHP mail acceptance does not prove inbox delivery. Deployment does not overwrite the private directory; never publish it or restore it into public_html.

Updates requests are manually handled. This is not an automated newsletter service or tournament registration. The privacy page explains the hosting records and possible legacy Google Sheet records. The former Google Apps Script web apps were undeployed after this handler was verified in production; their Google Sheets remain only as records of earlier submissions.

## Managing stored records

`scripts/forms-records.php` lists, exports or deletes records by reference over SSH. It is not deployed to the web root. Pipe it to PHP on the host (SSH uses port 21098; the host is the `NAMECHEAP_SSH_HOST` value in [deploy/CI.md](../../deploy/CI.md)):

```sh
ssh -p 21098 cicanrkn@HOST php -- list < scripts/forms-records.php
ssh -p 21098 cicanrkn@HOST php -- export REFERENCE < scripts/forms-records.php
ssh -p 21098 cicanrkn@HOST php -- delete REFERENCE < scripts/forms-records.php
```

`list` prints reference, time, form type and file only (no personal fields). `export` prints one record to the terminal. `delete` removes the record from the live file and archives; the notification email in the organizer inbox must be deleted separately. The default directory is production's `/home/cicanrkn/.cica-forms`; add `--dir=/home/cicanrkn/.cica-forms-staging` for staging records, or any other path for a test directory.

## Verification and operation

`php -l public/forms/submit.php` and `php tests/forms-backend.php` check validation, private persistence, limits, rotation and locking without sending mail. `pnpm test:e2e` builds the static export and runs the Cypress form specs against `scripts/e2e.mjs`, which serves `out/` with a mock `/forms/submit.php` (the real handler is tied to the cPanel paths, so it is covered by the PHP tests); each spec also stubs the response with `cy.intercept`. `pnpm test:forms` runs the PHP checks. A release still needs the deploy smoke test and controlled submission checks; never count mocks as real delivery.

Run controlled tests on staging first. Use clearly marked synthetic content, an owner-approved reply email, and verify each record by reference without displaying its personal fields. Verify organizer notification receipt or the host delivery log separately. Do not automatically resubmit after a timeout: the record may already exist.

Hosting administrators can inspect private records through cPanel/SSH. No browser admin or public record endpoint exists. Protect cPanel access, and do not put mailbox or hosting passwords in source or browser code.
