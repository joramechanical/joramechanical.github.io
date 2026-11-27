# Jora Mechanical Systems — website source (private backup)

Everything needed to rebuild the live site at https://joramechanical.github.io/

- `/` — province chooser (GTA · Saskatchewan · Calgary coming soon)
- `/gta/` — Ontario site, built by `generator/`
- `/saskatchewan/` — Saskatchewan (Saskatoon) site, built by `generator-sk/`
- Old GTA addresses (e.g. `/furnaces/`) redirect to `/gta/...`

| Folder | What's in it |
|---|---|
| `build_all.py` | Builds everything: both regional sites, the province chooser, redirects, sitemap index |
| `generator-sk/` | Saskatchewan site: same builder with Saskatchewan text (`content.py`), products incl. garage heaters (`data.js`), the Saskatchewan map (`map-source.html`), 3D models (`sol3d.js`) and the provincial-bird art (`grouse.svg`) |
| `generator/` | GTA page builder (`build_site.py`), page text (`content.py`), products & settings (`data.js`), scripts, styles, the service-area map (`map-source.html`) |
| `images/product-cutouts/` | Product photos with backgrounds removed |
| `images/brand-logos/` | Brand logos |
| `images/originals/` | Original photos as supplied |
| `single-page-version/` | The earlier one-page version (with admin panel) |
| `map/` | The standalone service-area map page |
| `tools/` | Photo cut-out scripts and site checks |

## Rebuild the site

Needs Python 3 and Node.js.

```
python3 build_all.py prod site-out
```

`site-out/` is what gets uploaded to the `joramechanical.github.io` project.
Use `preview` instead of `prod` for a private copy with search engines blocked.

## Where to change things

- Phone, email, licences, products, rebates, chat answers: `generator/data.js`
- Service, city, brand, blog and legal page text: `generator/content.py`
- Site address (e.g. a new domain): `SITE_URL` near the top of `generator/build_site.py`
