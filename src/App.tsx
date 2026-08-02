import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import Index from "./pages/Index";
import AnalyticsTracker from "./components/analytics/AnalyticsTracker";
import ConsentBanner from "./components/analytics/ConsentBanner";
import PageBoundary from "./components/PageBoundary";

const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const ProjectTrackerPage = lazy(() => import("./pages/ProjectTracker"));
const BlogPage = lazy(() => import("./pages/Blog"));
const BlogPostPage = lazy(() => import("./pages/BlogPost"));
const PortfolioPage = lazy(() => import("./pages/Portfolio"));
const PortfolioProjectPage = lazy(() => import("./pages/PortfolioProject"));
const SitemapPage = lazy(() => import("./pages/Sitemap"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminPricing = lazy(() => import("./pages/admin/AdminPricing"));
const AdminPortfolio = lazy(() => import("./pages/admin/AdminPortfolio"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminAbout = lazy(() => import("./pages/admin/AdminAbout"));
const AdminBook = lazy(() => import("./pages/admin/AdminBook"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutMe = lazy(() => import("./pages/AboutMe"));
const AboutAlaminRafi = lazy(() => import("./pages/AboutAlaminRafi"));
const RssFeed = lazy(() => import("./pages/RssFeed"));
const AdminProjects = lazy(() => import("./pages/AdminProjects"));
const ProfessionalPage = lazy(() => import("./pages/Professional"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const BooksPage = lazy(() => import("./pages/Books"));
const BookDetailPage = lazy(() => import("./pages/BookDetail"));
const ContactPage = lazy(() => import("./pages/Contact"));
const PricingPage = lazy(() => import("./pages/Pricing"));
const TestimonialsPage = lazy(() => import("./pages/Testimonials"));
const GalleryPage = lazy(() => import("./pages/Gallery"));
const FAQPage = lazy(() => import("./pages/FAQ"));
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const TermsPage = lazy(() => import("./pages/Terms"));
/** Wrap each route so a crashing page can't blank the whole app. */
const page = (element: React.ReactNode) => <PageBoundary>{element}</PageBoundary>;

/** Shown briefly while a lazily-loaded route's chunk downloads. */
function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0A1628]" aria-hidden="true">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-violet-600" />
    </div>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AdminAuthProvider>
              <AnalyticsTracker />
              <ConsentBanner />
              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route path="/" element={page(<Index />)} />
                  <Route path="/login" element={page(<LoginPage />)} />
                  <Route path="/signup" element={page(<SignupPage />)} />
                  <Route path="/dashboard" element={page(<DashboardPage />)} />
                  <Route path="/project/:id" element={page(<ProjectTrackerPage />)} />
                  <Route path="/portfolio" element={page(<PortfolioPage />)} />
                  <Route path="/portfolio/:slug" element={page(<PortfolioProjectPage />)} />
                  <Route path="/blog" element={page(<BlogPage />)} />
                  <Route path="/blog/:slug" element={page(<BlogPostPage />)} />
                  <Route path="/books" element={page(<BooksPage />)} />
                  <Route path="/books/:id" element={page(<BookDetailPage />)} />
                  <Route path="/contact" element={page(<ContactPage />)} />
                  <Route path="/pricing" element={page(<PricingPage />)} />
                  <Route path="/testimonials" element={page(<TestimonialsPage />)} />
                  <Route path="/gallery" element={page(<GalleryPage />)} />
                  <Route path="/faq" element={page(<FAQPage />)} />
                  <Route path="/privacy" element={page(<PrivacyPage />)} />
                  <Route path="/terms" element={page(<TermsPage />)} />
                  <Route path="/about-me" element={page(<AboutMe />)} />
                  <Route path="/about-alamin-rafi" element={page(<AboutAlaminRafi />)} />
                  <Route path="/professional" element={page(<ProfessionalPage />)} />
                  <Route path="/sitemap" element={page(<SitemapPage />)} />
                  <Route path="/sitemap.xml" element={page(<SitemapPage />)} />
                  <Route path="/sitemap-images.xml" element={page(<SitemapPage />)} />
                  <Route path="/rss" element={page(<RssFeed />)} />
                  <Route path="/rss.xml" element={page(<RssFeed />)} />
                  <Route path="/admin" element={page(<AdminLogin />)} />
                  <Route path="/admin/login" element={page(<AdminLogin />)} />
                  <Route path="/admin/dashboard" element={page(<AdminDashboard />)} />
                  <Route path="/admin/blog" element={page(<AdminBlog />)} />
                  <Route path="/admin/pricing" element={page(<AdminPricing />)} />
                  <Route path="/admin/portfolio" element={page(<AdminPortfolio />)} />
                  <Route path="/admin/projects" element={page(<AdminProjects />)} />
                  <Route path="/admin/testimonials" element={page(<AdminTestimonials />)} />
                  <Route path="/admin/gallery" element={page(<AdminGallery />)} />
                  <Route path="/admin/book" element={page(<AdminBook />)} />
                  <Route path="/admin/messages" element={page(<AdminMessages />)} />
                  <Route path="/admin/media" element={page(<AdminMedia />)} />
                  <Route path="/admin/seo" element={page(<AdminSEO />)} />
                  <Route path="/admin/settings" element={page(<AdminSettings />)} />
                  <Route path="/admin/analytics" element={page(<AdminAnalytics />)} />
                  <Route path="/admin/about" element={page(<AdminAbout />)} />
                  <Route path="*" element={page(<NotFound />)} />
                </Routes>
              </Suspense>
              </AdminAuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
  );


export default App;
