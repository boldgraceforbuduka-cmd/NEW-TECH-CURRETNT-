import Link from 'next/link';

export default function AfricaPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Africa</h1>
      <ul className="space-y-2">
        <li><Link href="/africa/campus" className="text-blue-600 hover:underline">Campus</Link></li>
        <li><Link href="/africa/founders" className="text-blue-600 hover:underline">Founders</Link></li>
        <li><Link href="/africa/innovation" className="text-blue-600 hover:underline">Innovation</Link></li>
        <li><Link href="/africa/nigeria" className="text-blue-600 hover:underline">Nigeria</Link></li>
        <li><Link href="/africa/startups" className="text-blue-600 hover:underline">Startups</Link></li>
      </ul>
    </div>
  );
}