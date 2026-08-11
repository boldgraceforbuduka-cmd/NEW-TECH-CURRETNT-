import { redirect } from 'next/navigation';

export default function GadgetsPage() {
  redirect('/news?category=gadgets');
      <h1 className="text-3xl font-bold mb-6">Gadgets</h1>
      <ul className="space-y-2">
        <li><Link href="/gadgets/comparisons" className="text-blue-600 hover:underline">Comparisons</Link></li>
        <li><Link href="/gadgets/reviews" className="text-blue-600 hover:underline">Reviews</Link></li>
        <li><Link href="/gadgets/wearables" className="text-blue-600 hover:underline">Wearables</Link></li>
      </ul>
    </div>
  );
}