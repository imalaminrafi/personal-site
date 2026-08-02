import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import Index from "./pages/Index";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import DashboardPage from "./pages/Dashboard";
import ProjectTrackerPage from "./pages/ProjectTracker";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import PortfolioPage from "./pages/Portfolio";
import PortfolioProjectPage from "./pages/PortfolioProject";
import SitemapPage from "./pages/Sitemap";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminBook from "./pages/admin/AdminBook";
import NotFound from "./pages/NotFound";
import AboutMe from "./pages/AboutMe";
import AboutAlaminRafi from "./pages/AboutAlaminRafi";
import RssFeed from "./pages/RssFeed";
import AdminProjects from "./pages/AdminProjects";
import ProfessionalPage from "./pages/Professional";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AnalyticsTracker from "./components/analytics/AnalyticsTracker";
import ConsentBanner from "./components/analytics/ConsentBanner";
import PageBoundary from "./components/PageBoundary";
import BooksPage from "./pages/Books";
import BookDetailPage from "./pages/BookDetail";
import ContactPage from "./pages/Contact";
import PricingPage from "./pages/Pricing";
import TestimonialsPage from "./pages/Testimonials";
import GalleryPage from "./pages/Gallery";
import FAQPage from "./pages/FAQ";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";

const queryClient = new QueryClient();

/** Wrap each route so a crashing page can't blank the whole app. */
const page = (element: React.ReactNode) => <PageBoundary>{element}</PageBoundary>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AdminAuthProvider>
              <AnalyticsTracker />
              <ConsentBanner />
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
              </AdminAuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );


export default App;
