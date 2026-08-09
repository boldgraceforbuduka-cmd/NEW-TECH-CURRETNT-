export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-heading font-bold mb-6">About Tech Current</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          <strong>Tech Current</strong> is a modern technology media platform dedicated to making
          technology easier to understand and harder to ignore. We bring together the latest developments
          in AI, software, startups, cybersecurity, gadgets, and the digital world.
        </p>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4">About the Founder</h2>
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              BO
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold">Buduka Oyagiri</h3>
              <p className="text-sm text-muted-foreground">Founder, Tech Current</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            <strong>Buduka Oyagiri</strong> is a Computer Science student, technology enthusiast, and
            aspiring builder passionate about the intersection of technology, innovation, business,
            and human impact.
          </p>
          <p className="text-muted-foreground mt-2">
            As the founder of <strong>Tech Current</strong>, Buduka created the platform to make
            technology easier to understand and harder to ignore—bringing together the latest
            developments in AI, software, startups, cybersecurity, gadgets, and the digital world.
          </p>
          <p className="text-muted-foreground mt-2">
            He believes technology is not just something to consume; it is something to
            <strong> understand, build with, and use to create meaningful change</strong>.
          </p>
          <p className="text-muted-foreground mt-2 italic">
            Tech Current is part of that journey: helping people stay informed, curious, and ready
            for what comes next.
          </p>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4">Our Mission</h2>
        <p className="text-muted-foreground">
          To make technology knowledge accessible, engaging, and actionable.
        </p>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4">Our Vision</h2>
        <p className="text-muted-foreground">
          To become Africa&apos;s most trusted technology media platform.
        </p>
      </div>
    </div>
  );
}