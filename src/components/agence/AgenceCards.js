import StackCards from '@/components/home/StackCards';

export default function AgenceCards({ title, desc, cards = [] }) {
  return (
    <div className="agence-cards">
      <div className="agence-cards--title">
        <h2 className="title">{title}</h2>
        <p>{desc}</p>
      </div>
      <StackCards cards={cards} />
    </div>
  );
}
