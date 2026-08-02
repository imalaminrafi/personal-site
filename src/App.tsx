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
import NotFound from "./pages/NotFound";
import AboutMe from "./pages/AboutMe";
import AboutAlaminRafi from "./pages/AboutAlaminRafi";
import RssFeed from "./pages/RssFeed";
import AdminProjects from "./pages/AdminProjects";
import ProfessionalPage from "./pages/Professional";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AnalyticsTracker from "./components/analytics/AnalyticsTracker";
import ConsentBanner from "./components/analytics/ConsentBanner";
import BooksPage from "./pages/Books";
import ContactPage from "./pages/Contact";
import PricingPage from "./pages/Pricing";
import TestimonialsPage from "./pages/Testimonials";
import GalleryPage from "./pages/Gallery";
import FAQPage from "./pages/FAQ";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";

const queryClient = new QueryClient();

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
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/project/:id" element={<ProjectTrackerPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/about-me" element={<AboutMe />} />
                <Route path="/about-alamin-rafi" element={<AboutAlaminRafi />} />
                <Route path="/professional" element={<ProfessionalPage />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="/sitemap.xml" element={<SitemapPage />} />
                <Route path="/sitemap-images.xml" element={<SitemapPage />} />
                <Route path="/rss" element={<RssFeed />} />
                <Route path="/rss.xml" element={<RssFeed />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/pricing" element={<AdminPricing />} />
                <Route path="/admin/portfolio" element={<AdminPortfolio />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/media" element={<AdminMedia />} />
                <Route path="/admin/seo" element={<AdminSEO />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/about" element={<AdminAbout />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </AdminAuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );


export default App;
