import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  TrendingUp,
  Map,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-linear-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge className="mb-4" variant="secondary">
              🚀 Your Career Transition Partner
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Master Cybersecurity
              <br />
              <span className="text-primary">
                From Developer to Security Engineer
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-xl">
              Complete guide to cybersecurity certifications, career roadmaps,
              market insights, and curated study resources. All in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg">
                <Link href="/certifications">
                  Browse Certifications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/roadmap">View Career Roadmaps</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg">
              A comprehensive platform designed for career transitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Link href="/certifications">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <img src="/logo.png" alt="CYBER PORTAL" style={{ width: 56, height: 56, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(139,92,246,0.5))", marginBottom: "1rem" }} />
                  <CardTitle>100+ Certifications</CardTitle>
                  <CardDescription>
                    Complete catalog from Security+ to OSCP. Filter by level,
                    category, and cost.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Detailed exam information
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Cost comparison by region
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Prerequisites mapped
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 2 */}
            <Link href="/roadmap">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <Map className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Visual Roadmaps</CardTitle>
                  <CardDescription>
                    Interactive career paths from beginner to advanced. See your
                    progression clearly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />3
                      predefined career paths
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Interactive graph visualization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Estimated timelines
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 3 */}
            <Link href="/market">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Market Analysis</CardTitle>
                  <CardDescription>
                    Real data on job demand, salaries, and hiring trends across
                    6 regions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Salary impact analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Top hiring companies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Regional demand charts
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 4 */}
            <Link href="/resources">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <BookOpen className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Study Resources</CardTitle>
                  <CardDescription>
                    Curated courses, books, labs, and practice exams. Rated by
                    the community.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      100+ vetted resources
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Free and paid options
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Ratings and reviews
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 5 */}
            <Link href="/profile">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <Award className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Track Progress</CardTitle>
                  <CardDescription>
                    Personal dashboard to monitor your certification journey and
                    study hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Study time tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Progress percentages
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Personalized study plan
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 6 */}
            <Link href="/certifications/compare">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Compare & Decide</CardTitle>
                  <CardDescription>
                    Side-by-side comparison with ROI calculator. Make
                    data-driven decisions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Compare up to 3 certs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ROI calculator included
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Cost-benefit analysis
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Your Cybersecurity Journey?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals transitioning into cybersecurity.
            Get started with our proven roadmaps today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/roadmap">
                View Career Paths
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/certifications">Browse Certifications</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Certifications</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">6</div>
              <div className="text-muted-foreground">Global Regions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Study Resources</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <div className="text-muted-foreground">Career Paths</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
