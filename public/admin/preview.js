const cssText = `
body {
  font-family: Inter, 'IBM Plex Sans', 'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #cfcbcb;
  background-color: #111111;
  color-scheme: dark;
}

.container {
    border: 1px solid rgba(207, 203, 203, 0.12);
    padding: 1rem;
}

.squareImage {
  aspect-ratio: 1 / 1;
  max-width: 24rem;
  object-fit: cover;
  width: 100%;
}

.verticalImage {
  aspect-ratio: 4 / 5;
  max-width: 24rem;
  object-fit: cover;
  width: 100%;
}

.eyebrow {
  color: #c71d1b;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.authors {
  font-weight: normal;
  color: #828282;
}

.socials {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.socials a {
  color: #cfcbcb;
  border: 1px solid rgba(207, 203, 203, 0.16);
  padding: 0.7rem 1rem;
  background: transparent;
  text-decoration: none;
  cursor: pointer;
}

.secondaryLink {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.2rem;
  border: 1px solid #c71d1b;
  color: #cfcbcb;
  text-decoration: none;
  background: transparent;
  cursor: pointer;
}
`;

CMS.registerPreviewStyle(cssText, { raw: true });

function getImageUrl(asset) {
  if (!asset) return '';
  return asset.toString();
}

var ArtistPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');
    var nickname = data.get('nickname') || '';
    var biography = data.get('biography') || '';
    var verticalImage = this.props.getAsset(data.get('verticalImage'));
    var squareImage = this.props.getAsset(data.get('squareImage'));
    var socials = data.get('socials') || [];

    return h('div', { className: 'container' },
      squareImage ? h('img', { className: 'squareImage', src: getImageUrl(squareImage), alt: nickname }) : null,
      verticalImage ? h('img', { className: 'verticalImage', src: getImageUrl(verticalImage), alt: nickname }) : null,
      h('p', { className: 'eyebrow' }, 'Профиль артиста'),
      h('h1', {}, nickname),
      h('p', {}, biography),
      socials.size > 0 ? h('div', { className: 'socials' }, socials.map(function(s) {
         return h('a', {href: s.get('url')}, s.get('label')); 
      })) : null
    );
  }
});

var TrackPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');
    var title = data.get('title') || '';
    var cover = this.props.getAsset(data.get('cover'));
    var authors = data.get('authors') || [];
    var description = data.get('description') || '';
    var releaseDate = data.get('releaseDate') || '';
    var releaseType = data.get('releaseType') || '';

    function formatDate(dateString) {
      if (!dateString) return 'Дата не указана'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    }

    return h('div', { className: 'container' },
      cover ? h('img', { className: 'squareImage', src: getImageUrl(cover), alt: title }) : null,
      h('p', { className: 'eyebrow' }, 'Новый релиз'),
      h('h1', {}, title),
      h('h3', { className: 'authors' }, socials.map(function(s) {
         return s.get('nickname'); 
      }).join(', ')),
      h('h3', {}, 'Тип релиза: ' + releaseType),
      h('h3', {}, 'Дата релиза: ' + formatDate(releaseDate)),
      h('p', {}, description),
      h('a', { className: 'secondaryLink' }, Слушать),
    );
  }
});

var EventPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');
    var title = data.get('title') || '';
    var description = data.get('description') || '';
    var image = this.props.getAsset(data.get('image'));
    var date = data.get('date') || '';
    var location = data.get('location') || '';
    var links = data.get('links') || [];

    return h('div', { className: 'previewContainer' },
      h('div', { className: 'card' },
        image ? h('img', { className: 'image', src: getImageUrl(image), alt: title }) : null,
        h('h3', {}, title),
        h('div', { className: 'item' }, '📅 ' + date),
        h('div', { className: 'item' }, '📍 ' + location),
        h('p', {}, description),
        links.size > 0 ? h('div', { className: 'item' }, 
          'Ссылки: ' + links.map(function(l) { 
            return h('a', { href: l.get('url'), target: '_blank' }, l.get('label')); 
          }).join(' | ')
        ) : null,
        h('button', { className: 'secondaryButton' }, 'Подробнее')
      )
    );
  }
});

