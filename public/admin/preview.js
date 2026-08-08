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

.horizontalImage {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
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

.info-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
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

.homepage {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(207, 203, 203, 0.12);
  padding: 1rem;
}

.title {
  color: #c71d1b;
  font-size: 3rem;
  margin-bottom: 2rem;
}

.subtitle {
  max-width: 620px;
  color: rgba(207, 203, 203, 0.78);
  margin: 1rem 0 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  border: 2px dashed #555;
  border-radius: 0 3rem 0 3rem;
  padding: 3rem;
}
`;

CMS.registerPreviewStyle(cssText, { raw: true });

function CalendarIcon(props) {
  return h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...props
    },
    h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }),
    h('line', { x1: 16, y1: 2, x2: 16, y2: 6 }),
    h('line', { x1: 8, y1: 2, x2: 8, y2: 6 }),
    h('line', { x1: 3, y1: 10, x2: 21, y2: 10 })
  );
}

function MapPinIcon(props) {
  return h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...props
    },
    h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
    h('circle', { cx: 12, cy: 10, r: 3 })
  );
}

function MailIcon(props) {
  return h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...props
    },
    h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
    h('polyline', { points: '22,6 12,13 2,6' })
  );
}

function PhoneIcon(props) {
  return h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...props
    },
    h('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
  );
}

function getImageUrl(asset) {
  if (!asset) return '';
  return asset.toString();
}

var ArtistPreview = createClass({
  render: function () {
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
      socials.size > 0 ? h('div', { className: 'socials' }, socials.map(function (s) {
        return h('a', { href: s.get('url') }, s.get('label'));
      })) : null
    );
  }
});

var TrackPreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get('data');
    var title = data.get('title') || '';
    var cover = this.props.getAsset(data.get('cover'));
    var description = data.get('description') || '';
    var releaseDate = data.get('releaseDate') || '';
    var releaseType = data.get('releaseType') || '';

    function formatDate(dateString) {
      if (!dateString) return 'Дата не указана';
      var date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      var day = String(date.getDate()).padStart(2, '0');
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var year = date.getFullYear();
      return day + '.' + month + '.' + year;
    }

    return h('div', { className: 'container' },
      cover ? h('img', { className: 'squareImage', src: getImageUrl(cover), alt: title }) : null,
      h('p', { className: 'eyebrow' }, 'Новый релиз'),
      h('h1', {}, title),
      h('h3', {}, 'Тип релиза: ' + releaseType),
      h('h3', {}, 'Дата релиза: ' + formatDate(releaseDate)),
      h('p', {}, description),
      h('a', { className: 'secondaryLink' }, 'Слушать')
    );
  }
});

var EventPreview = createClass({
  render: function () {
    var { FiCalendar, FiMapPin } = window;

    var entry = this.props.entry;
    var data = entry.get('data');
    var title = data.get('title') || '';
    var description = data.get('description') || '';
    var image = this.props.getAsset(data.get('image'));
    var date = data.get('date') || '';
    var location = data.get('location') || '';
    var links = data.get('links') || [];

    function formatDate(dateString) {
      if (!dateString) return 'Дата не указана';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    return h('div', { className: 'container' },
      image ? h('img', { className: 'horizontalImage', src: getImageUrl(image), alt: title }) : null,
      h('p', { className: 'eyebrow' }, 'Мероприятие'),
      h('h1', {}, title),
      h('p', {}, description),
      h('div', { className: 'info-line' },
        h(CalendarIcon, { style: { marginRight: '8px' } }),
        formatDate(date)
      ),
      h('div', { className: 'info-line' },
        h(MapPinIcon, { style: { marginRight: '8px' } }),
        location || 'Место не указано'
      ),
      links.size > 0 ? h('div', { className: 'socials' }, links.map(function (s) {
        return h('a', { href: s.get('url') }, s.get('label'));
      })) : null
    );
  }
});

var ServicePreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get('data');
    var title = data.get('title') || '';
    var description = data.get('description') || '';
    var image = this.props.getAsset(data.get('image'));

    return h('div', { className: 'container' },
      image ? h('img', { className: 'squareImage', src: getImageUrl(image), alt: title }) : null,
      h('p', { className: 'eyebrow' }, 'Услуга'),
      h('h1', {}, title),
      h('p', {}, description)
    );
  }
});

var HomepagePreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get('data');
    var heroTitle = data.get('heroTitle') || '';
    var heroSubtitle = data.get('heroSubtitle') || '';

    return h('div', { className: 'homepage' },
      h('h1', { className: 'title' }, heroTitle),
      h('p', { className: 'subtitle' },
        '«', h('span', { style: { color: '#c71d1b' } }, 'Край'),
        h('span', { style: { color: '#fff' } }, 'Music'),
        '»', heroSubtitle
      )
    );
  }
});

var ContactsPreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get('data');
    var email = data.get('email') || '';
    var phone = data.get('phone') || '';
    var address = data.get('address') || '';
    var socials = data.get('socials') || [];

    var lineStyle = { display: 'flex', alignItems: 'center', margin: '0.5rem 0' };
    var iconStyle = { marginRight: '8px', flexShrink: 0 };

    return h('div', { className: 'previewContainer' },
      h('div', { className: 'card' },
        h('h3', {}, 'Контакты'),
        h('div', { style: lineStyle },
          h(MailIcon, { style: iconStyle }),
          email
        ),
        h('div', { style: lineStyle },
          h(PhoneIcon, { style: iconStyle }),
          phone
        ),
        h('div', { style: lineStyle },
          h(MapPinIcon, { style: iconStyle }),
          address || 'Адрес не указан'
        ),
        socials.size > 0 ? h('div', { className: 'socials' }, socials.map(function (s) {
          return h('a', { href: s.get('url') }, s.get('label'));
        })) : null
      )
    );
  }
});

CMS.registerPreviewTemplate('artists', ArtistPreview);
CMS.registerPreviewTemplate('tracks', TrackPreview);
CMS.registerPreviewTemplate('events', EventPreview);
CMS.registerPreviewTemplate('services', ServicePreview);

CMS.registerPreviewTemplate('homepage', HomepagePreview);
CMS.registerPreviewTemplate('contacts', ContactsPreview);