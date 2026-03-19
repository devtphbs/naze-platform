import { Link } from 'react-router-dom';

const formatViewers = (count) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count ? count.toString() : '0';
};

export default function StreamCard({ streamer, title, game, viewers, avatarUrl }) {
  return (
    <Link to={`/channel/${streamer}`} className="stream-card nz-card" id={`stream-card-${streamer}`}>
      <div className="thumbnail">
        <img src={avatarUrl} alt={title} className="thumbnail-img" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
        <div className="overlay-badges">
          <span className="nz-badge nz-badge-live">LIVE</span>
        </div>
        <div className="viewer-count">
          <span className="nz-badge nz-badge-viewers">{formatViewers(viewers)} viewers</span>
        </div>
      </div>
      <div className="card-body">
        <img src={avatarUrl} alt={streamer} className="avatar-ph" style={{ objectFit: 'cover' }} />
        <div className="card-info">
          <div className="card-title" title={title}>{title}</div>
          <div className="card-streamer">{streamer}</div>
          <div className="card-game">{game}</div>
        </div>
      </div>
    </Link>
  );
}
