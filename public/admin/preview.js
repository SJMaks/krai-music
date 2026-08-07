import React from 'react';
import ReactDOM from 'react-dom';
import htm from 'htm';
import CMS from 'decap-cms';

const html = htm.bind(React.createElement);

// ---- Регистрируем стили ----
// Можно подключить внешний файл, либо встроить как строку (raw)
// Для простоты используем registerPreviewStyle с URL
CMS.registerPreviewStyle('/admin/preview.css');

// ---- Вспомогательная функция для получения URL изображения ----
function getImageUrl(asset) {
  if (!asset) return '';
  // asset – объект, возвращаемый getAsset()
  return asset.toString();
}

// ---- Компонент превью для исполнителей (artists) ----
const ArtistPreview = ({ entry, getAsset }) => {
  const data = entry.get('data');
  const nickname = data.get('nickname') || '';
  const biography = data.get('biography') || '';
  const verticalImage = getAsset(data.get('verticalImage'));
  const socials = data.get('socials') || [];
  const featuredTrack = data.get('featuredTrack') || '';

  return html`
    <div className="previewContainer">
      <div className="card">
        ${verticalImage && html`<img className="image" src=${getImageUrl(verticalImage)} alt=${nickname} />`}
        <h3>${nickname}</h3>
        <p>${biography}</p>
        ${socials.size > 0 && html`
          <div className="item">
            <span>Соцсети:</span>
            ${socials.map(s => html`<span key=${s.get('label')}>${s.get('label')}</span>`).join(' | ')}
          </div>
        `}
        ${featuredTrack && html`<div className="item">Выделенный трек ID: ${featuredTrack}</div>`}
      </div>
    </div>
  `;
};

// ---- Компонент превью для треков (tracks) ----
const TrackPreview = ({ entry, getAsset }) => {
  const data = entry.get('data');
  const title = data.get('title') || '';
  const cover = getAsset(data.get('cover'));
  const authors = data.get('authors') || []; // массив ID
  const description = data.get('description') || '';
  const releaseDate = data.get('releaseDate') || '';

  return html`
    <div className="previewContainer">
      <div className="card">
        ${cover && html`<img className="image" src=${getImageUrl(cover)} alt=${title} />`}
        <h3>${title}</h3>
        <div className="item">Авторы: ${authors.map(id => id).join(', ') || '—'}</div>
        <div className="item">Дата: ${releaseDate}</div>
        <p>${description}</p>
        <button className="secondaryButton">Слушать</button>
      </div>
    </div>
  `;
};

// ---- Компонент превью для мероприятий (events) ----
const EventPreview = ({ entry, getAsset }) => {
  const data = entry.get('data');
  const title = data.get('title') || '';
  const description = data.get('description') || '';
  const image = getAsset(data.get('image'));
  const date = data.get('date') || '';
  const location = data.get('location') || '';
  const links = data.get('links') || [];

  return html`
    <div className="previewContainer">
      <div className="card">
        ${image && html`<img className="image" src=${getImageUrl(image)} alt=${title} />`}
        <h3>${title}</h3>
        <div className="item"><span>📅</span> ${date}</div>
        <div className="item"><span>📍</span> ${location}</div>
        <p>${description}</p>
        ${links.size > 0 && html`
          <div className="item">
            Ссылки: ${links.map(l => html`<a href=${l.get('url')} target="_blank">${l.get('label')}</a>`).join(' | ')}
          </div>
        `}
        <button className="secondaryButton">Подробнее</button>
      </div>
    </div>
  `;
};

// ---- Компонент превью для услуг (services) ----
const ServicePreview = ({ entry, getAsset }) => {
  const data = entry.get('data');
  const title = data.get('title') || '';
  const description = data.get('description') || '';
  const image = getAsset(data.get('image'));

  return html`
    <div className="previewContainer">
      <div className="card">
        ${image && html`<img className="image" src=${getImageUrl(image)} alt=${title} />`}
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
    </div>
  `;
};

// ---- Компонент превью для главной страницы (homepage) ----
const HomepagePreview = ({ entry }) => {
  const data = entry.get('data');
  const heroTitle = data.get('heroTitle') || '';
  const heroSubtitle = data.get('heroSubtitle') || '';
  const featuredArtists = data.get('featuredArtists') || [];
  const featuredTracks = data.get('featuredTracks') || [];
  const featuredEvents = data.get('featuredEvents') || [];

  return html`
    <div className="previewContainer">
      <section className="hero">
        <h1 className="title">${heroTitle}</h1>
        <p className="subtitle">«<span style="color:#c71d1b">Край</span><span style="color:#fff">Music</span>» ${heroSubtitle}</p>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>Выделенные артисты</h2>
        </div>
        <div className="previewGrid">
          ${featuredArtists.map(id => html`<div key=${id} className="card">ID: ${id}</div>`)}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>Выделенные треки</h2>
        </div>
        <div className="previewGrid">
          ${featuredTracks.map(id => html`<div key=${id} className="card">ID: ${id}</div>`)}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>Выделенные мероприятия</h2>
        </div>
        <div className="previewGrid">
          ${featuredEvents.map(id => html`<div key=${id} className="card">ID: ${id}</div>`)}
        </div>
      </section>
    </div>
  `;
};

// ---- Компонент превью для контактов (contacts) ----
const ContactsPreview = ({ entry }) => {
  const data = entry.get('data');
  const email = data.get('email') || '';
  const phone = data.get('phone') || '';
  const address = data.get('address') || '';
  const socials = data.get('socials') || [];

  return html`
    <div className="previewContainer">
      <div className="card">
        <h3>Контакты</h3>
        <div className="item">📧 ${email}</div>
        <div className="item">📞 ${phone}</div>
        <div className="item">📍 ${address}</div>
        ${socials.size > 0 && html`
          <div className="item">
            Соцсети: ${socials.map(s => html`<span key=${s.get('label')}>${s.get('label')} (${s.get('url')})</span>`).join(' | ')}
          </div>
        `}
      </div>
    </div>
  `;
};

// ---- Регистрируем шаблоны ----
// Для папковых коллекций – имя коллекции
CMS.registerPreviewTemplate('artists', ArtistPreview);
CMS.registerPreviewTemplate('tracks', TrackPreview);
CMS.registerPreviewTemplate('events', EventPreview);
CMS.registerPreviewTemplate('services', ServicePreview);

// Для файловых коллекций – имя файла (из поля name)
CMS.registerPreviewTemplate('homepage', HomepagePreview);
CMS.registerPreviewTemplate('contacts', ContactsPreview);