import { Beer } from "@/lib/data";

export default function BeerVisual({ beer }: { beer: Beer }) {
  if (beer.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={beer.photo} alt={beer.nom} className="beer-photo" />;
  }
  return (
    <div className="beer-vis">
      <div className={`glass ${beer.style}`}>
        <div className="foam" />
      </div>
    </div>
  );
}
