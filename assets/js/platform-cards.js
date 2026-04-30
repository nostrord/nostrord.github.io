// Upgrade platform card hrefs on the home page from the /download/ fallback to
// direct asset URLs when the GitHub API responds. Picks the best asset per
// platform regardless of filename versioning. If a platform has multiple
// variants (e.g. linux .deb + .rpm, macos arm64 + x64), the card keeps the
// /download/ fallback so the user can pick on the dedicated page.
(function() {
  var cards = document.querySelectorAll('[data-platform-asset]');
  if (!cards.length) return;
  fetch('https://api.github.com/repos/nostrord/nostrord/releases/latest', {
    headers: { 'Accept': 'application/vnd.github+json' }
  })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(release) {
      if (!release || !release.assets) return;
      var byPlatform = {};
      release.assets.forEach(function(a) {
        var name = (a.name || '').toLowerCase();
        var p = null;
        if (/\.apk$/.test(name))                              p = 'android';
        else if (/\.ipa$/.test(name))                         p = 'ios';
        else if (/\.(exe|msi)$/.test(name))                   p = 'windows';
        else if (/\.(dmg|pkg)$/.test(name))                   p = 'macos';
        else if (/\.(appimage|deb|rpm|flatpak)$/.test(name) ||
                 /\.tar\.(gz|xz|bz2)$/.test(name))            p = 'linux';
        if (!p) return;
        (byPlatform[p] = byPlatform[p] || []).push(a.browser_download_url);
      });
      cards.forEach(function(el) {
        var p = el.getAttribute('data-platform-asset');
        var assets = byPlatform[p];
        if (!assets || assets.length === 0) return;
        // Single variant → promote to direct download.
        // Multiple variants → keep /download/ fallback so user picks.
        if (assets.length === 1) el.setAttribute('href', assets[0]);
      });
    })
    .catch(function() { /* keep /download/ fallback */ });
})();
