import { redirect } from 'next/navigation';

export default function SciencePage() {
  redirect('/news?category=science');
      <h1 className="text-3xl font-bold mb-6">Science</h1>
      <ul className="space-y-2">
        <li><Link href="/science/biotech" className="text-blue-600 hover:underline">Biotech</Link></li>
        <li><Link href="/science/quantum" className="text-blue-600 hover:underline">Quantum</Link></li>
        <li><Link href="/science/robotics" className="text-blue-600 hover:underline">Robotics</Link></li>
        <li><Link href="/science/space" className="text-blue-600 hover:underline">Space</Link></li>
      </ul>
    </div>
  );
}