// ===== 6. Превью для услуг (services) =====
var ServicePreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');
    var title = data.get('title') || '';
    var description = data.get('description') || '';
    var image = this.props.getAsset(data.get('image'));

    return h('div', { className: 'previewContainer' },
      h('div', { className: 'card' },
        image ? h('img', { className: 'image', src: getImageUrl(image), alt: title }) : null,
        h('h3', {}, title),
        h('p', {}, description)
      )
    );
  }
});

// ===== 7. Превью для главной страницы (homepage) — ВАЖНО: имя файла =====
var HomepagePreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');
    var heroTitle = data.get('heroTitle') || '';
    var heroSubtitle = data.get('heroSubtitle') || '';
    var featuredArtists = data.get('featuredArtists') || [];
    var featuredTracks = data.get('featuredTracks') || [];
    var featuredEvents = data.get('featuredEvents') || [];

    return h('div', { className: 'previewContainer' },
      h('section', { className: 'hero' },
        h('h1', { className: 'title' }, heroTitle),
        h('p', { className: 'subtitle' }, 
          '«', h('span', { style: { color: '#c71d1b' } }, 'Край'), 
          h('span', { style: { color: '#fff' } }, 'Music'), 
          '»', heroSubtitle
        )
      ),
      h('section', { className: 'section' },
        h('div', { className: 'sectionHeader' },
          h('h2', {}, 'Выделенные артисты')
        ),
        h('div', { className: 'previewGrid' },
          featuredArtists.map(function(id) {
            return h('div', { key: id, className: 'card' }, 'ID: ' + id);
          })
        )
      ),
      h('section', { className: 'section' },
        h('div', { className: 'sectionHeader' },
          h('h2', {}, 'Выделенные треки')
        ),
        h('div', { className: 'previewGrid' },
          featuredTracks.map(function(id) {
            return h('div', { key: id, className: 'card' }, 'ID: ' + id);
          })
        )
      ),
      h('section', { className: 'section' },
        h('div', { className: 'sectionHeader' },
          h('h2', {}, 'Выделенные мероприятия')
        ),
        h('div', { className: 'previewGrid' },
          featuredEvents.map(function(id) {
            return h('div', { key: id, className: 'card' }, 'ID: ' + id);
          })
        )
      )
    );
  }
});

// ===== 8. Превью для контактов (contacts) — ВАЖНО: имя файла =====
var ContactsPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');
    var email = data.get('email') || '';
    var phone = data.get('phone') || '';
    var address = data.get('address') || '';
    var socials = data.get('socials') || [];

    return h('div', { className: 'previewContainer' },
      h('div', { className: 'card' },
        h('h3', {}, 'Контакты'),
        h('div', { className: 'item' }, '📧 ' + email),
        h('div', { className: 'item' }, '📞 ' + phone),
        h('div', { className: 'item' }, '📍 ' + address),
        socials.size > 0 ? h('div', { className: 'item' }, 
          'Соцсети: ' + socials.map(function(s) { 
            return s.get('label') + ' (' + s.get('url') + ')'; 
          }).join(' | ')
        ) : null
      )
    );
  }
});

// ===== 9. Регистрируем шаблоны =====
// Для папковых коллекций — имя коллекции
CMS.registerPreviewTemplate('artists', ArtistPreview);
CMS.registerPreviewTemplate('tracks', TrackPreview);
CMS.registerPreviewTemplate('events', EventPreview);
CMS.registerPreviewTemplate('services', ServicePreview);

// Для файловых коллекций — имя ФАЙЛА (не коллекции!) из вашего конфига
CMS.registerPreviewTemplate('homepage', HomepagePreview);  // имя файла
CMS.registerPreviewTemplate('contacts', ContactsPreview);  // имя файла