// ===== 1. Подключаем стили =====
const cssText = `
.page {
  display: grid;
  gap: 3rem;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0 1rem;
}

.title {
  color: #c71d1b;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  max-width: 620px;
  color: rgba(207, 203, 203, 0.78);
  margin: 0.5rem 0 1rem;
  font-size: 1.2rem;
  text-align: center;
  border: 2px dashed #555;
  border-radius: 0 2rem 0 2rem;
  padding: 1.5rem;
}

.section {
  display: grid;
  gap: 1.2rem;
}

.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card {
  border: 1px solid rgba(207, 203, 203, 0.12);
  padding: 1rem;
  display: grid;
  gap: 0.8rem;
  background: #1a1a1a;
}

.image {
  width: 100%;
  object-fit: cover;
  aspect-ratio: 4 / 5;
  background: #2a2a2a;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #cfcbcb;
  text-decoration: none;
  font-weight: bold;
  flex-wrap: wrap;
  word-break: break-word;
}

.secondaryButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1rem;
  border: 1px solid #c71d1b;
  color: #cfcbcb;
  text-decoration: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
}

.previewGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.previewContainer {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
`;

CMS.registerPreviewStyle(cssText, { raw: true });

// ===== 2. Вспомогательная функция для изображений =====
function getImageUrl(asset) {
  if (!asset) return '';
  return asset.toString();
}

// ===== 3. Превью для исполнителей (artists) =====
var ArtistPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');
    var nickname = data.get('nickname') || '';
    var biography = data.get('biography') || '';
    var verticalImage = this.props.getAsset(data.get('verticalImage'));
    var socials = data.get('socials') || [];
    var featuredTrack = data.get('featuredTrack') || '';

    return h('div', { className: 'previewContainer' },
      h('div', { className: 'card' },
        verticalImage ? h('img', { className: 'image', src: getImageUrl(verticalImage), alt: nickname }) : null,
        h('h3', {}, nickname),
        h('p', {}, biography),
        socials.size > 0 ? h('div', { className: 'item' }, 'Соцсети: ' + socials.map(function(s) { return s.get('label'); }).join(' | ')) : null,
        featuredTrack ? h('div', { className: 'item' }, 'Выделенный трек ID: ' + featuredTrack) : null
      )
    );
  }
});

// ===== 4. Превью для треков (tracks) =====
var TrackPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');
    var title = data.get('title') || '';
    var cover = this.props.getAsset(data.get('cover'));
    var authors = data.get('authors') || [];
    var description = data.get('description') || '';
    var releaseDate = data.get('releaseDate') || '';

    return h('div', { className: 'previewContainer' },
      h('div', { className: 'card' },
        cover ? h('img', { className: 'image', src: getImageUrl(cover), alt: title }) : null,
        h('h3', {}, title),
        h('div', { className: 'item' }, 'Авторы: ' + (authors.size ? authors.join(', ') : '—')),
        h('div', { className: 'item' }, 'Дата: ' + releaseDate),
        h('p', {}, description),
        h('button', { className: 'secondaryButton' }, 'Слушать')
      )
    );
  }
});

// ===== 5. Превью для мероприятий (events) =====
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