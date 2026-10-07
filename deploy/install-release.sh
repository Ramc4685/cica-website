#!/usr/bin/env bash
# Executed on the host over verified SSH; only the two named document roots are accepted.
set -euo pipefail
umask 022
release=${1:-}
site=${2:-}
[[ "$release" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]] || { echo 'Invalid release identifier' >&2; exit 1; }
account=/home/cicanrkn
case "$site" in
  # Production paths are unchanged so existing manifests and backups stay valid.
  production) target="$account/public_html"; manifest="$account/.cica-deploy-manifest"; backup="$account/.cica-backups/$release" ;;
  staging) target="$account/staging_html"; manifest="$account/.cica-staging-manifest"; backup="$account/.cica-backups/staging-$release" ;;
  *) echo 'Deployment target must be production or staging' >&2; exit 1 ;;
esac
stage="$account/.cica-deploy/$site-$release/site"
[[ -d "$target" && ! -L "$target" && -d "$stage" && ! -L "$stage" ]] || exit 1
[[ -f "$stage/index.html" && -f "$stage/.cica-manifest" && -f "$stage/deployment.json" ]] || exit 1
[[ ! -L "$manifest" ]] || exit 1
[[ ! -L "$target/.cica-manifest" ]] || exit 1

safe_path() {
  local file=$1 parent
  [[ "$file" =~ ^[a-zA-Z0-9_./-]+$ ]] || return 1
  case "/$file/" in
    *'/../'*|*'/./'*|*'//'*) return 1 ;;
  esac
  case "$file" in
    /*|.well-known|.well-known/*|cgi-bin|cgi-bin/*|.cica-manifest) return 1 ;;
  esac
  parent="$target/$file"
  while [[ "$parent" != "$target" ]]; do
    [[ ! -L "$parent" ]] || return 1
    parent=${parent%/*}
  done
}

# Validate every deletion/copy before changing the live tree.
for list in "$stage/.cica-manifest" "$manifest"; do
  if [[ -f "$list" ]]; then
    while IFS= read -r file; do
      [[ -n "$file" ]] || continue
      safe_path "$file" || { echo 'Unsafe file in deployment manifest' >&2; exit 1; }
    done < "$list"
  fi
done
for owned in _next admin admin-login admin.html admin.txt admin-login.html admin-login.txt; do
  safe_path "$owned" || { echo 'Symlink at a managed site path' >&2; exit 1; }
done
[[ -z "$(find "$stage" -type l -print -quit)" ]] || { echo 'Symlink in staged release' >&2; exit 1; }

mkdir -p "$backup/retired"
chmod 700 "$account/.cica-backups" "$backup" "$backup/retired"
tar -czf "$backup/public_html.tar.gz" -C "$target" .
chmod 600 "$backup/public_html.tar.gz"
if [[ -f "$manifest" ]]; then cp "$manifest" "$backup/previous-manifest"; fi

rollback() {
  trap - ERR
  set +e
  local result=0 file owned original="$backup/restore"
  mkdir -p "$original" "$backup/failed"
  tar -xzf "$backup/public_html.tar.gz" -C "$original" || result=1
  if [[ "$result" == 0 ]]; then
    for owned in _next admin admin-login admin.html admin.txt admin-login.html admin-login.txt; do
      if [[ -e "$target/$owned" ]]; then mv -- "$target/$owned" "$backup/failed/$owned" || result=1; fi
      if [[ -e "$original/$owned" ]]; then cp -pR "$original/$owned" "$target/$owned" || result=1; fi
    done
    for list in "$stage/.cica-manifest" "$backup/previous-manifest"; do
      [[ -f "$list" ]] || continue
      while IFS= read -r file; do
        [[ -n "$file" ]] || continue
        case "$file" in _next/*|admin/*|admin-login/*|admin.html|admin.txt|admin-login.html|admin-login.txt) continue ;; esac
        if [[ -f "$original/$file" ]]; then
          mkdir -p "$(dirname "$target/$file")"
          cp -p "$original/$file" "$target/$file" || result=1
        elif [[ -f "$target/$file" ]]; then
          rm -- "$target/$file" || result=1
        fi
      done < "$list"
    done
    rm -f -- "$target/.cica-manifest"
    if [[ -f "$backup/previous-manifest" ]]; then cp "$backup/previous-manifest" "$manifest" || result=1
    else rm -f -- "$manifest"; fi
  fi
  if [[ "$result" == 0 ]]; then echo 'Installation failed; previous website and manifest restored.' >&2
  else echo 'Installation and automatic rollback failed; restore the outside-webroot backup manually.' >&2; fi
  exit 1
}
trap rollback ERR
if [[ -f "$manifest" ]]; then
  # Retire only files owned by earlier releases; retain unrelated hosting files.
  while IFS= read -r file; do
    [[ -n "$file" ]] || continue
    if ! grep -Fqx -- "$file" "$stage/.cica-manifest"; then
      if [[ -f "$target/$file" ]]; then rm -- "$target/$file"; fi
    fi
  done < "$manifest"
fi

# Bootstrap cleanup also removes old credential-bearing JS/admin exports from
# the manual deployment, before this pipeline had an ownership manifest.
for owned in _next admin admin-login admin.html admin.txt admin-login.html admin-login.txt; do
  if [[ -e "$target/$owned" ]]; then mv -- "$target/$owned" "$backup/retired/$owned"; fi
done
cp -R "$stage/." "$target/"
rm -- "$target/.cica-manifest"
if [[ "$site" == staging ]]; then
  # Keep the shared staging copy out of search results.
  printf '\n<IfModule mod_headers.c>\n  Header always set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n' >> "$target/.htaccess"
fi
cp "$stage/.cica-manifest" "$manifest"
while IFS= read -r file; do
  [[ -n "$file" ]] || continue
  chmod 644 "$target/$file"
  parent=${file%/*}
  while [[ "$parent" != "$file" && "$parent" != '.' ]]; do
    chmod 755 "$target/$parent"
    file=$parent
    parent=${file%/*}
  done
done < "$manifest"
trap - ERR
rm -rf -- "$account/.cica-deploy/$site-$release"
printf 'Installed %s release %s; backup outside the webroot: %s\n' "$site" "$release" "$backup/public_html.tar.gz"
