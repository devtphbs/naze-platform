import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/browse?category=${category.name}`} className="category-card nz-card" id={`category-${category.id}`}>
      <div className="cat-art">{category.emoji}</div>
      <div className="cat-info">
        <div className="cat-name">{category.name}</div>
        <div className="cat-viewers">{category.viewers} viewers</div>
      </div>
    </Link>
  );
}
